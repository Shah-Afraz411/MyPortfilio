"use client";

import { motion } from "framer-motion";
import { Send, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

export function ChatbotCard() {
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        role: "assistant",
        content:
          "Hi! I'm an AI assistant trained on the portfolio data. Ask me anything about the experience, projects, or skills!",
      },
    ]
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
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
        <h1 className="text-5xl md:text-6xl font-medium mb-4 tracking-tight">
          AI Assistant
        </h1>
        <p className="text-xl text-muted-foreground">
          Powered by RAG technology, trained on portfolio knowledge
        </p>
      </div>

      {/* Chat Container */}
      <div className="border border-border rounded-2xl bg-card/60 backdrop-blur-xl overflow-hidden">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
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
              <div
                className={`max-w-[80%] rounded-2xl backdrop-blur-sm ${
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
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-card/20">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 border-border"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
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