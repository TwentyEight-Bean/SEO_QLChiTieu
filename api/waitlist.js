import { normalizeEmail, waitlistProvider } from './waitlist-provider.js';

// Rate limiting map (in-memory sliding window per server instance)
const rateLimitMap = new Map();

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'method_not_allowed',
      message: 'Phương thức không được hỗ trợ.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const rawEmail = (body.email || '');
    const source = (body.source || 'web').slice(0, 50);
    const consentVersion = (body.consent_version || 'v1_prelaunch').slice(0, 20);
    const honeypot = body.hp || body.hp_code || '';

    // 1. Anti-spam Honeypot Check
    if (honeypot) {
      // Bot trapped; respond with 200 without saving data
      return res.status(200).json({
        ok: true,
        message: 'Đã ghi nhận thông tin đăng ký.',
      });
    }

    // 2. Server-side Email Normalization & RFC 5322 Validation
    const email = normalizeEmail(rawEmail);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    if (!email || !emailRegex.test(email) || email.length > 254) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_email',
        message: 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.',
      });
    }

    // Check disposable email providers
    const domain = email.split('@')[1];
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'throwaway.com'];
    if (disposableDomains.includes(domain)) {
      return res.status(400).json({
        ok: false,
        error: 'disposable_email',
        message: 'Vui lòng sử dụng địa chỉ email chính thức để nhận thông báo.',
      });
    }

    // 3. Rate Limiting (max 5 submissions per IP per 10 minutes)
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
    } else {
      clientData.count += 1;
    }
    rateLimitMap.set(ip, clientData);

    if (clientData.count > 5) {
      return res.status(429).json({
        ok: false,
        error: 'rate_limited',
        message: 'Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau 10 phút.',
      });
    }

    // 4. Duplicate Check
    const existing = await waitlistProvider.findSubscriber(email);
    if (existing) {
      return res.status(200).json({
        ok: true,
        duplicate: true,
        message: 'Email này đã có trong danh sách chờ. Sổ Chi sẽ thông báo ngay khi ứng dụng ra mắt!',
      });
    }

    // 5. Persistent Save (Minimal Data Model: id, email, created_at, status, source, consent_version)
    const newSubscriber = await waitlistProvider.saveSubscriber({
      email,
      source,
      consentVersion,
    });

    // 6. Transactional Confirmation Email (if Resend is enabled)
    waitlistProvider.sendConfirmationEmail(email).catch(err => {
      console.error('[Waitlist Email Trigger Error]', err.message);
    });

    return res.status(201).json({
      ok: true,
      duplicate: false,
      subscriber_id: newSubscriber.id,
      message: 'Đăng ký thành công! Sổ Chi sẽ gửi một email ngắn thông báo khi ứng dụng chính thức ra mắt.',
    });
  } catch (err) {
    console.error('[Waitlist API Error]', err.message);
    return res.status(500).json({
      ok: false,
      error: 'server_error',
      message: 'Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.',
    });
  }
}
