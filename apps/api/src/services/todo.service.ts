import type { Context } from "hono";
import { TodoCreateSchema } from "@repo/schemas";
import { prisma } from "@repo/db";
import { ApiError, getUserFromContext } from "../lib/utils.js";

export const CreateTodo = async (c: Context) => {
  const user = getUserFromContext(c);
  const data = TodoCreateSchema.omit({ userId: true }).parse(
    await c.req.json(),
  );
  const todo = await prisma.todo.create({
    data: { ...data, userId: user.id },
  });
  return c.json(todo, 201);
};

export const GetTodos = async (c: Context) => {
  const user = getUserFromContext(c);
  const todos = await prisma.todo.findMany({
    where: { userId: user.id },
  });
  return c.json(todos);
};

export const UpdateTodo = async (c: Context) => {
  const user = getUserFromContext(c);
  const id = c.req.param("id");
  if (!id) throw new ApiError("Todo id is required", 400);
  const data = TodoCreateSchema.omit({ userId: true }).parse(
    await c.req.json(),
  );
  await prisma.todo.update({
    where: { id, userId: user.id },
    data,
  });
  return c.json({});
};

export const DeleteTodo = async (c: Context) => {
  const user = getUserFromContext(c);
  const id = c.req.param("id");
  if (!id) throw new ApiError("Todo id is required", 400);
  await prisma.todo.delete({
    where: { id, userId: user.id },
  });
  return c.json({});
};
