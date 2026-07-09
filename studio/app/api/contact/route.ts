import { NextRequest, NextResponse } from "next/server";
import { createLogId } from "@/lib/jobs";
import { loadStore, saveStore } from "@/lib/store";

export const dynamic = "force-dynamic";

interface ContactBody {
  name: string;
  email: string;
  company?: string;
  useCase?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactBody = await req.json();

    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const to =
      process.env.CONTACT_TO_EMAIL?.trim() ||
      process.env.SUPPORT_EMAIL?.trim() ||
      "guykogen@izop.ai";

    const resendKey = process.env.RESEND_API_KEY?.trim();
    const from =
      process.env.CONTACT_FROM_EMAIL?.trim() ||
      process.env.RESEND_FROM_EMAIL?.trim() ||
      "Xethra <guykogen@izop.ai>";

    if (!resendKey) {
      console.error("[contact] RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service is not configured. Please try again later." },
        { status: 503 }
      );
    }

    const html = `
      <h2>New Xethra API Access Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
      ${body.company ? `<p><strong>Company:</strong> ${escapeHtml(body.company)}</p>` : ""}
      ${body.useCase ? `<p><strong>Use case:</strong> ${escapeHtml(body.useCase)}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(body.message).replace(/\n/g, "<br>")}</p>
      <hr style="border:0;border-top:1px solid #eee;margin:1.5em 0"/>
      <p style="color:#666;font-size:12px">Sent via xethra.com contact form.</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: body.email,
        subject: `Xethra API Access — ${body.name}${body.company ? ` (${body.company})` : ""}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[contact] Resend error:", err);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 502 }
      );
    }

    // Backup log in studio activity
    try {
      const store = await loadStore();
      store.logs.unshift({
        id: createLogId(),
        timestamp: new Date().toISOString(),
        level: "info",
        source: "system",
        message: `API access request emailed: ${body.name} <${body.email}>`,
        meta: {
          company: body.company,
          useCase: body.useCase,
          message: body.message,
        },
      });
      await saveStore(store);
    } catch {
      // Non-blocking — email already sent
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
