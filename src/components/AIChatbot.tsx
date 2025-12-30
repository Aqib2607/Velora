import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your AI shopping assistant. How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: userMessage, isBot: false },
    ]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
      if (!apiKey) {
        throw new Error("API key not configured");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: text,
          isBot: true,
        },
      ]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I apologize, but I'm having trouble connecting right now. Please check your API configuration or try again later.",
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-bg shadow-lg flex items-center justify-center animate-pulse-glow"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 md:bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-md"
          >
            <div className="glass-card overflow-hidden shadow-2xl flex flex-col max-h-[600px]">
              {/* Header */}
              <div className="gradient-bg p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">AI Assistant</h3>
                    <p className="text-xs text-primary-foreground/80">Powered by Gemini</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4 custom-scrollbar flex-grow">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2 ${message.isBot ? "" : "flex-row-reverse"
                      }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isBot
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-secondary-foreground"
                        }`}
                    >
                      {message.isBot ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${message.isBot
                        ? "bg-secondary text-secondary-foreground rounded-tl-sm"
                        : "gradient-bg text-primary-foreground rounded-tr-sm"
                        }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tl-sm p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border flex-shrink-0 bg-background">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 h-11 px-4 rounded-full bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    disabled={isLoading}
                    className="h-11 w-11 rounded-full gradient-bg disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
