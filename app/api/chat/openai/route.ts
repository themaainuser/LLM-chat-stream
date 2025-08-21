import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const deepseek = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  // defaultHeaders: {
  //   "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //   "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  // },
});

export async function POST(Request: NextRequest) {
  try {
    const { message } = await Request.json();
    console.log("Received message: ", message);

    const deepseekChat = await deepseek.chat.completions.create({
      model: "moonshotai/kimi-k2:free",
      messages: [{ role: "system", content: message }],
      // model: "deepseek/deepseek-chat-v3-0324:free",
    });

    // const openAIChat = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{ role: "user", content: message }],
    // });

    console.log(deepseekChat);
    console.log(
      "--------------------------------------------------------------"
    );
    console.log(deepseekChat.choices[0].message);
    return Response.json({
      res: deepseekChat.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Error in POST handler:", error); // Log full error to terminal

    return NextResponse.json(
      {
        error: "Failed to load chat",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
