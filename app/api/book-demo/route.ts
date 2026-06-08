import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

type DemoPayload = {
  collegeName?: string;
  email?: string;
  phone?: string;
  role?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json()) as DemoPayload;
  const collegeName = body.collegeName?.trim() || "";
  const email = body.email?.trim().toLowerCase() || "";
  const phone = body.phone?.trim() || "";
  const role = body.role?.trim() || "";

  if (!collegeName || !email || !phone || !role) {
    return NextResponse.json({ error: "please fill every field" }, { status: 400 });
  }

  if (!isEmail(email)) {
    return NextResponse.json({ error: "enter a valid email" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.DEMO_NOTIFY_EMAIL || "hello@cavite.in";
  const fromEmail = process.env.DEMO_FROM_EMAIL || "Cavite <onboarding@resend.dev>";
  const submittedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const supabase = await createClient();
  if (supabase) {
    await supabase.from("demo_requests").insert({
      college_name: collegeName,
      email,
      phone,
      role,
    } as never);
  }

  const internalHtml = `
    <div style="font-family:Inter,Arial,sans-serif;color:#0d1724;line-height:1.6">
      <h2>New Cavite demo request</h2>
      <p><strong>College:</strong> ${collegeName}</p>
      <p><strong>Contact:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Role:</strong> ${role}</p>
      <p><strong>Submitted:</strong> ${submittedAt}</p>
    </div>
  `;

  const studentHtml = `
    <div style="font-family:Inter,Arial,sans-serif;color:#0d1724;line-height:1.6">
      <h2>We received your Cavite demo request.</h2>
      <p>Thanks for reaching out for <strong>${collegeName}</strong>. We will connect with you soon to understand your placement process and schedule a demo.</p>
      <p style="color:#657083">Cavite helps colleges run applications, phases, resumes, feedback, and clear outcomes without ghosting.</p>
    </div>
  `;

  if (!resendKey) {
    console.info("Demo request captured without email provider:", {
      collegeName,
      email,
      phone,
      role,
      submittedAt,
    });
    return NextResponse.json({ ok: true, emailSkipped: true });
  }

  const responses = await Promise.all([
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: notifyEmail,
        subject: `New Cavite demo request: ${collegeName}`,
        html: internalHtml,
        reply_to: email,
      }),
    }),
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: "Cavite demo request received",
        html: studentHtml,
        reply_to: notifyEmail,
      }),
    }),
  ]);

  const failed = responses.find((response) => !response.ok);
  if (failed) {
    const details = await failed.text();
    return NextResponse.json({ error: "email could not be sent", details }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
