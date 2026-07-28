import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/db";
import { openAPI, admin, magicLink } from "better-auth/plugins";
import { sendMagicLinkEmail, sendVerificationEmail } from "@repo/emails";

export const auth = betterAuth({
  // --- Core Configuration ---
  // The base path for all authentication API routes.
  basePath: "/api/v1/auth",
  // A strong, random secret key used for signing tokens and encrypting data.
  secret: process.env.BETTER_AUTH_SECRET as string,
  // The base URL of your authentication service, used for generating callback URLs.
  baseURL: process.env.BETTER_AUTH_URL as string,
  // Application name, used in emails and other UI elements.
  appName: "Todo App",
  // Logging configuration. 'debug' provides detailed logs.
  logger: {
    level: "debug",
  },
  // Rate limiting to prevent abuse.
  rateLimit: {
    // The time window in milliseconds for which requests are counted.
    window: 1000, // 1 second
    // The maximum number of requests allowed within the window.
    max: 100, // 100 requests per second
  },
  // List of trusted origins that are allowed to interact with the authentication service.
  trustedOrigins: [
    process.env.WEB_URL as string,
    process.env.ADMIN_URL as string,
  ],

  // --- Database Integration ---
  // Configures the database adapter for BetterAuth, using Prisma with a PostgreSQL provider.
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // --- Authentication Methods ---
  // Configuration for email and password authentication.
  emailAndPassword: {
    // Enable or disable email and password login.
    enabled: true,
    // Require users to verify their email address before they can sign in.
    requireEmailVerification: true,
  },
  // Configuration for social login providers.
  socialProviders: {
    // Google OAuth provider setup.
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // --- Email Verification ---
  emailVerification: {
    // Automatically sign in the user after their email has been successfully verified.
    autoSignInAfterVerification: true,
    // The expiration time for email verification tokens in seconds.
    expiresIn: 3600, // 1 hour
    // Send a verification email when a user attempts to sign in without a verified email.
    sendOnSignIn: true,
    // Send a verification email immediately after a user signs up.
    sendOnSignUp: true,
    // Custom function to send the verification email.
    sendVerificationEmail: async ({ user, token }) => {
      // NOTE THAT `user.role` is available at runtime but betterAuth team has not yet updated the type check
      const url = `${process.env.WEB_URL}/verify-email/${token}`;
      void sendVerificationEmail(user.email, user.name, url);
    },
  },

  // --- User Management ---
  user: {
    // Configuration for allowing users to change their email address.
    changeEmail: {
      enabled: false, // Disabling this feature for now.
    },
    // Configuration for allowing users to delete their account.
    deleteUser: {
      enabled: true, // Enable account deletion.
    },
    // Define additional fields for the user model.
    additionalFields: {
      // 'role' field to manage user permissions.
      role: {
        type: "string", // Data type of the field.
        defaultValue: "USER", // Default value for new users.
        input: false, // This field is not exposed as an input in forms by default.
      },
    },
  },

  // --- Plugins ---
  plugins: [
    // OpenAPI plugin to generate API documentation.
    openAPI(),
    // Admin plugin for role-based access control.
    admin({
      // The default role assigned to new users.
      defaultRole: "USER",
      // The field in the user model that stores the user's role.
      roleField: "role",
      // A list of roles that are considered administrators.
      adminRoles: ["ADMIN"],
    }),
    // Magic Link plugin for passwordless login.
    magicLink({
      // Allow or disallow account creation via magic link.
      disableSignUp: false, // false = allow account creation
      // The expiration time for magic link tokens in seconds.
      expiresIn: 60 * 15, // 15 minutes, a tighter expiration than email verification as it's also a login token.
      // Custom function to send the magic link email.
      sendMagicLink: async ({ email, token }) => {
        const url = `${process.env.WEB_URL}/verify-email/${token}`;
        void sendMagicLinkEmail(email, url);
      },
    }),
  ],

  // --- Advanced Configuration ---
  // Advanced settings for custom cookie attributes and cross-subdomain cookie sharing.
  advanced: {
    // Default attributes applied to all cookies set by BetterAuth.
    defaultCookieAttributes: {
      sameSite: "none", // Allows cookies to be sent with cross-site requests.
      secure: true, // Ensures cookies are only sent over HTTPS.
      partitioned: true, // Partitions the cookie storage by top-level site, enhancing privacy.
    },
    // Configuration for allowing cookies to be shared across multiple subdomains.
    crossSubDomainCookies: {
      enabled: true, // Enable cross-subdomain cookie sharing.
      // List of domains where cookies should be accessible.
      domains: [process.env.WEB_URL as string, process.env.ADMIN_URL as string],
    },
  },
});
