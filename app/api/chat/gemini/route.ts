import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
export async function POST(Request: NextRequest) {
  try {
    const { message } = await Request.json();
    // console.log(message + " this is message");
    const conversation = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
      // config: {
      //   maxOutputTokens: 2000,
      // },
    });

    console.log(conversation + "this is conversation");

    return Response.json(
      {
        res: conversation,
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
