import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  CreateTodo,
  DeleteTodo,
  GetTodos,
  UpdateTodo,
} from "../services/todo.service.js";

const TodoRoute = new Hono();

TodoRoute.use(requireAuth);

TodoRoute.get("/", GetTodos);

TodoRoute.post("/", CreateTodo);

TodoRoute.patch("/:id", UpdateTodo);

TodoRoute.delete("/:id", DeleteTodo);

export default TodoRoute;
