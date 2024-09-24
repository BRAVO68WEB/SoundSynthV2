import { Context } from "hono";
import { UploadService } from "@/services/upload.service"

export class UploadController {
  static async upload(c: Context) {
    const user = c.get("user");

    const {
        file
    } = await c.req.parseBody();

    if (!file) {
      return c.json({ message: "No file uploaded" }, 400);
    }

    if (file instanceof File) {
      const result = await UploadService.uploadFile(user.sub, file);
      return c.json(result);
    }

    return c.json({ message: "Invalid file type" }, 400);
  }
}