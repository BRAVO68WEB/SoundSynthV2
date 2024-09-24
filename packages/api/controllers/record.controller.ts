import { RecordService } from "@/services/record.service";
import { UploadService } from "@/services/upload.service";
import { Context } from "hono";

export class RecordController {
    public static async new(c: Context) {
        try {
            const {
                title,
                audio_id
            } = await c.req.json();
    
            const user = c.get("user");
    
            const record = await RecordService.createRecord(
                user.sub,
                title,
                audio_id
            );
    
            return c.json(record);
        }
        catch (e) {
            if (e instanceof Error) {
                return c.json({
                    error: e.message,
                });
            }
        }
    }

    public static async list(c: Context): Promise<Response> {
        try {
            const user = c.get("user");

            const record_store: Array<{
                id: string;
                user_id: string;
                title: string;
                audio_id: string;
                transcription: string;
                created_at: Date;
                updated_at: Date;
            }> = [];

            const records = await RecordService.getAllRecordsForUser(user.sub);

            for (const record of records) {
                const transcript = record.transcription.slice(0, 100) + "...";
                record_store.push({
                    id: record._id.toString(),
                    user_id: record.auth0_id,
                    title: record.title,
                    audio_id: String(record.audio_id),
                    transcription: transcript,
                    created_at: record.createdAt,
                    updated_at: record.updatedAt,
                });
            }

            return c.json({
                data: record_store
            });
        }
        catch (e) {
            if (e instanceof Error) {
                return c.json({
                    error: e.message,
                });
            }
            return c.json({
                error: "An unknown error occurred"
            });
        }
    }

    public static async get(c: Context) {
        try {
            const user = c.get("user");
            const { id } = c.req.param();

            if (!id) {
                throw new Error('No id');
            }

            const record = await RecordService.getRecordById(user.sub, id);

            if (!record) {
                throw new Error('Record not found');
            }

            const audio = await UploadService.getAudio(
                String(record.audio_id)
            );

            if (!audio) {
                throw new Error('Audio not found');
            }

            return c.json({
                record: {
                    id: record._id.toString(),
                    user_id: record.auth0_id,
                    title: record.title,
                    audio_id: String(record.audio_id),
                    transcription: record.transcription,
                    summary: record.summary,
                    created_at: record.createdAt,
                    updated_at: record.updatedAt,
                },
                audio: {
                    id: audio._id.toString(),
                    url: audio.s3_url,
                    size: audio.file_size,
                    type: audio.file_name,
                    created_at: audio.createdAt,
                    updated_at: audio.updatedAt,
                }
            });
        }
        catch (e) {
            if (e instanceof Error) {
                return c.json({
                    error: e.message,
                });
            }
        }
    }

    public static async delete(c: Context) {
        try {
            const user = c.get("user");
            const { id } = c.req.param();

            if (!id) {
                throw new Error('No id');
            }

            await RecordService.deleteRecord(user.sub, id);

            return c.json({
                message: 'Record deleted',
            });
        }
        catch (e) {
            if (e instanceof Error) {
                return c.json({
                    error: e.message,
                });
            }
        }
    }

    public static async update(c: Context) {
        try {
            const user = c.get("user");
            const { id } = c.req.param();

            if (!id) {
                throw new Error('No id');
            }
            
            const {
                title,
                summary,
                is_public,
            } = await c.req.json();

            const record = await RecordService.updateRecord(user.sub, id, {
                title,
                summary,
                is_public,
            });

            return c.json(record);
        }
        catch (e) {
            if (e instanceof Error) {
                return c.json({
                    error: e.message,
                });
            }
        }
    }

    public static async getPublicRecord(c: Context) {
        try {
            const { id } = c.req.param();

            if (!id) {
                throw new Error('No id');
            }

            const record = await RecordService.getPublicRecord(
                id
            );

            return c.json(record);
        }
        catch (e) {
            if (e instanceof Error) {
                return c.json({
                    error: e.message,
                });
            }
        }
    }

    public static async DownloadAsText(c: Context) {
        try {
            const { id } = c.req.param();

            if (!id) {
                throw new Error('No id');
            }

            const user = c.get("user");

            const record = await RecordService.getRecordById(
                user.sub,
                id
            );

            if (!record) {
                throw new Error('Record not found');
            }

            const text = record.summary;
            c.header('Content-Type', 'text/plain');
            c.header('Content-Disposition', `attachment; filename="${record.title}.txt"`);
            c.header('Content-Length', text.length.toString());
            c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            return c.body(text);
        }
        catch (e) {
            if (e instanceof Error) {
                return c.json({
                    error: e.message,
                });
            }
        }
    }

    public static async DownloadAsPDF(c: Context) {
        try {
            const { id } = c.req.param();
            if (!id) {
                throw new Error('No id');
            }

            const user = c.get("user");
            const record = await RecordService.getRecordById(
                user.sub,
                id
            );

            if (!record) {
                throw new Error('Record not found');
            }

            const pdf = await RecordService.generatePDF(record.summary);

            c.header('Content-Type', 'application/pdf');
            c.header('Content-Disposition', `attachment; filename="${record.title}.pdf"`);
            c.header('Content-Length', pdf.length.toString());
            c.header('Cache-Control', 'no-cache, no-store, must-revalidate');

            return c.body(pdf);
        }
        catch (e) {
            if (e instanceof Error) {
                return c.json({
                    error: e.message,
                });
            }
        }
    }

    public static async DownloadOriginalAudio(c: Context) {
        try {
            const { id } = c.req.param();
            if (!id) {
                throw new Error('No id');
            }

            const user = c.get("user");

            const record = await RecordService.getRecordById(
                user.sub,
                id
            );

            if (!record) {
                throw new Error('Record not found');
            }

            const audio = await UploadService.getAudio(
                String(record.audio_id)
            );
            
            if (!audio) {
                throw new Error('Audio not found');
            }

            return c.redirect(audio.s3_url);
        }
        catch (e) {
            if (e instanceof Error) {
                return c.json({
                    error: e.message,
                });
            }
        }
    }
}