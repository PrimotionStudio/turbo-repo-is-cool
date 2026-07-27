import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:9999",
  basePath: "/api/v1/auth",
});
