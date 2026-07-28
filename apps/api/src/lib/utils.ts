import { UserBaseSchema, type UserBaseType } from "@repo/schemas";
import type { Context } from "hono";

export class ApiError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

export const getUserFromContext = (c: Context) => {
  try {
    let user: UserBaseType = c.get("user");
    if (!user) throw new ApiError("Unauthorized", 401);
    user = UserBaseSchema.parse(user);
    return user;
  } catch (e) {
    throw new ApiError("Unauthorized", 401);
  }
};
