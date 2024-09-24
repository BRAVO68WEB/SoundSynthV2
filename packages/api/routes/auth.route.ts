import { Hono } from "hono";
import { AuthController } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const authRouter = new Hono();

authRouter.get("/login", AuthController.login);
authRouter.get("/callback", AuthController.callback);
authRouter.get("/me", authMiddleware, AuthController.me);

export { authRouter };