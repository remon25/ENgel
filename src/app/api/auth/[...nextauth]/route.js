import mongoose from "mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";

// Ensure connection
const ensureConnection = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);
  }
};

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Allow linking accounts with same email
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
      async authorize(credentials) {
        const { email, password } = credentials;

        await ensureConnection();

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials.");
        }

        if (!user.isVerified) {
          throw new Error("UNVERIFIED_USER");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          console.log("Processing Google signin for:", user.email);
          await ensureConnection();

          let dbUser = await User.findOne({ email: user.email });

          if (!dbUser) {
            console.log("Creating new Google user");
            dbUser = await User.create({
              email: user.email,
              name: user.name || profile.name,
              image: user.image,
              isVerified: true,
              googleId: profile.sub,
            });
          } else {
            console.log("Linking Google to existing user");
            if (!dbUser.googleId) {
              dbUser.googleId = profile.sub;
              await dbUser.save();
            }
          }

          user.id = dbUser._id.toString();
          console.log("Google signin successful for user:", user.id);
          return true;
        } catch (error) {
          console.error("Google signin error:", error);
          return "/auth/error?error=GoogleSigninFailed";
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };