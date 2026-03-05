"use client";

import { motion } from "framer-motion";
import { Send, FileText, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

const suggestedQuestions = [
  "What are Afraz's top skills?",
  "Tell me about his AI projects",
  "What's his work experience?",
  "What technologies does he use?",
];

export function ChatbotCard() {
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        role: "assistant",
        content:
          "Hi! I'm an AI assistant trained on Afraz's portfolio. Ask me anything about his experience, projects, or skills!",
      },
    ]
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userMessage = (text || input).trim();
    if (!userMessage) return;

    setInput("");
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: data.answer,
          sources: data.sources || []
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect to the backend. Please make sure the server is running.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-5xl md:text-6xl font-medium mb-2 tracking-tight">
          AI Assistant
        </h1>
        <p className="text-lg text-muted-foreground">
          Powered by RAG — ask anything about Afraz&apos;s work
        </p>
      </div>

      {/* Chat Container */}
      <div className="border border-border rounded-xl bg-card/60 backdrop-blur-xl overflow-hidden">
        {/* Messages */}
        <div className="h-[460px] overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-start gap-2.5 max-w-[80%]">
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-foreground/60" />
                  </div>
                )}
                <div
                  className={`rounded-2xl ${
                    msg.role === "user"
                      ? "bg-foreground/90 text-background"
                      : "bg-secondary/80 text-foreground"
                  }`}
                >
                {/* Message Content */}
                <div className="p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>

                {/* RAG Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="px-4 pb-3 pt-2 border-t border-border/30">
                    <div className="flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          Sources:
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {msg.sources.map((source, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 text-xs bg-background/60 text-foreground/80 rounded-md border border-border/40"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-secondary/80 backdrop-blur-sm p-4 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Suggested Questions */}
          {showSuggestions && messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-foreground/5 text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-card/20">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
              placeholder="Ask about skills, projects, experience..."
              className="flex-1 border-border"
              disabled={isLoading}
            />
            <Button
              onClick={() => void handleSend()}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}