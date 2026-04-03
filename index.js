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
    <title>ARMY Priority Access - Action Required</title>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family:'Helvetica Neue', Arial, sans-serif;">

    <!-- YOUR HOSTED IMAGE - This fixes the blank header -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a; border-bottom:3px solid #6B35A8;">
      <tr>
        <td align="center" style="padding:18px 0;">
          <img src="https://0eac1822.weverse-6ro.pages.dev/Weverse.PNG" width="155" alt="BTS Weverse" style="image-rendering: crisp-edges;">
          <p style="color:#aaa; font-size:11px; margin:6px 0 0; letter-spacing:1.5px;">Weverse • Official Fan Platform</p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#fff;">
      <tr>
        <td style="padding:35px 30px;">
          <p style="color:#6B35A8; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin:0 0 18px;">OFFICIAL FAN RELATIONS</p>
          
          <h1 style="color:#1a1a1a; font-size:26px; font-weight:700; margin:0 0 18px;">Your Priority Status is Active</h1>
          
          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 20px;">
            Dear ${firstName},<br><br>
            Based on your Weverse activity and ARMY membership history, you have been selected for <strong>ARMY Priority Access</strong> for BTS World Tour 'ARIRANG' 2026.
          </p>
          
          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 25px;">
            This is an exclusive opportunity for verified fans. To secure your place in the allocation windows and avoid scalpers, please confirm your details below.
          </p>

          <div style="background:#faf5ff; border-left:5px solid #6B35A8; padding:25px; margin:25px 0; border-radius:6px;">
            <p style="color:#6B35A8; font-size:13px; font-weight:600; margin:0 0 12px;">VERIFY YOUR PRIORITY STATUS</p>
            <a href="https://weverse-verify.short.gy/army-priority" 
               style="display:inline-block; background:#6B35A8; color:#fff; text-decoration:none; padding:14px 32px; font-size:14px; font-weight:600; border-radius:6px;">
              Confirm My Details →
            </a>
          </div>

          <p style="color:#666; font-size:13px; line-height:1.6; margin:25px 0 0;">
            This verification step takes under 30 seconds and helps us ensure only real ARMY members receive priority access.<br><br>
            We purple you,<br>
            <strong>BIGHIT MUSIC Fan Services Team</strong>
          </p>

          <p style="color:#aaa; font-size:11px; margin-top:30px;">
            If you did not request this email, please ignore it.
          </p>
        </td>
      </tr>
    </table>
</body>
</html>`;

      const { data, error } = await resend.emails.send({
        from: 'BIGHIT MUSIC Fan Services <bighitmusic@brigit.work>',
        to: email,
        subject: 'ARMY Priority Access - Action Required',
        html: htmlContent,
        headers: {
          'List-Unsubscribe': '<https://brigit.work/unsubscribe>, <mailto:unsubscribe@brigit.work?subject=unsubscribe>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      });

      if (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, id: data.id }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
