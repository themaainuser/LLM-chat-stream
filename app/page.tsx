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
    try {
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });
      const data = await chatResponse.json();
      console.log(data.res.candidates[0].content.parts[0].text);
      setResponse(data.res.candidates[0].content.parts[0].text);
      setLoading(false);
    } catch (error: any) {
      setResponse(error.message + " response error");
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
        const { value, done } = await reader.read();
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
    //   <div className="border-2 border-black p-2 m-2 text-black rounded-lg">
    //     <button onClick={handleStreamChat}>
    //       {loading ? "Loading..." : "Send"}
    //     </button>
    //   </div>
    //   <div className="border-2 border-black p-2 m-2 text-black rounded-lg w-fit">
    //     <Markdown text={streamResponse} />
    //   </div>
    // </div>

    <div className="bg-neutral-300 h-screen w-screen flex justify-center items-center rounded-xl border py-6">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border-none  min-w-4xl bg-white p-2 text-sm text-black"
        onKeyDown={
          !message
            ? (e) => e.key === "Enter" && e.preventDefault()
            : (e) => e.key === "Enter" && handleChat()
        }
      />
      <div className="border-2 border-black p-2 m-2 text-black rounded-lg">
        <button onClick={handleChat}>{loading ? "Loading..." : "Send"}</button>
      </div>
      {/* <div className="border-2 border-black p-2 m-2 text-black rounded-lg w-fit">
        {response}
      </div> */}
      <div className="border-2 border-black p-2 m-2 text-black rounded-lg w-fit">
        <Markdown text={response} />
      </div>
    </div>
  );
}
