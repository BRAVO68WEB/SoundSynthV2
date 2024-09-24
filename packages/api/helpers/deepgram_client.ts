import { createClient } from "@deepgram/sdk";
import { env } from '@/utils/env';

export const transcribeUrl = async (url: string) => {
  const deepgramApiKey = env.DEEPGRAM_API_KEY;
  if (!deepgramApiKey) {
    throw new Error("DEEPGRAM_API_KEY is not set");
  }
  const deepgram = createClient(deepgramApiKey);

  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    { url },
    { smart_format: true, model: "nova-2", language: "en-US" },
  );

  if (error) throw error;

  if (!result) throw new Error("No result");

  return result.results?.channels[0]?.alternatives[0]?.transcript ?? "";
};