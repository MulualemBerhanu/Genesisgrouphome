import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Compose message content
    const messageContent = `
New Contact Form Submission:
---------------------------
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}
`;

    // Send SMS notification
    await twilioClient.messages.create({
      body: messageContent,
      to: '(503) 740-1256', // Replace with your phone number
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    // Send email notifications
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ['Genesisghpdx@gmail.com', 'Genesisgrouphomepdx@gmail.com'],
      subject: 'New Contact Form Submission - Genesis Group Home',
      text: messageContent,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
} 