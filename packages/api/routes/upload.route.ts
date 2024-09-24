import { Hono } from "hono";
import { UploadController } from "@/controllers/upload.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const uploadRouter = new Hono();

uploadRouter.put("/new", authMiddleware, UploadController.upload);

export { uploadRouter };