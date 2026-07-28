import { Hono } from "hono";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { DeleteTodo, GetTodos } from "../../services/admin/todo.service.js";

const AdminTodoRoute = new Hono();

AdminTodoRoute.use(requireAuth, requireRole("ADMIN"));

AdminTodoRoute.get("/", GetTodos);

AdminTodoRoute.delete("/:id", DeleteTodo);

export default AdminTodoRoute;
