import { prisma } from "@repo/db";
import type { Context } from "hono";
import { ApiError } from "../../lib/utils.js";

export const GetTodos = async (c: Context) => {
  const todos = await prisma.todo.findMany();
  return c.json(todos);
};

export const DeleteTodo = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) throw new ApiError("Todo id is required", 400);
  await prisma.todo.delete({ where: { id } });
  return c.json({});
};
