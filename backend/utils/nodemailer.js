import nodemailer from "nodemailer";
import dns from "dns/promises";

const SMTP_HOSTNAME = "smtp.gmail.com";

async function smtpIpv4Host() {
  try {
    const addrs = await dns.resolve4(SMTP_HOSTNAME);

    if (addrs && addrs.length) {
      return addrs[Math.floor(Math.random() * addrs.length)];
    }
  } catch (error) {
    console.warn(
      "[nodemailer] resolve4 failed, falling back to hostname:",
      error.message,
    );
  }

  return SMTP_HOSTNAME;
}

async function createTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error(
      "Email is not configured: set GMAIL_USER and GMAIL_PASS (use a Gmail App Password).",
    );
  }

  const host = await smtpIpv4Host();

  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    servername: SMTP_HOSTNAME,
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    socketTimeout: 25000,
    tls: {
      servername: SMTP_HOSTNAME,
    },
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

const sendEmailForOtp = async (email, otp) => {
  try {
    const transporter = await createTransporter();
    const fromUser = process.env.GMAIL_USER;

    const mailOptions = {
      from: `"EasyShop" <${fromUser}>`,
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("[sendEmailForOtp]", error.message);
    return false;
  }
};

export default sendEmailForOtp;
