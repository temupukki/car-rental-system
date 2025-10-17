import nodemailer from 'nodemailer';
import * as dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"ExamMaster" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text,
    });

    console.log('✅ Email sent to:', to);
    return info;
  } catch (error) {
    console.error('❌ Email failed to:', to, 'Error:', error);
    throw error;
  }
};

// Verify connection on startup
transporter.verify((error: any, success: any) => {
  if (error) {
    console.error('❌ Nodemailer setup failed:', error);
  } else {
    console.log('✅ Nodemailer is ready to send emails');
  }
});