import { createAuthClient } from "better-auth/client";
import { magicLinkClient, usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:9999",
  basePath: "/api/v1/auth",
  plugins: [magicLinkClient(), usernameClient()],
});
