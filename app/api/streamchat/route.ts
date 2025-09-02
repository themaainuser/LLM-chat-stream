import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// const openai = new OpenAI({
//   apiKey:
//     process.env.OPENAI_API_KEY || "AIzaSyA2faWNfo6ueOfdj4n3Ji94kvBUjYtq19o",
// });

export async function POST(Request: NextRequest) {
  try {
    const { message } = await Request.json();
    // console.log(message + " this is message");
    const stream = await genai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: message,
      config: {
        maxOutputTokens: 1024,
      },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk!.candidates![0].content!.parts![0].text || "";
          if (content) {
            controller.enqueue(
              encoder.encode(JSON.stringify(content + "\n\n"))
            );
          }
        }
        controller.close();
      },
    });
    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "failed to load chat",
      },
      { status: 500 }
    );
  }
}
