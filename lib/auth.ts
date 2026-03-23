// eslint-disable @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        if (user.twoFactorEnabled) {
          return { id: user.id, email: user.email, name: user.name, plan: user.plan, twoFactorPending: true } as any;
        }
        return { id: user.id, email: user.email, name: user.name, plan: user.plan };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google") {
        const email = user.email;
        const googleId = account.providerAccountId;
        if (!email) return false;

        // Find or create user
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          // Link Google account if not already linked
          if (!existingUser.googleId) {
            await prisma.user.update({
              where: { email },
              data: { googleId },
            });
          }
          user.id = existingUser.id;
          (user as any).plan = existingUser.plan;
        } else {
          // Create new user via Google
          const newUser = await prisma.user.create({
            data: {
              email,
              name: user.name || "",
              googleId,
              plan: "free",
            },
          });
          user.id = newUser.id;
          (user as any).plan = newUser.plan;
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan;
        if ((user as any).twoFactorPending) {
          token.twoFactorPending = true;
        }
      }
      // Allow clearing twoFactorPending via session update
      if (trigger === 'update' && (session as any)?.twoFactorVerified) {
        token.twoFactorPending = false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).plan = token.plan;
      }
      (session as any).twoFactorPending = token.twoFactorPending as boolean | undefined;
      return session;
    },
  },
  pages: { signIn: "/login" },
};
