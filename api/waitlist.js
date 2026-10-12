// Serverless API handler for /api/waitlist (Vercel, Netlify, Node server)
import fs from 'fs';
import path from 'path';

// Rate limiting map (in-memory per instance)
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
    return res.status(405).json({ ok: false, error: 'method_not_allowed', message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = (body.email || '').trim().toLowerCase();
    const source = (body.source || 'web').slice(0, 50);
    const honeypot = body.hp || body.hp_code || '';

    // 1. Anti-spam Honeypot Check
    if (honeypot) {
      // Spam bot triggered honeypot; respond with 200 to trick bot without saving
      return res.status(200).json({ ok: true, message: 'Đã ghi nhận thông tin.' });
    }

    // 2. Server-side Email Validation (RFC 5322 regex)
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

    // 3. Rate Limiting (max 5 requests per IP per 10 minutes)
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

    // 4. Persistence & Duplicate Check
    const dataDir = path.resolve(process.cwd(), 'data');
    const waitlistFile = path.resolve(dataDir, 'waitlist.json');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let subscribers = [];
    if (fs.existsSync(waitlistFile)) {
      try {
        subscribers = JSON.parse(fs.readFileSync(waitlistFile, 'utf8'));
      } catch {
        subscribers = [];
      }
    }

    const existing = subscribers.find(s => s.email === email);
    if (existing) {
      return res.status(200).json({
        ok: true,
        duplicate: true,
        message: 'Email này đã có trong danh sách chờ. Sổ Chi sẽ thông báo ngay khi ứng dụng ra mắt!',
      });
    }

    const newSubscriber = {
      email,
      source,
      createdAt: new Date().toISOString(),
      ipHash: Buffer.from(ip).toString('base64').slice(0, 8),
    };

    subscribers.push(newSubscriber);
    fs.writeFileSync(waitlistFile, JSON.stringify(subscribers, null, 2), 'utf8');

    // 5. External Webhook Forwarding (if configured)
    const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubscriber),
      }).catch(err => console.error('[Waitlist Webhook Error]', err));
    }

    return res.status(200).json({
      ok: true,
      duplicate: false,
      message: 'Đăng ký thành công! Sổ Chi sẽ gửi một email ngắn thông báo khi ứng dụng chính thức ra mắt.',
    });
  } catch (err) {
    console.error('[Waitlist API Error]', err);
    return res.status(500).json({
      ok: false,
      error: 'server_error',
      message: 'Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.',
    });
  }
}
