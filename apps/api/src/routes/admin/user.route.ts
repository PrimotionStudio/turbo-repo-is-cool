import { Hono } from "hono";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import {
  GetUsers,
  ChangeUserPassword,
  DeleteUser,
} from "../../services/admin/user.service.js";

const AdminUserRoute = new Hono();

AdminUserRoute.use(requireAuth, requireRole("ADMIN"));

AdminUserRoute.get("/", GetUsers);

AdminUserRoute.patch("/:id/change-password", ChangeUserPassword);

AdminUserRoute.delete("/:id", DeleteUser);

export default AdminUserRoute;
