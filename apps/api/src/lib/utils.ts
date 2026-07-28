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

const toPrismaInclude = (
  obj: Record<string, unknown>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === true) {
      result[key] = true;
    } else {
      result[key] = {
        include: toPrismaInclude(value as Record<string, unknown>),
      };
    }
  }
  return result;
};

export const getIncludeParams = (c: Context) => {
  const query = c.req.query();
  const include = query.include;
  if (!include) return undefined;
  const includeFields = include
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  if (includeFields.length === 0) return undefined;
  const result: Record<string, unknown> = {};
  for (const field of includeFields) {
    const parts = field.split(".");
    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        if (current[part] === undefined) {
          current[part] = true;
        }
      } else {
        if (current[part] === undefined || current[part] === true) {
          current[part] = {};
        }
        current = current[part] as Record<string, unknown>;
      }
    }
  }
  return toPrismaInclude(result);
};
