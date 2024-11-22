import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

const grok = new Groq();

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
  const parsedData = requestSchema.safeParse(data);

  // 400 Incase incoming data is invalid
  if (!parsedData.success) {
    return NextResponse.json(
      {
        error: "Invalid Data",
      },
      { status: 400 }
    );
  }

  console.log("Paresed Data", parsedData);
  const completions = await grok.chat.completions.create({
    model: "llama3-8b-8192",
    temperature: 0.3,
    messages: [
      {
        // system instruction
        role: "system",
        content: `You are an simple assistant which takes user info and stores in mongodb, you dont have access to any other infomation nor you have any internet acess be to the point 
                - Greet the user and ask for user's name,
                - After reciving the name ask for user's phone number
                - After return this informantion in json formate

                Example : Hey welcome. Can you please enter your name
                user: akshay
                assistant: Thanks, can you enter your phone number
                user: 9524548875
                assistant: Thanks for providing the required information, you can move ahead.

                Then return the final output {name:"akshay", phoneNumber:9524548875, status: true}
                `,
      },

      // here should come the user msgs, or the chat history
      ...parsedData.data.messages,
    ],
    response_format: { type: "json_object" },
  });

  const response = completions.choices[0].message.content;
  const content = response ? JSON.parse(response) : {};
  if (content?.status) {
    console.log("hey => ", response);
    // Save this in mongoDB
  }
  //   console.log(response);
  return NextResponse.json(response);
}
