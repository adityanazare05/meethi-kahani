/**
 * Meethi Kahani — Transactional Email Service via Resend
 * Docs: https://resend.com/docs
 *
 * All email triggers are routed through this centralized service.
 * IMPORTANT: For production, move API calls to Supabase Edge Functions to keep API key server-side.
 */

import { supabase } from '../lib/supabaseClient';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL = 'Meethi Kahani <onboarding@resend.dev>';
const BRAND_COLOR = '#9A2222';

/* ====================================================================
   CORE EMAIL DISPATCHER
   Tries Supabase Edge Function (Gmail SMTP) first, with Resend fallback
   ==================================================================== */

const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    console.warn('[EmailService] Recipient email is missing, skipping email:', subject);
    return { skipped: true };
  }

  const payload = { to, subject, html };

  // 1. Send via Supabase Edge Function (Gmail SMTP) using Direct HTTP
  try {
    const edgeUrl = 'https://txbagyinnxvbfceiqoay.supabase.co/functions/v1/send-email';
    const edgeRes = await fetch(edgeUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const edgeData = await edgeRes.json();
    if (edgeRes.ok && edgeData?.success) {
      console.log(`[EmailService] Email sent via Supabase Edge Function: "${subject}" → ${to}`);
      return { success: true, data: edgeData };
    }
  } catch (directErr) {
    console.warn('[EmailService] Direct Edge Function call failed, trying client invoke:', directErr);
  }

  // 2. Try Supabase Client SDK invoke if available
  try {
    if (supabase && supabase.functions) {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: payload
      });

      if (!error && data?.success) {
        console.log(`[EmailService] Email sent via Supabase SDK: "${subject}" → ${to}`);
        return { success: true, data };
      }
    }
  } catch (fnErr) {
    console.warn('[EmailService] Supabase SDK invoke failed, trying Resend fallback:', fnErr);
  }

  // 2. Fallback to Resend API if Edge Function is not yet deployed
  if (RESEND_API_KEY && !RESEND_API_KEY.includes('your-resend')) {
    try {
      const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: Array.isArray(to) ? to : [to],
          subject,
          html
        })
      });

      const result = await response.json();
      if (!response.ok) {
        console.error('[EmailService] Resend API error:', result);
        return { error: result };
      }

      console.log(`[EmailService] Email sent via Resend: "${subject}" → ${to}`);
      return { success: true, id: result.id };
    } catch (err) {
      console.error('[EmailService] Resend fallback failed:', err);
      return { error: err.message };
    }
  }

  return { skipped: true, message: 'No email service responded successfully' };
};

/* ====================================================================
   EMAIL TEMPLATES (Inline HTML — brand-consistent)
   ==================================================================== */

const baseWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Meethi Kahani</title>
</head>
<body style="margin:0;padding:0;background:#FAF5EE;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#FAF5EE;min-height:100vh;">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:${BRAND_COLOR};padding:28px 32px;text-align:center;">
          <p style="margin:0;color:#FAF5EE;font-family:Georgia,serif;font-size:24px;font-weight:700;letter-spacing:1px;">🍪 Meethi Kahani</p>
          <p style="margin:6px 0 0;color:rgba(250,245,238,0.75);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Artisanal Eggless Cookies · Mumbai</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 32px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#FAF5EE;padding:20px 32px;text-align:center;border-top:1px solid #EAE0D5;">
          <p style="margin:0;font-size:11px;color:#A09080;line-height:1.6;">© 2026 Meethi Kahani Foods Pvt Ltd · Mumbai, India<br/>
          100% Pure Eggless · FSSAI Licensed · No Refund Policy</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

/* ====================================================================
   1. WELCOME EMAIL — Sent on first-time account creation
   ==================================================================== */

export const sendWelcomeEmail = async ({ name, email }) => {
  const content = `
    <h2 style="margin:0 0 8px;color:#3D2314;font-size:22px;">Welcome to Meethi Kahani, ${name || 'Cookie Lover'}! 🍪</h2>
    <p style="margin:0 0 20px;color:#6C584C;font-size:14px;line-height:1.7;">
      Your artisan cookie journey begins now. We hand-bake every cookie in small batches daily in Mumbai — pure eggless, pure indulgence.
    </p>

    <div style="background:#FAF5EE;border-radius:10px;padding:20px;margin-bottom:24px;border:1px solid #EAE0D5;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#9A2222;letter-spacing:0.5px;">✨ YOUR ACCOUNT PERKS</p>
      <ul style="margin:0;padding-left:18px;color:#3D2314;font-size:13px;line-height:2;">
        <li>🪙 Earn <strong>Kisse Coins</strong> on every order (10% cashback in coins)</li>
        <li>🎁 Access to exclusive gifting tin builds with 25% MRP discount</li>
        <li>🚀 1-Day Express Delivery across Mumbai & Metro Cities</li>
        <li>📦 Track your cookie order in real-time</li>
      </ul>
    </div>

    <div style="text-align:center;margin-top:28px;">
      <a href="https://meethikahani.com" style="background:${BRAND_COLOR};color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700;display:inline-block;">
        🍪 Shop Now
      </a>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to Meethi Kahani, ${name}! 🍪 Your first cookie awaits`,
    html: baseWrapper(content)
  });
};

/* ====================================================================
   2. ORDER CONFIRMATION + PAYMENT RECEIPT
   Sent immediately after order is placed
   ==================================================================== */

export const sendOrderConfirmationEmail = async ({ order, customerEmail }) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #EAE0D5;color:#3D2314;font-size:13px;">${item.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #EAE0D5;color:#6C584C;font-size:13px;text-align:center;">×${item.qty}</td>
      <td style="padding:10px 0;border-bottom:1px solid #EAE0D5;color:#3D2314;font-size:13px;text-align:right;font-weight:600;">₹${(item.price * item.qty).toFixed(2)}</td>
    </tr>
  `).join('');

  const content = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
      <div style="background:#DCFCE7;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:24px;text-align:center;line-height:48px;">✅</div>
      <div>
        <h2 style="margin:0;color:#3D2314;font-size:20px;">Order Confirmed!</h2>
        <p style="margin:4px 0 0;color:#6C584C;font-size:13px;">Order ID: <strong>#${order.id}</strong></p>
      </div>
    </div>

    <p style="color:#6C584C;font-size:14px;margin:0 0 24px;line-height:1.6;">
      Hi <strong>${order.customerName}</strong>, your artisan cookie order has been received! Our bakers will start crafting your molten delights fresh right away. 🍪
    </p>

    <!-- Order Items Table -->
    <div style="background:#FAF5EE;border-radius:10px;padding:20px;margin-bottom:20px;border:1px solid #EAE0D5;">
      <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#9A2222;letter-spacing:0.5px;">🍪 ORDER SUMMARY</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr style="border-bottom:2px solid #EAE0D5;">
          <th style="padding:0 0 10px;font-size:11px;font-weight:700;color:#9A2222;text-align:left;text-transform:uppercase;">Item</th>
          <th style="padding:0 0 10px;font-size:11px;font-weight:700;color:#9A2222;text-align:center;text-transform:uppercase;">Qty</th>
          <th style="padding:0 0 10px;font-size:11px;font-weight:700;color:#9A2222;text-align:right;text-transform:uppercase;">Total</th>
        </tr>
        ${itemsHtml}
      </table>

      <!-- Pricing Breakdown -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#6C584C;">Subtotal</td>
          <td style="padding:4px 0;font-size:13px;color:#3D2314;text-align:right;">₹${order.subtotal.toFixed(2)}</td>
        </tr>
        ${order.discount > 0 ? `
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#16A34A;">Discount Applied</td>
          <td style="padding:4px 0;font-size:13px;color:#16A34A;text-align:right;">−₹${order.discount.toFixed(2)}</td>
        </tr>` : ''}
        <tr style="border-top:2px solid #EAE0D5;margin-top:8px;">
          <td style="padding:10px 0 4px;font-size:15px;font-weight:700;color:#3D2314;">Total Paid</td>
          <td style="padding:10px 0 4px;font-size:15px;font-weight:700;color:#9A2222;text-align:right;">₹${order.totalAmount.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <!-- Payment Receipt -->
    <div style="background:#F0FDF4;border-radius:10px;padding:16px;margin-bottom:20px;border:1px solid #BBF7D0;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#15803D;letter-spacing:0.5px;">💳 PAYMENT RECEIPT</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:3px 0;font-size:12px;color:#6C584C;">Payment Mode</td>
          <td style="padding:3px 0;font-size:12px;color:#3D2314;text-align:right;font-weight:600;">${order.paymentMode}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;font-size:12px;color:#6C584C;">Payment Status</td>
          <td style="padding:3px 0;font-size:12px;color:#15803D;text-align:right;font-weight:700;">✅ ${order.paymentStatus}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;font-size:12px;color:#6C584C;">Order Date</td>
          <td style="padding:3px 0;font-size:12px;color:#3D2314;text-align:right;">${order.date}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;font-size:12px;color:#6C584C;">Amount Paid</td>
          <td style="padding:3px 0;font-size:13px;color:#9A2222;text-align:right;font-weight:700;">₹${order.totalAmount.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <!-- Delivery Info -->
    <div style="background:#FAF5EE;border-radius:10px;padding:16px;border:1px solid #EAE0D5;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#9A2222;letter-spacing:0.5px;">📦 DELIVERY ADDRESS</p>
      <p style="margin:0;font-size:13px;color:#3D2314;line-height:1.6;">${order.address}</p>
      <p style="margin:8px 0 0;font-size:12px;color:#6C584C;">🚀 Expected: <strong>1-Day Express Delivery</strong></p>
    </div>

    <!-- Kisse Coins -->
    <div style="text-align:center;margin-top:24px;padding:16px;background:#FFFBEB;border-radius:10px;border:1px solid #FDE68A;">
      <p style="margin:0;font-size:14px;color:#92400E;">🪙 You earned <strong>${Math.floor(order.totalAmount * 0.1)} Kisse Coins</strong> from this order!</p>
      <p style="margin:4px 0 0;font-size:12px;color:#A09080;">Redeem on your next Meethi Kahani order</p>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `🍪 Order #${order.id} Confirmed — Baking starts now!`,
    html: baseWrapper(content)
  });
};

/* ====================================================================
   3. ORDER STATUS UPDATE EMAIL
   Triggered when admin/seller updates order status
   ==================================================================== */

const STATUS_CONFIGS = {
  BAKING: { emoji: '👩‍🍳', title: 'Your cookies are baking!', message: 'Our artisan bakers have started crafting your molten cookie order. Your cookies will be fresh out of the oven soon!' },
  SHIPPED: { emoji: '🚚', title: 'Out for Delivery!', message: 'Your fresh-baked cookies are on their way! Our delivery partner is heading to your address right now.' },
  DELIVERED: { emoji: '✅', title: 'Delivered! Enjoy your cookies!', message: 'Your Meethi Kahani order has been delivered. We hope every molten bite brings a smile! 😊 Don\'t forget to share your experience.' }
};

export const sendOrderStatusEmail = async ({ order, newStatus, customerEmail }) => {
  const cfg = STATUS_CONFIGS[newStatus];
  if (!cfg) return; // Only send for known status updates

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:12px;">${cfg.emoji}</div>
      <h2 style="margin:0;color:#3D2314;font-size:20px;">${cfg.title}</h2>
      <p style="margin:8px 0 0;color:#9A2222;font-size:13px;font-weight:600;">Order #${order.id}</p>
    </div>

    <p style="color:#6C584C;font-size:14px;text-align:center;line-height:1.7;margin:0 0 24px;">
      Hi <strong>${order.customerName}</strong>, ${cfg.message}
    </p>

    <div style="background:#FAF5EE;border-radius:10px;padding:16px;border:1px solid #EAE0D5;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#9A2222;letter-spacing:0.5px;">📍 DELIVERY ADDRESS</p>
      <p style="margin:0;font-size:13px;color:#3D2314;line-height:1.6;">${order.address}</p>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `${cfg.emoji} Order #${order.id} Update — ${cfg.title}`,
    html: baseWrapper(content)
  });
};

/* ====================================================================
   4. KISSE COINS EARNED EMAIL
   ==================================================================== */

export const sendKisseCoinsEmail = async ({ customerEmail, name, coinsEarned, totalCoins, orderId }) => {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:12px;">🪙</div>
      <h2 style="margin:0;color:#3D2314;font-size:20px;">You earned Kisse Coins!</h2>
    </div>

    <p style="color:#6C584C;font-size:14px;text-align:center;margin:0 0 24px;">
      Hi <strong>${name}</strong>! You've earned <strong style="color:#9A2222;">${coinsEarned} Kisse Coins</strong> from Order #${orderId}.
    </p>

    <div style="background:#FFFBEB;border-radius:10px;padding:20px;text-align:center;border:1px solid #FDE68A;">
      <p style="margin:0;font-size:12px;font-weight:700;color:#92400E;letter-spacing:0.5px;">YOUR KISSE COINS BALANCE</p>
      <p style="margin:8px 0 0;font-size:36px;font-weight:700;color:#9A2222;">🪙 ${totalCoins}</p>
      <p style="margin:8px 0 0;font-size:12px;color:#A09080;">Redeem on your next artisan cookie order!</p>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `🪙 You earned ${coinsEarned} Kisse Coins from your Meethi Kahani order!`,
    html: baseWrapper(content)
  });
};
