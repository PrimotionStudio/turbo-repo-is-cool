import type { Context } from "hono";
import { getUserFromContext } from "../lib/utils.js";
import { prisma } from "@repo/db";
import { AccountCreateSchema } from "@repo/schemas";

export const GetSelf = async (c: Context) => {
  let user = getUserFromContext(c);
  user = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
  });
  return c.json(user);
};

export const ChangePassword = async (c: Context) => {
  let user = getUserFromContext(c);
  const data = AccountCreateSchema.pick({ password: true }).parse(
    await c.req.json(),
  );
  // await prisma.user.update({ where: { id: user.id }, data });
  return c.json({});
};
