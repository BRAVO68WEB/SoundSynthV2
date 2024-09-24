import { Hono } from "hono";
import { authRouter } from "@/routes/auth.route";
import { uploadRouter } from "@/routes/upload.route";
import { recordRoutes } from "@/routes/record.route";

const router = new Hono();

router.route("/auth", authRouter);
router.route("/upload", uploadRouter);
router.route("/record", recordRoutes);

export { router };