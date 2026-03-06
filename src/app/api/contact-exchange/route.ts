import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      to,
      subject,
      fullName,
      agency,
      email,
      phone,
      message,
      property,
      propertyClass,
      location
    } = body ?? {};

    if (!to) {
      return NextResponse.json(
        { error: "Missing destination email." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY." },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      return NextResponse.json(
        { error: "Missing RESEND_FROM_EMAIL." },
        { status: 500 }
      );
    }

    const emailText = `
Property: ${property || ""}
Class: ${propertyClass || ""}
Location: ${location || ""}

Full Name: ${fullName || ""}
Agency: ${agency || ""}
Email: ${email || ""}
Phone: ${phone || ""}

Message:
${message || ""}
`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [to],
        subject: subject || "Trade Request",
        text: emailText,
        reply_to: email || undefined
      })
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return NextResponse.json(
        { error: errorText || "Email failed to send." },
        { status: 500 }
      );
    }

    const lead = {
      property,
      propertyClass,
      location,
      fullName,
      agency,
      email,
      phone,
      message,
      createdAt: new Date().toISOString(),
      status: "new"
    };

    console.log("NEW LEAD:", lead);

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: "Email failed to send." },
      { status: 500 }
    );
  }
}
