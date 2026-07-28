import { serve } from "@hono/node-server";
import { auth } from "@repo/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { rateLimiter } from "hono-rate-limiter";
import { trimTrailingSlash } from "hono/trailing-slash";
import UserRoute from "./routes/user.route.js";
import TodoRoute from "./routes/todo.route.js";
import AdminTodoRoute from "./routes/admin/todo.route.js";
import AdminUserRoute from "./routes/admin/user.route.js";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
}>({ strict: false }).basePath("/api/v1");
const isDev = process.env.NODE_ENV !== "production";

app.use(poweredBy({ serverName: "The Primotion Studio" }));
if (isDev) app.use(logger());
app.use(trimTrailingSlash());

app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    limit: 100,
    keyGenerator: (c) =>
      c.req.header("authorization") ||
      "s0o/zUqljoDwbcbVVeAJMuN6APudZ2WeqnPtpGAMlMA",
  }),
);

app.use(
  "*",
  cors({
    origin: [process.env.FRONTEND_URL!, "http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    maxAge: 600,
    credentials: true,
  }),
);

app.get("/", (c) => c.text("Hello Todo!"));
app.get("/server-time", (c) => c.json({ now: Date.now() }));

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

app.route("/user", UserRoute);
app.route("/todo", TodoRoute);
app.route("/admin/todo", AdminTodoRoute);
app.route("/admin/user", AdminTodoRoute);

serve(
  {
    fetch: app.fetch,
    port: process.env.PORT as unknown as number,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
