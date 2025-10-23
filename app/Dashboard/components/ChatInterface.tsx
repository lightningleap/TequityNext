"use client";

import { useState, useRef, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt?: Date;
  url?: string;
}

interface ChatInterfaceProps {
  selectedFile: FileItem | null;
  onClose?: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function ChatInterface({
  selectedFile,
  onClose,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Add user message
      setMessages(prev => [...prev, { text: inputValue, isUser: true }]);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = generateAIResponse();
        setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
      }, 1000);

      setInputValue("");
    }
  };

  const generateAIResponse = (): string => {
    const responses = [
      "I understand your question. Let me help you with that.",
      "That's an interesting point. Here's what I think...",
      "I can help you find information about that in your documents.",
      "Let me analyze that for you. Based on what I see...",
      "Good question! Here's my analysis...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h2 className="font-medium">Chat Assistant</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {selectedFile ? (
          <div className="mb-4 p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-100 p-2 rounded">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{selectedFile.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedFile.type} • {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            {selectedFile.url ? (
              <div className="mt-4 border rounded-md overflow-hidden">
                <iframe
                  src={selectedFile.url}
                  className="w-full h-[500px]"
                  title={selectedFile.name}
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No preview available for this file type.
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How can I help you today?
              </h3>
              <p className="text-gray-500 text-sm">
                Ask me anything about your files or documents.
              </p>
            </div>
          </div>
        )}

        {/* Messages Display Area */}
        {messages.length > 0 && (
          <div className="mb-4 space-y-3 min-h-[200px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        <form onSubmit={handleSendMessage} className="border-t border-gray-200 pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                selectedFile ? "Ask about this file..." : "Type a message..."
              }
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button type="submit" size="sm" disabled={!inputValue.trim()}>
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
