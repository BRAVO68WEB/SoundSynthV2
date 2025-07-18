import { transcribeUrl } from "@/helpers/deepgram_client";
import Record from "@/models/records.model";
import Audio from "@/models/audio.model";
import { summarize } from "@/helpers/gemini_client";
import puppeteer from "puppeteer";
import { markdownToHtml } from "@/utils/md_parse";

export class RecordService {
    public static async getAllRecordsForUser(
        userId: string,
    ) {
        return Record.find({
            auth0_id: userId,
        })
        .select('-__v')
        .select('-summary');
    }

    public static async getRecordById(
        userId: string,
        id: string,
    ) {
        return Record.findOne({
            auth0_id: userId,
            _id: id,
        }).select('-__v')
    }

    public static async createRecord(
        auth0_id: string,
        title: string,
        audio_id: string,
    ) {
        const audio = await Audio.findById(audio_id);

        if (!audio) {
            throw new Error("Audio not found");
        }

        const transcription = await transcribeUrl(
            audio.s3_url,
        );

        if (!transcription) {
            throw new Error("Transcription failed");
        }

        const summary = await summarize(transcription);

        const record = new Record({
            auth0_id,
            audio_id,
            title,
            is_public: false,
            summary,
            transcription,
        });
        return record.save();
    }

    public static async updateRecord(
        userId: string,
        id: string,
        update: {
            title?: string;
            audio_id?: string;
            is_public?: boolean;
            summary?: string;
            transcription?: string;
        }
    ) {
        return Record.findOneAndUpdate({
            _id: id,
            auth0_id: userId,
        }, update, { new: true });
    }

    public static async deleteRecord(
        userId: string,
        id: string,
    ) {
        return Record.findOneAndDelete({
            _id: id,
            auth0_id: userId,
        });
    }

    public static async getPublicRecord(
        id: string,
    ) {
        return Record.findOne({
            _id: id,
            is_public: true,
        }).populate('audio_id');
    }

    public static async generatePDF(
        text: string,
    ) {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        const html = await markdownToHtml(
            text,
        );
        await page.setContent(
            html
        );
        const blob = await page.pdf({
            format: "A4",
            displayHeaderFooter: true,
            printBackground: true,
            margin: {
                top: 100,
                bottom: 100,
                left: 100,
                right: 100,
            },
            footerTemplate: `
                <div style="font-size: 10px; padding-left: 30px; text-align: center;">
                    <span>Generated by Gemini</span>
                </div>
            `,
        });
        
        return blob;
    }
}