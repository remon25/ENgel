import mongoose from "mongoose";
import { User } from "../../models/User";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { htmlTemplate } from "@/app/_utilis/htmlEmailTemplate";
import crypto from "crypto";

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
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
    subject: "Your Verification Code",
    html: htmlTemplate(code),
  });
}

export async function POST(request) {
  const body = await request.json();
  mongoose.connect(process.env.MONGO_URL);

  const pass = body.password;
  if (!pass.length || pass.length < 8) {
    return new Response(
      JSON.stringify({ error: "Password must be at least 8 characters long." }),
      { status: 400 }
    );
  }

  const hashedPassword = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
  body.password = hashedPassword;

  const verificationCode = generateVerificationCode();
  const token = generateToken(); // Generate the token
  const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // Expires in 1 hour

  try {

    const createdUser = await User.create({
      ...body,
      isVerified: false,
      verificationCode,
      token,
      tokenExpiration,
    });

    await sendVerificationCode(body.email, verificationCode);

    return new Response(
      JSON.stringify({
        message: "User created. Verification code sent.",
        token,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
