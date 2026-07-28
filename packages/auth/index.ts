import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/db";
import { openAPI, admin } from "better-auth/plugins";
import { sendVerificationEmail } from "@repo/emails";

export const auth = betterAuth({
  basePath: "/api/v1/auth",
  secret: process.env.BETTER_AUTH_SECRET as string,
  baseURL: process.env.BETTER_AUTH_URL as string,
  plugins: [
    openAPI(),
    admin({
      defaultRole: "USER",
      bannedUserMessage:
        "This account has been suspended. Contact support if you believe this is a mistake.",
    }),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  logger: {
    level: "debug",
  },
  appName: "Todo App",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: false,
      },
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 3600,
    sendOnSignIn: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, token }, request) =>
      void sendVerificationEmail(
        user.email,
        user.name,
        `${process.env.WEB_URL}/verify-email/${token}`,
      ),
  },
  rateLimit: {
    window: 1000,
    max: 100,
  },
  trustedOrigins: [
    process.env.WEB_URL as string,
    process.env.ADMIN_URL as string,
  ],
  // to allow multiple subdomains to share cookies
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true,
    },
    crossSubDomainCookies: {
      enabled: true,
      domains: [process.env.WEB_URL as string, process.env.ADMIN_URL as string],
    },
  },
});
