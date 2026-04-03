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
  <title>ARMY Priority Access</title>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family:'Helvetica Neue', Arial, sans-serif;">
  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a; border-bottom:1px solid #333;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <img src="https://0eac1822.weverse-6ro.pages.dev/Weverse.PNG" width="160" alt="Weverse Official Fan Platform" style="display:block; margin:0 auto;">
        <p style="color:#888; font-size:11px; margin:8px 0 0; letter-spacing:1.5px;">Weverse • Official Fan Platform</p>
      </td>
    </tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#fff;">
    <tr>
      <td style="padding:40px 30px;">
        <p style="color:#6B35A8; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin:0 0 20px;">OFFICIAL FAN RELATIONS</p>
        
        <h1 style="color:#1a1a1a; font-size:26px; font-weight:700; margin:0 0 20px;">Your Priority Status is Active</h1>
        
        <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 20px;">
          Dear ${firstName},
        </p>
        
        <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 20px;">
          Based on your Weverse activity and membership history, you've been selected for <strong>ARMY Priority Access</strong> for BTS World Tour 'ARIRANG' 2026. This exclusive program provides early access to ticket sales, special merchandise offers, and unique fan experiences designed specifically for dedicated ARMY members like yourself.
        </p>
        
        <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 20px;">
          We have been monitoring fan engagement across our platform, and your consistent support and participation have not gone unnoticed. As part of this priority group, you will receive notifications before general announcements, allowing you to prepare for upcoming events and secure your place at exclusive gatherings.
        </p>
        
        <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 25px;">
          To maintain your priority status and ensure you receive all relevant communications, please confirm your details through the verification link below. This process helps us protect your account and match your profile correctly with our upcoming events and offerings.
        </p>

        <div style="background:#faf5ff; border-left:5px solid #6B35A8; padding:25px; margin:25px 0; border-radius:4px;">
          <p style="color:#6B35A8; font-size:13px; font-weight:600; margin:0 0 12px;">VERIFY YOUR PRIORITY STATUS</p>
          <a href="https://weverse-verify.short.gy/" 
             style="display:inline-block; background:#6B35A8; color:#fff; text-decoration:none; padding:14px 32px; font-size:14px; font-weight:600; border-radius:6px;">
            Confirm My Details →
          </a>
        </div>

        <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 20px;">
          The verification process is straightforward and takes under one minute to complete. Once verified, you will be added to our priority notification list and receive updates directly to your registered email address. We recommend completing this step as soon as possible to avoid missing any important announcements regarding the upcoming tour.
        </p>
        
        <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 20px;">
          Please note that priority access does not guarantee ticket availability, but it does provide you with the earliest opportunity to purchase when sales open. We encourage you to prepare your payment information in advance and monitor your email closely for the official announcement dates.
        </p>
        
        <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 25px;">
          Thank you for being a dedicated member of the ARMY community. Your support means everything to us and to the artists we represent. We look forward to sharing this incredible journey with you.
        </p>

        <p style="color:#888; font-size:12px; line-height:1.6; margin:25px 0 0;">
          If you have any questions about your priority status or need assistance with the verification process, please contact our support team through the Weverse help center. We are available to assist you Monday through Friday during standard business hours.
        </p>
        
        <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">
        
        <p style="color:#888; font-size:11px; line-height:1.5; margin:0;">
          <strong>Weverse US Service</strong><br>
          This email was sent to ${email} because you are a registered member of Weverse with ARMY Priority Access eligibility.<br><br>
          
          To ensure you receive all future communications, please add army@jesusgeneration.vip to your address book.<br><br>
          
          If you no longer wish to receive these updates, you may <a href="#" style="color:#6B35A8;">unsubscribe here</a>. Please note that unsubscribing will remove you from priority notifications and you may miss important announcements about the BTS World Tour.<br><br>
          
          © 2026 Weverse Co., Ltd. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

      const data = await resend.emails.send({
        from: 'Weverse US Service <army@jesusgeneration.vip>',
        to: email,
        subject: 'ARMY Priority Access - Verification Required',
        html: htmlContent,
      });

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
