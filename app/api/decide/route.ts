import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are YURI, an AI assistant for Shivam Soni's portfolio. Shivam is an AI/ML Engineer from Hazaribag. Keep answers short and professional."
        },
        ...messages,
      ],
    });

    const aiResponse = response.choices[0]?.message?.content || "No response.";
    return NextResponse.json({ text: aiResponse });

  } catch (error) {
    return NextResponse.json({ error: "Failed to connect to Groq" }, { status: 500 });
  }
}