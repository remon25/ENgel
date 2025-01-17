import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, message } = await req.json(); // Using .json() to parse the request body

  // Validate input
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: "All fields are required." }), {
      status: 400, // Use the status in the response
    });
  }

  // Configure Nodemailer
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

  try {
    // Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`, // Sender's details
      to: process.env.EMAIL, // Replace with the company email
      subject: "New Contact Form Submission",
      text: message,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Message sent successfully!" }),
      {
        status: 200, // Success status
      }
    );
  } catch (error) {
    console.error("Email sending failed:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send email. Please try again later.",
      }),
      {
        status: 500, // Error status
      }
    );
  }
}
