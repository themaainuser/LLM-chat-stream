import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(Request: NextRequest) {
  try {
    const { message } = await Request.json();
    const conversation = await genai.models.generateContent({
      // model: "gemini-2.0-flash",
      model: "gemini-2.5-flash",
      contents: message,
      // config: {
      //   maxOutputTokens: 2000,
      // },
    });

    console.log(JSON.stringify(conversation) + "this is conversation");

    return Response.json(
      {
        res: conversation!.candidates![0].content!.parts![0].text,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        error: "failed to load chat",
      },
      { status: 500 }
    );
  }
}
