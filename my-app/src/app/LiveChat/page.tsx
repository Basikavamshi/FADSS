"use client";

import React, { useEffect, useRef, useState } from "react";

type FilePreview = {
  id: string;
  file: File;
  url: string;
  kind: "image" | "video" | "audio" | "pdf" | "other";
};

type Message = {
  id: string;
  user: boolean;
  text?: string;
  files?: FilePreview[];
  timestamp: number;
};

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recOrderBlobs, setRecOrderBlobs] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function pushMessage(m: Message) {
    setMessages((s) => [...s, m]);
  }

  async function send() {
    if (!text.trim() && previews.length === 0) return;
    setSending(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      user: true,
      text: text.trim() || undefined,
      files: previews.length ? previews : undefined,
      timestamp: Date.now()
    };

    pushMessage(userMsg);
    setText("");
    setPreviews([]);

    setTimeout(() => {
      pushMessage({
        id: "bot-" + Date.now(),
        user: false,
        text: "(Simulated reply — no backend)",
        timestamp: Date.now()
      });
      setSending(false);
    }, 500);
  }

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newPreviews: FilePreview[] = files.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      url: URL.createObjectURL(f),
      kind: f.type.startsWith("image")
        ? "image"
        : f.type.startsWith("video")
        ? "video"
        : f.type.startsWith("audio")
        ? "audio"
        : f.type === "application/pdf"
        ? "pdf"
        : "other"
    }));

    setPreviews((p) => [...p, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function startRecording() {
    if (isRecording) return;
    setRecOrderBlobs([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0)
          setRecOrderBlobs((b) => [...b, ev.data]);
      };

      mr.start(200);
      setIsRecording(true);
    } catch {
      alert("Microphone permission denied.");
    }
  }

  async function stopRecording() {
    if (!isRecording) return;
    setIsRecording(false);

    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();

    setTimeout(async () => {
      const blob = new Blob(recOrderBlobs, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      const file = new File([blob], `record-${Date.now()}.webm`, {
        type: blob.type
      });

      setPreviews((p) => [
        ...p,
        {
          id: Math.random().toString(36).slice(2),
          file,
          url,
          kind: "audio"
        }
      ]);

      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/whisper", { method: "POST", body: form });
      const data = await res.json();

      if (data.text) setText((t) => t + " " + data.text);
    }, 200);
  }

  function formatTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-3xl h-[80vh] bg-white shadow-lg rounded-2xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="px-4 py-3 border-b flex justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full text-white flex justify-center items-center font-bold">LC</div>
            <div>
              <div className="font-semibold">Live Chat</div>
              <div className="text-xs text-gray-500">Voice → Text</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">Online</div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.user ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] p-3 rounded-2xl ${m.user ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
                {m.text && <div>{m.text}</div>}

                {m.files?.map((f) => (
                  <div key={f.id} className="mt-2">
                    {f.kind === "audio" && <audio controls src={f.url} className="w-full" />}
                  </div>
                ))}

                <div className="text-xs mt-1 opacity-70">{formatTime(m.timestamp)}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT AREA */}
        <div className="border-t p-3">
          <div className="relative w-full">

            {/* TEXTAREA AUTO-RESIZE */}
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 150) + "px";
              }}
              onKeyDown={handleKeyPress}
              placeholder="Type a message…"
              className="w-full p-3 pr-32 rounded-xl border resize-none overflow-hidden min-h-[48px] max-h-[150px]"
            />

            {/* FIXED CENTER-RIGHT ICONS */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">

              {/* UPLOAD */}
              <label
                htmlFor="file-input"
                className="cursor-pointer p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                📎
              </label>
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                multiple
                onChange={onFiles}
                className="hidden"
              />

              {/* RECORD */}
              <button
                onClick={() => (isRecording ? stopRecording() : startRecording())}
                className={`p-2 rounded-full ${
                  isRecording ? "bg-red-600 text-white" : "bg-gray-200"
                }`}
              >
                🎤
              </button>

              {/* SEND */}
              <button
                onClick={send}
                disabled={sending}
                className="bg-indigo-600 text-white px-3 py-2 rounded-lg"
              >
                ➤
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}