import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const grok = new Groq();

export async function POST(request: Request) {
  const data = await request.json();
  console.log("Request object =>", data);
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
                `,
      },
      // here should come the user msgs, or the chat history
    ],
    response_format: { type: "json_object" },
  });

  const response = completions.choices[0].message.content;
  console.log(response);
  return NextResponse.json(response);
}
