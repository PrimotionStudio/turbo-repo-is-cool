/**
 * schemas.ts — AUTO-GENERATED. DO NOT EDIT BY HAND.
 * Source: schema.prisma
 * Regenerate with: bun run generate:schemas
 *
 * Naming convention (per model X):
 *  1. XBaseSchema   / XBaseType   — scalars only, no relations
 *  2. XSchema       / XType       — scalars + relations (z.lazy for circular refs)
 *  3. XCreateSchema / XCreateType
 *  4. XUpdateSchema / XUpdateType
 */
import z from "zod";

/* ------------------------------------------------------------------------ */
/* Shared primitives                                                        */
/* ------------------------------------------------------------------------ */

const dateSchema = z.coerce.date();

export const RoleSchema = z.enum(["ADMIN", "USER"]);
export type Role = z.infer<typeof RoleSchema>;

/* -------------------------------------------------------------------------- */
/* User                                                                       */
/* -------------------------------------------------------------------------- */

// 1. Base Schema
export const UserBaseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email().toLowerCase(),
  emailVerified: z.boolean().default(false),
  image: z.url("Must be a valid URL").nullable().optional(),
  banned: z.boolean().default(false),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  role: RoleSchema.default("USER"),
});

// 2. Base Type
export type UserBaseType = z.infer<typeof UserBaseSchema>;

// 3. Full Type (interface so it can participate in circular relations)
export interface UserType extends UserBaseType {
  sessions: SessionType[];
  accounts: AccountType[];
  todos: TodoType[];
}

// 4. Full Schema
export const UserSchema: z.ZodType<UserType> = UserBaseSchema.extend({
  sessions: z.lazy(() => SessionSchema.array()),
  accounts: z.lazy(() => AccountSchema.array()),
  todos: z.lazy(() => TodoSchema.array()),
});

// 5. Create / Update variants
export const UserCreateSchema = UserBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  emailVerified: z.boolean().default(false).optional(),
  role: RoleSchema.default("USER").optional(),
});
export type UserCreateType = z.infer<typeof UserCreateSchema>;

export const UserUpdateSchema = UserCreateSchema.partial();
export type UserUpdateType = z.infer<typeof UserUpdateSchema>;

/* -------------------------------------------------------------------------- */
/* Session                                                                    */
/* -------------------------------------------------------------------------- */

// 1. Base Schema
export const SessionBaseSchema = z.object({
  id: z.uuid(),
  expiresAt: dateSchema,
  token: z.string(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  userId: z.string(),
});

// 2. Base Type
export type SessionBaseType = z.infer<typeof SessionBaseSchema>;

// 3. Full Type (interface so it can participate in circular relations)
export interface SessionType extends SessionBaseType {
  user: UserType;
}

// 4. Full Schema
export const SessionSchema: z.ZodType<SessionType> = SessionBaseSchema.extend({
  user: z.lazy(() => UserSchema),
});

// 5. Create / Update variants
export const SessionCreateSchema = SessionBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type SessionCreateType = z.infer<typeof SessionCreateSchema>;

export const SessionUpdateSchema = SessionCreateSchema.partial();
export type SessionUpdateType = z.infer<typeof SessionUpdateSchema>;

/* -------------------------------------------------------------------------- */
/* Account                                                                    */
/* -------------------------------------------------------------------------- */

// 1. Base Schema
export const AccountBaseSchema = z.object({
  id: z.uuid(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  idToken: z.string().nullable().optional(),
  accessTokenExpiresAt: dateSchema.nullable().optional(),
  refreshTokenExpiresAt: dateSchema.nullable().optional(),
  scope: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// 2. Base Type
export type AccountBaseType = z.infer<typeof AccountBaseSchema>;

// 3. Full Type (interface so it can participate in circular relations)
export interface AccountType extends AccountBaseType {
  user: UserType;
}

// 4. Full Schema
export const AccountSchema: z.ZodType<AccountType> = AccountBaseSchema.extend({
  user: z.lazy(() => UserSchema),
});

// 5. Create / Update variants
export const AccountCreateSchema = AccountBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type AccountCreateType = z.infer<typeof AccountCreateSchema>;

export const AccountUpdateSchema = AccountCreateSchema.partial();
export type AccountUpdateType = z.infer<typeof AccountUpdateSchema>;

/* -------------------------------------------------------------------------- */
/* Verification                                                               */
/* -------------------------------------------------------------------------- */

// 1. Base Schema
export const VerificationBaseSchema = z.object({
  id: z.uuid(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: dateSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// 2. Base Type
export type VerificationBaseType = z.infer<typeof VerificationBaseSchema>;

// 3. Full Type — no relations, so Full === Base
export type VerificationType = VerificationBaseType;

// 4. Full Schema — no relations, so Full === Base
export const VerificationSchema: z.ZodType<VerificationType> =
  VerificationBaseSchema;

// 5. Create / Update variants
export const VerificationCreateSchema = VerificationBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type VerificationCreateType = z.infer<typeof VerificationCreateSchema>;

export const VerificationUpdateSchema = VerificationCreateSchema.partial();
export type VerificationUpdateType = z.infer<typeof VerificationUpdateSchema>;

/* -------------------------------------------------------------------------- */
/* Todo                                                                       */
/* -------------------------------------------------------------------------- */

// 1. Base Schema
export const TodoBaseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  userId: z.string(),
  description: z.string().nullable().optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// 2. Base Type
export type TodoBaseType = z.infer<typeof TodoBaseSchema>;

// 3. Full Type (interface so it can participate in circular relations)
export interface TodoType extends TodoBaseType {
  user: UserType;
}

// 4. Full Schema
export const TodoSchema: z.ZodType<TodoType> = TodoBaseSchema.extend({
  user: z.lazy(() => UserSchema),
});

// 5. Create / Update variants
export const TodoCreateSchema = TodoBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type TodoCreateType = z.infer<typeof TodoCreateSchema>;

export const TodoUpdateSchema = TodoCreateSchema.partial();
export type TodoUpdateType = z.infer<typeof TodoUpdateSchema>;
