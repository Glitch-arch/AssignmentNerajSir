import { PrismaClient } from "@prisma/client";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

const grok = new Groq();
const prisma = new PrismaClient();

const chatCompletionSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const requestSchema = z.object({
  messages: z.array(chatCompletionSchema),
});

export async function POST(request: Request) {
  const data = await request.json();
  console.log("data", data);
  const data2 = { messages: data };
  const parsedData = requestSchema.safeParse(data2);

  // 400 Incase incoming data is invalid
  if (!parsedData.success) {
    console.log("parsing failed");
    return NextResponse.json(
      {
        error: "Invalid Data",
      },
      { status: 400 }
    );
  }

  console.log("Parsed Data", parsedData);
  const completions = await grok.chat.completions.create({
    model: "llama3-8b-8192",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `You are a simple assistant that collects user information and stores it in MongoDB. You don't have access to any other information or internet access. Follow these steps strictly:

1. Initial greeting:
Return: { "role": "assistant", "message": "Hello! Can you please enter your name?" }

2. After receiving name:
Return: { "role": "assistant", "message": "Thanks! Can you please enter your phone number?" }

3. After receiving phone number:
Return final output: { "name": "user_name", "phoneNumber": phone_number_as_integer, "status": true }

Example flow:
Assistant: { "role": "assistant", "message": "Hello! Can you please enter your name?" }
User: John
Assistant: { "role": "assistant", "message": "Thanks! Can you please enter your phone number?" }
User: 1234567890
Assistant: { "name": "John", "phoneNumber": 1234567890, "status": true }

Important:
- Always return valid JSON
- In intermediate steps, use the format: { "role": "assistant", "message": "your message" }
- In final step, use the format: { "name": string, "phoneNumber": number, "status": true }
- Phone number must be an integer in the final output
- Do not include any additional text or formatting outside the JSON structure`,
      },
      ...parsedData.data.messages,
    ],
    response_format: { type: "json_object" },
  });

  const response = completions.choices[0].message.content;
  const content = response ? JSON.parse(response) : {};
  console.log("content", content);

  if (content?.status) {
    console.log("hey => ", response);
    // Save this in mongoDB
    await prisma.userInfo
      .create({
        data: {
          name: content.name,
          phoneNumber: content.phoneNumber,
        },
      })
      .catch((error) => {
        throw error;
      });

    return NextResponse.json(
      {
        role: "assistant",
        content: "That is it. Thanks for providing the info",
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      role: "assistant",
      content: content.message,
    },
    { status: 200 }
  );
}
