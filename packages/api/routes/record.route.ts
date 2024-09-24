import { Hono } from "hono";
import { RecordController } from "@/controllers/record.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const recordRoutes = new Hono();

recordRoutes.post("/", authMiddleware, RecordController.new);
recordRoutes.get("/", authMiddleware, RecordController.list);
recordRoutes.get("/:id", authMiddleware, RecordController.get);
recordRoutes.put("/:id", authMiddleware, RecordController.update);
recordRoutes.delete("/:id", authMiddleware, RecordController.delete);
recordRoutes.get("/download/:id/text", authMiddleware, RecordController.DownloadAsText);
recordRoutes.get("/download/:id/audio", authMiddleware, RecordController.DownloadOriginalAudio);
recordRoutes.get("/download/:id/pdf", authMiddleware, RecordController.DownloadAsPDF);

recordRoutes.get("/public/:id", RecordController.getPublicRecord);

export { recordRoutes };