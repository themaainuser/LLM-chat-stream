"use client";
import { NextResponse } from "next/server";
import { useState } from "react";
import Markdown from "./components/Markdown";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [streamResponse, setStreamResponse] = useState("");

  const handleChat = async () => {
    setLoading(true);
    setResponse("");
    // try {
    //   const chatResponse = await fetch("/api/chat/openai", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ message }),
    //   });
    //   const data = await chatResponse.json();
    //   console.log("API Response:", data);

    //   const text = data?.res?.candidates?.[0]?.content?.[0]?.text;
    //   // const chat = data.res.choices[0].content.message.text;
    //   const chat = data.res;
    //   if (chat) {
    //     setResponse(chat);
    //   } else {
    //     setResponse("Unexpected response format.");
    //   }
    // } catch (error: any) {
    //   setResponse(error.message + " response error");
    // } finally {
    //   setLoading(false);
    // }
    try {
      const chatResponse = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await chatResponse.json();
      console.log("API Response:", data);

      // const text = data?.res?.candidates?.[0]?.content?.[0]?.text;
      // const chat = data.res.choices[0].content.message.text;
      const chat = data.res;
      if (chat) {
        setResponse(chat);
      } else {
        setResponse("Unexpected response format.");
      }
    } catch (error: any) {
      setResponse(error.message + " response error");
    } finally {
      setLoading(false);
    }
  };

  const handleStreamChat = async () => {
    setLoading(true);
    setStreamResponse("");
    try {
      const res = await fetch("/api/streamchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });
      const decoder = new TextDecoder();
      const reader = res.body?.getReader();

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const line = chunk.split("\n");
        for (const l of line) {
          const data = JSON.parse(l);
          setStreamResponse((prev) => prev + data);
        }
      }
      setLoading(false);
    } catch (error: any) {
      setStreamResponse(error.message + " response error");
    }
    setLoading(false);
  };

  return (
    //<div className="min-w-[80vw] flex justify-center items-center h-screen">
    // <div className="bg-neutral-300 h-screen w-screen flex justify-center items-center rounded-xl border py-6">
    //   <div className="border-2 border-black p-2 m-2 text-black rounded-lg">
    //     <button onClick={handleStreamChat}>
    //       {loading ? "Loading..." : "Send"}
    //     </button>
    //   </div>
    //   <div className="border-2 border-black p-2 m-2 text-black rounded-lg w-fit">
    //     <Markdown text={streamResponse} />
    //   </div>
    //   <input
    //     value={message}
    //     onChange={(e) => setMessage(e.target.value)}
    //     className="border-none  min-w-4xl bg-white p-2 text-sm text-black"
    //     onKeyDown={
    //       !message
    //         ? (e) => e.key === "Enter" && e.preventDefault()
    //         : (e) => e.key === "Enter" && handleStreamChat()
    //     }
    //   />
    // </div>

    <div className="min-w-[40vw] flex justify-center items-center h-screen text-white">
      <div className="bg-neutral-200 w-1/4 flex justify-center items-center rounded-xl border-none py-6 h-screen text-black mr-1 ">
        Sidepanel
      </div>
      <div className="w-screen h-screen flex justify-center items-center rounded-xl border-none py-6 bg-neutral-400">
        <div className="">
          <div className="border-2 h-[700] min-w-4xl border-black p-2 m-2 text-black rounded-lg w-fit">
            {response}
          </div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-w-4xl flex justify-center max-h-14 align-middle bg-white p-2 text-sm rounded-2xl text-black m-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
            onKeyDown={
              !message
                ? (e) => e.key === "Enter" && e.preventDefault()
                : (e) => e.key === "Enter" && handleChat()
            }
          />
          <button
            onClick={handleChat}
            className="border-1 border-black text-sm p-1 max-h-10 m-0 bottom-6 left-[1328] absolute text-black rounded-4xl"
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </div>
      </div>
      {/* <div className="border-2 border-black p-2 m-2 text-black rounded-lg w-fit">
        <Markdown text={response} />
        </div> */}
    </div>
  );
}
