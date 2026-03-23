import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOverdueReminder } from "@/lib/email";

export async function GET(req: NextRequest) {
  // Verify authorization
  const authHeader = req.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Find overdue invoices: status='sent', dueDate < today, reminderSentAt null or < 7 days ago
  const overdueInvoices = await prisma.invoice.findMany({
    where: {
      status: "sent",
      dueDate: { lt: today },
      OR: [
        { reminderSentAt: null },
        { reminderSentAt: { lt: sevenDaysAgo } },
      ],
    },
  });

  const results: { invoiceId: string; invoiceNumber: string; toEmail: string; sent: boolean; error?: string }[] = [];

  for (const invoice of overdueInvoices) {
    if (!invoice.toEmail) continue;

    try {
      const fmt = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: invoice.currency || "USD",
      }).format(invoice.total);

      const paymentLink = invoice.paymentLink || `${process.env.NEXTAUTH_URL || ""}/pay/${invoice.id}`;

      await sendOverdueReminder(
        invoice.toEmail,
        invoice.fromName || "SlateInvoice",
        invoice.number,
        fmt,
        paymentLink
      );

      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { reminderSentAt: new Date() },
      });

      results.push({ invoiceId: invoice.id, invoiceNumber: invoice.number, toEmail: invoice.toEmail, sent: true });
    } catch (err) {
      console.error(`Failed to send reminder for invoice ${invoice.id}:`, err);
      results.push({
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
        toEmail: invoice.toEmail,
        sent: false,
        error: String(err),
      });
    }
  }

  return NextResponse.json({
    processed: overdueInvoices.length,
    sent: results.filter(r => r.sent).length,
    failed: results.filter(r => !r.sent).length,
    results,
  });
}
