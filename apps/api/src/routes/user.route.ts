import { Hono } from "hono";
import { ChangePassword, GetSelf } from "../services/user.service.js";

const UserRoute = new Hono();

UserRoute.get("/", GetSelf);

UserRoute.post("/change-password", ChangePassword);

export default UserRoute;
