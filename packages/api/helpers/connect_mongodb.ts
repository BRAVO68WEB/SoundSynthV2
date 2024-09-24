import mongoose from "mongoose";
import { env } from '@/utils/env';

export const connectMongo = async () => {
    const mongoUrl = env.MONGO_URI;
    if (!mongoUrl) {
        throw new Error("MONGO_URL is not defined");
    }
    await mongoose.connect(mongoUrl, {
        dbName: "sound-synth"
    });
};