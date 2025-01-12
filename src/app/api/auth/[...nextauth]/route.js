import mongoose from "mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "../../../libs/mongoConnect";
import { sign } from "jsonwebtoken";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        mongoose.connect(process.env.MONGO_URL);

        const user = await User.findOne({ email });
        if (!user) {
          return null;
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        
        if (!isPasswordValid) {
          throw new Error("Invalid credentials.");
        }
      
        if (!user.isVerified) {
          throw new Error("UNVERIFIED_USER"); // Throw a specific error
        }

        if (user && isPasswordValid) {
          // Generate a JWT token for the user
          const token = sign(
            { id: user._id, email: user.email }, // Add any other user info as needed
            process.env.JWT_SECRET, // Use a secret key for signing the JWT
            { expiresIn: '1h' } // Set the token expiration time
          );
          return { ...user.toObject(), token }; // Return user info and token
        }

        return null;
      },
    }),
  ],
  callbacks: {
    // Callback to handle JWT token during the authentication flow
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.token = user.token; // Add token to the JWT
      }
      return token;
    },
    // Callback to handle session when it's created or updated
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.token = token.token; // Add the token to the session
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
