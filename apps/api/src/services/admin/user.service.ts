import { prisma } from "@repo/db";
import type { Context } from "hono";
import { ApiError } from "../../lib/utils.js";
import { auth } from "@repo/auth";
import z from "zod";

export const GetUsers = async (c: Context) => {
  const users = await prisma.user.findMany();
  return c.json(users);
};

export const ChangeUserPassword = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) throw new ApiError("User id is required", 400);
  const Payload = z.object({
    newPassword: z.string(),
  });
  const { newPassword } = Payload.parse(await c.req.json());
  const { status } = await auth.api.setUserPassword({
    body: { newPassword, userId: id },
    headers: c.req.raw.headers,
  });
  if (!status) throw new ApiError("Could not set password", 400);
  return c.json({});
};

export const DeleteUser = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) throw new ApiError("User id is required", 400);
  await auth.api.removeUser({
    body: { userId: id },
    headers: c.req.raw.headers,
  });
  return c.json({});
};
