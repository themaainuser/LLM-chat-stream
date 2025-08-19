import { OpenAI } from "openai";
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
    const conversation = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
      // config: {
      //   maxOutputTokens: 200,
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

  //   const res = await openai.chat.completions.create({
  //     model: "gpt-4",
  //     messages: [{ role: "user", content: "Hello, world!" }],
  //   });
  //   return res;
  // try {
  //   const { message } = await req.json();

  //   const complition = await openai.chat.completions.create({
  //     model: "gemini-2.5-flash",
  //     messages: [{ role: "user", content: message }],
  //   });

  //   return Response.json({
  //     res: complition.choices[0].message.content,
  //   });
  // } catch (error: any) {
  //   return Response.json(
  //     {
  //       error: "faild to load chat",
  //     },
  //     { status: 500 }
  //   );
  // }
}
