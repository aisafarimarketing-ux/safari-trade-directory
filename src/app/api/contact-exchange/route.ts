import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      location,
    } = body ?? {};

    if (!to) {
      return NextResponse.json(
        { error: "Missing destination email." },
        { status: 400 }
      );
    }

    const emailText = `
Property: ${property}
Class: ${propertyClass}
Location: ${location}

Full Name: ${fullName}
Agency: ${agency}
Email: ${email}
Phone: ${phone}

Message:
${message}
`;

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject: subject || "Trade Request",
      text: emailText,
      replyTo: email || undefined,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Save lead (temporary until DB added)
    const lead = {
      property,
      fullName,
      agency,
      email,
      phone,
      message,
      createdAt: new Date().toISOString(),
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
