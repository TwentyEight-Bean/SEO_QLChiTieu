import crypto from 'crypto';

/**
 * Waitlist Subscriber Data Model
 * @typedef {Object} Subscriber
 * @property {string} id - Unique identifier (UUID)
 * @property {string} email - Normalized email address
 * @property {string} created_at - ISO 8601 creation timestamp
 * @property {'active' | 'unsubscribed'} status - Subscription status
 * @property {string} source - Attribution source (e.g. 'web', 'hero', 'mobile')
 * @property {string} consent_version - Consent disclosure version
 */

// Production configuration from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, '') || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'Sổ Chi <noreply@sochi.app>';
const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET || 'sochi-secure-launch-salt-2026';
const SITE_URL = (process.env.VITE_SITE_URL || 'https://sochi.app').replace(/\/$/, '');

// In-memory fallback storage (active when Supabase is not configured)
const memoryStore = new Map();

/**
 * Normalizes an email address.
 * Trims whitespace and converts to lowercase.
 * @param {string} email
 * @returns {string}
 */
export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Generates a tamper-proof HMAC-SHA256 signed token for unsubscribe flow.
 * Format: base64url(email:timestamp:signature)
 * @param {string} email
 * @returns {string}
 */
export function createUnsubscribeToken(email) {
  const norm = normalizeEmail(email);
  const ts = Date.now().toString(36);
  const data = `${norm}:${ts}`;
  const sig = crypto.createHmac('sha256', UNSUBSCRIBE_SECRET).update(data).digest('hex').slice(0, 32);
  const raw = `${data}:${sig}`;
  return Buffer.from(raw, 'utf8').toString('base64url');
}

/**
 * Verifies an unsubscribe token.
 * @param {string} token
 * @returns {{ valid: boolean, email?: string }}
 */
export function verifyUnsubscribeToken(token) {
  if (!token || typeof token !== 'string') return { valid: false };
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const parts = raw.split(':');
    if (parts.length !== 3) return { valid: false };
    const [normEmail, ts, sig] = parts;
    const data = `${normEmail}:${ts}`;
    const expectedSig = crypto.createHmac('sha256', UNSUBSCRIBE_SECRET).update(data).digest('hex').slice(0, 32);
    
    // Constant-time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(sig);
    const expectedBuffer = Buffer.from(expectedSig);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false };
    }

    return { valid: true, email: normEmail };
  } catch {
    return { valid: false };
  }
}

/**
 * Waitlist Provider Interface
 * Supports Supabase REST API as preferred persistent database,
 * with graceful in-memory/webhook adapter for serverless portability.
 */
export const waitlistProvider = {
  /**
   * Find subscriber by email
   * @param {string} rawEmail
   * @returns {Promise<Subscriber | null>}
   */
  async findSubscriber(rawEmail) {
    const email = normalizeEmail(rawEmail);
    if (!email) return null;

    // 1. Supabase Persistent Storage
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const url = `${SUPABASE_URL}/rest/v1/subscribers?email=eq.${encodeURIComponent(email)}&select=*`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            return list[0];
          }
        }
      } catch (err) {
        console.error('[Waitlist Provider] Supabase find error:', err.message);
      }
    }

    // 2. In-Memory fallback
    return memoryStore.get(email) || null;
  },

  /**
   * Save a new subscriber
   * @param {Object} params
   * @param {string} params.email
   * @param {string} [params.source='web']
   * @param {string} [params.consentVersion='v1_prelaunch']
   * @returns {Promise<Subscriber>}
   */
  async saveSubscriber({ email: rawEmail, source = 'web', consentVersion = 'v1_prelaunch' }) {
    const email = normalizeEmail(rawEmail);
    const subscriber = {
      id: crypto.randomUUID ? crypto.randomUUID() : `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      email,
      created_at: new Date().toISOString(),
      status: 'active',
      source: String(source).slice(0, 50),
      consent_version: String(consentVersion).slice(0, 20),
    };

    // 1. Supabase Persistent Storage
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const url = `${SUPABASE_URL}/rest/v1/subscribers`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(subscriber),
        });
        if (res.ok) {
          const created = await res.json();
          if (Array.isArray(created) && created.length > 0) {
            return created[0];
          }
        }
      } catch (err) {
        console.error('[Waitlist Provider] Supabase insert error:', err.message);
      }
    }

    // 2. Memory store
    memoryStore.set(email, subscriber);

    // 3. Webhook forwarding if configured
    const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: subscriber.id,
          email: subscriber.email,
          created_at: subscriber.created_at,
          status: subscriber.status,
          source: subscriber.source,
          consent_version: subscriber.consent_version,
        }),
      }).catch(err => console.error('[Waitlist Provider] Webhook forward error:', err.message));
    }

    return subscriber;
  },

  /**
   * Unsubscribe a subscriber
   * @param {string} rawEmail
   * @returns {Promise<boolean>}
   */
  async unsubscribeSubscriber(rawEmail) {
    const email = normalizeEmail(rawEmail);
    if (!email) return false;

    let updated = false;

    // 1. Supabase Persistent Storage
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const url = `${SUPABASE_URL}/rest/v1/subscribers?email=eq.${encodeURIComponent(email)}`;
        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'unsubscribed',
            updated_at: new Date().toISOString(),
          }),
        });
        if (res.ok) updated = true;
      } catch (err) {
        console.error('[Waitlist Provider] Supabase unsubscribe error:', err.message);
      }
    }

    // 2. Memory store
    if (memoryStore.has(email)) {
      const existing = memoryStore.get(email);
      existing.status = 'unsubscribed';
      existing.updated_at = new Date().toISOString();
      memoryStore.set(email, existing);
      updated = true;
    }

    return updated;
  },

  /**
   * Send confirmation email via Resend
   * @param {string} rawEmail
   * @returns {Promise<boolean>}
   */
  async sendConfirmationEmail(rawEmail) {
    const email = normalizeEmail(rawEmail);
    if (!RESEND_API_KEY || !email) {
      return false;
    }

    const token = createUnsubscribeToken(email);
    const unsubscribeUrl = `${SITE_URL}/huy-dang-ky?token=${encodeURIComponent(token)}`;

    const subject = 'Bạn đã vào danh sách chờ của Sổ Chi';
    const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; color: #1a1918; margin: 0; padding: 40px 20px;">
  <table align="center" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e7e4dc; padding: 40px; margin: 0 auto;">
    <tr>
      <td>
        <div style="font-size: 20px; font-weight: 600; color: #d04a2c; margin-bottom: 24px; letter-spacing: -0.5px;">
          Sổ Chi
        </div>
        <h1 style="font-size: 24px; font-weight: 400; line-height: 1.3; color: #1a1918; margin: 0 0 16px 0;">
          Bạn đã vào danh sách chờ của Sổ Chi
        </h1>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4845; margin: 0 0 20px 0;">
          Cảm ơn bạn đã quan tâm. Chúng tôi đã ghi nhận email <strong>${email}</strong> vào danh sách nhận thông báo sớm.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4845; margin: 0 0 24px 0;">
          Sổ Chi là ứng dụng quản lý chi tiêu cá nhân tối giản, tập trung vào thói quen ghi nhận trong 3 giây và giúp bạn hiểu dòng tiền thực tế của mình mà không tốn công sức.
        </p>
        <div style="background-color: #fbfaf7; border-left: 3px solid #d04a2c; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
          <p style="font-size: 13px; color: #6b6761; margin: 0; line-height: 1.5;">
            Chúng tôi cam kết không gửi thư quảng cáo rác. Bạn sẽ chỉ nhận một email ngắn thông báo ngay khi ứng dụng chính thức có mặt trên App Store và Google Play.
          </p>
        </div>
        <hr style="border: none; border-top: 1px solid #eeebe3; margin: 28px 0 20px 0;">
        <p style="font-size: 12px; line-height: 1.5; color: #9c978f; margin: 0;">
          Nếu bạn không thực hiện đăng ký này hoặc muốn rời danh sách bất kỳ lúc nào, bạn có thể 
          <a href="${unsubscribeUrl}" style="color: #6b6761; text-decoration: underline;">hủy đăng ký tại đây</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: email,
          subject,
          html: htmlContent,
        }),
      });

      return res.ok;
    } catch (err) {
      console.error('[Waitlist Provider] Resend delivery error:', err.message);
      return false;
    }
  },
};
