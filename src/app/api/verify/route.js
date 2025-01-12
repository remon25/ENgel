import { User } from "@/app/models/User";
import mongoose from "mongoose";

export async function POST(request) {
  const { email, code } = await request.json();
  mongoose.connect(process.env.MONGO_URL);

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  // Check if the user is already verified
  if (user.isVerified) {
    return new Response(
      JSON.stringify({ message: "User is already verified." }),
      { status: 200 }
    );
  }

  // Proceed with verification
  if (user.verificationCode === code) {
    user.isVerified = true;
    user.verificationCode = undefined; // Clear the verification code
    await user.save();

    return new Response(
      JSON.stringify({ message: "Verification successful." }),
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({ error: "Invalid verification code." }),
      { status: 400 }
    );
  }
}
