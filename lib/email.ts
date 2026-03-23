const FROM_ADDRESS = "noreply@slateinvoice.com";
const RESEND_API_URL = "https://api.resend.com/emails";

function emailTemplate(title: string, body: string, ctaText?: string, ctaUrl?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#1e293b;padding:32px 40px;border-radius:12px 12px 0 0;">
              <span style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">🧾 SlateInvoice</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              ${body}
              ${ctaText && ctaUrl ? `
              <div style="margin-top:32px;">
                <a href="${ctaUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">${ctaText}</a>
              </div>` : ''}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9;padding:24px 40px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:13px;">
                Sent by <a href="https://slateinvoice.com" style="color:#64748b;text-decoration:none;">slateinvoice.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_your")) {
    console.log(`[email] RESEND_API_KEY not set — skipping email to ${to}: ${subject}`);
    return;
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[email] Resend API error (${res.status}):`, err);
    } else {
      console.log(`[email] Sent "${subject}" to ${to}`);
    }
  } catch (err) {
    console.error("[email] Failed to send email:", err);
  }
}

export async function sendInvoicePaidEmail(
  ownerEmail: string,
  invoiceNumber: string,
  amount: string,
  clientName: string
): Promise<void> {
  const subject = `💰 Payment received for Invoice #${invoiceNumber}`;
  const body = `
    <h2 style="margin:0 0 16px;color:#1e293b;font-size:24px;font-weight:700;">Payment Received!</h2>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px;">
      Great news — <strong>${clientName}</strong> has paid Invoice <strong>#${invoiceNumber}</strong>.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:24px 0;">
      <p style="margin:0;color:#166534;font-size:20px;font-weight:700;">Amount received: ${amount}</p>
    </div>
    <p style="color:#64748b;font-size:14px;margin:0;">Log in to your dashboard to view the details.</p>
  `;
  const html = emailTemplate(subject, body);
  await sendEmail(ownerEmail, subject, html);
}

export async function sendInvoiceToClient(
  toEmail: string,
  fromName: string,
  invoiceNumber: string,
  amount: string,
  paymentLink: string
): Promise<void> {
  const subject = `Invoice #${invoiceNumber} from ${fromName}`;
  const body = `
    <h2 style="margin:0 0 16px;color:#1e293b;font-size:24px;font-weight:700;">You have a new invoice</h2>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px;">
      <strong>${fromName}</strong> has sent you Invoice <strong>#${invoiceNumber}</strong> for payment.
    </p>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin:24px 0;">
      <p style="margin:0;color:#1e40af;font-size:20px;font-weight:700;">Amount due: ${amount}</p>
    </div>
    <p style="color:#64748b;font-size:14px;margin:0 0 8px;">Click the button below to view and pay your invoice securely online.</p>
  `;
  const html = emailTemplate(subject, body, "View & Pay Invoice", paymentLink);
  await sendEmail(toEmail, subject, html);
}

export async function sendOverdueReminder(
  toEmail: string,
  fromName: string,
  invoiceNumber: string,
  amount: string,
  paymentLink: string
): Promise<void> {
  const subject = `Friendly reminder: Invoice #${invoiceNumber} is overdue`;
  const body = `
    <h2 style="margin:0 0 16px;color:#1e293b;font-size:24px;font-weight:700;">Friendly Payment Reminder</h2>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px;">
      This is a friendly reminder from <strong>${fromName}</strong> that Invoice <strong>#${invoiceNumber}</strong> is now overdue.
    </p>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:20px;margin:24px 0;">
      <p style="margin:0;color:#991b1b;font-size:20px;font-weight:700;">Overdue amount: ${amount}</p>
    </div>
    <p style="color:#64748b;font-size:14px;margin:0 0 8px;">Please pay at your earliest convenience to avoid any disruption to services.</p>
  `;
  const html = emailTemplate(subject, body, "Pay Now", paymentLink);
  await sendEmail(toEmail, subject, html);
}
