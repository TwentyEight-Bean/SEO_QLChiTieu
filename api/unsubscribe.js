import { verifyUnsubscribeToken, waitlistProvider } from './waitlist-provider.js';

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'method_not_allowed',
      message: 'Phương thức không được hỗ trợ.',
    });
  }

  try {
    let token = '';

    if (req.method === 'GET') {
      const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      token = urlObj.searchParams.get('token') || '';
    } else {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      token = body.token || '';
    }

    if (!token) {
      return res.status(400).json({
        ok: false,
        error: 'missing_token',
        message: 'Thiếu mã xác thực hủy đăng ký.',
      });
    }

    const verification = verifyUnsubscribeToken(token);
    if (!verification.valid || !verification.email) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_token',
        message: 'Mã xác thực không hợp lệ hoặc liên kết đã bị sửa đổi.',
      });
    }

    await waitlistProvider.unsubscribeSubscriber(verification.email);

    return res.status(200).json({
      ok: true,
      message: 'Bạn đã hủy đăng ký nhận thông báo thành công. Email của bạn sẽ không nhận thêm thư từ Sổ Chi.',
    });
  } catch (err) {
    console.error('[Unsubscribe API Error]', err.message);
    return res.status(500).json({
      ok: false,
      error: 'server_error',
      message: 'Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.',
    });
  }
}
