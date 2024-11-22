"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  content: string;
  role: "user" | "assistant";
}

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content:
        "Thanks for visiting the assignment Sir ! Please provide your name.",
      role: "assistant",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        content: input.trim(),
        role: "user",
      };

      // First update messages with the user's message
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");

      try {
        // API call with updated messages including the new user message
        console.log("Updated msgs data going in api body", updatedMessages);
        const response = await fetch("/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMessages),
        });

        const data = await response.json();

        console.log("incoming api data", data);
        // Then update messages again with the assistant's response
        setMessages([
          ...updatedMessages,
          { role: data.role, content: data.content },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        // Optionally add error handling UI here
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Chatbot Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((message, key) => (
            <div
              key={key}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex items-start ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.role === "user" ? "U" : "B"}
                  </AvatarFallback>
                  <AvatarImage
                    src={
                      message.role === "user"
                        ? "/placeholder.svg?height=32&width=32"
                        : "/placeholder.svg?height=32&width=32"
                    }
                  />
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
