import UploaderService from "@/helpers/upload_client";
import Audio from "@/models/audio.model"
import { env } from '@/utils/env';

export class UploadService {
    public static async uploadFile(user_id: string, file: File) {
        const uploader = new UploaderService(env.R2_BUCKET_NAME);
        let id = crypto.randomUUID();
        const entity = "audio_recordings";
        id = id + "_" + file.name;
        await uploader.uploadFile(entity, id, file, "public-read");

        const audio = new Audio({
            auth0_id: user_id,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            s3_url: `${env.R2_PUBLIC_URL}/${entity}/${id}`,
        });

        await audio.save();

        return audio;
    }

    public static async getAudio(id: string) {
        const audio = await Audio.findById(id);
        return audio;
    }
}