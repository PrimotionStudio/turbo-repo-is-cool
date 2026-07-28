import type { Context } from "hono";
import { ApiError, getUserFromContext } from "../lib/utils.js";
import { prisma } from "@repo/db";
import z from "zod";
import { auth } from "@repo/auth";

export const GetSelf = async (c: Context) => {
  let user = getUserFromContext(c);
  user = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
  });
  return c.json(user);
};

export const ChangePassword = async (c: Context) => {
  const Payload = z.object({
    currentPassword: z.string(),
    newPassword: z.string(),
  });
  const { currentPassword, newPassword } = Payload.parse(await c.req.json());
  const user = await auth.api.changePassword({
    body: { currentPassword, newPassword, revokeOtherSessions: true },
    headers: c.req.raw.headers,
  });
  if (!user) throw new ApiError("Could not change password", 400);
  return c.json({});
};
