import mongoose from "mongoose";
import { User } from "@/app/models/User";
import nodemailer from "nodemailer";
import { htmlTemplate } from "@/app/_utilis/htmlEmailTemplate";
import crypto from "crypto";

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationCode(email, code) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your New Verification Code",
    html: htmlTemplate(code),
  });
}

export async function POST(request) {

  const { email, resend } = await request.json();
  mongoose.connect(process.env.MONGO_URL);

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  if (user.isVerified) {
    return new Response(
      JSON.stringify({ message: "User is already verified." }),
      { status: 200 }
    );
  }

  if (resend) {
    const newCode = generateVerificationCode();
    const token = generateToken(); // New token
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    user.verificationCode = newCode;
    user.token = token;
    user.tokenExpiration = tokenExpiration;

    await user.save();
    await sendVerificationCode(email, newCode);

    return new Response(
      JSON.stringify({ message: "New verification code sent.", token }),
      { status: 200 }
    );
  }

  return new Response(JSON.stringify({ error: "Invalid request." }), {
    status: 400,
  });
}
