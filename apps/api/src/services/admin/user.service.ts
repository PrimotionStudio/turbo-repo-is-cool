import { prisma } from "@repo/db";
import { AccountCreateSchema } from "@repo/schemas";
import type { Context } from "hono";
import { ApiError } from "../../lib/utils.js";

export const GetUsers = async (c: Context) => {
  const users = await prisma.user.findMany();
  return c.json(users);
};

export const ChnageUserPassword = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) throw new ApiError("User id is required", 400);
  const data = AccountCreateSchema.pick({ password: true }).parse(
    await c.req.json(),
  );
  // await prisma.user.update({ where: { id }, data });
  return c.json({});
};

export const DeleteUser = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) throw new ApiError("User id is required", 400);
  await prisma.user.delete({ where: { id } });
  return c.json({});
};
