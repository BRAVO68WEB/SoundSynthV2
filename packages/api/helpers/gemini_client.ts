import axios from "axios";
import { env } from '@/utils/env';

export const summarize = async (text: string) => {
  let reqdata = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text:
              "Summerize the text for me in such a way so I can create a mental model of the text next I read it and should be easy to understad. The text is: " +
              text,
          },
        ],
      },
    ],
  });

  let reqconfig = {
    method: "post",
    maxBodyLength: Infinity,
    url:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      env.GEMINI_API_KEY,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqdata,
  };

  const { data } = await axios(reqconfig);
  return data.candidates[0].content.parts[0].text;
};