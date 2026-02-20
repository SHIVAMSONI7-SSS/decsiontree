import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { mode, options, history } = await req.json();

    let systemPrompt = "";
    if (mode === "ask_questions") {
      systemPrompt = `You are a decision expert. User is stuck between: ${options.opt1} and ${options.opt2}.
      Ask ONE deep question. Provide 2-3 short MCQ options for the user to choose from.
      
      IMPORTANT: You MUST respond ONLY in this JSON format:
      {
        "text": "Your question here?",
        "options": ["Option 1", "Option 2", "Both/Neither"]
      }`;
    } else {
      systemPrompt = `Analyze the conversation between ${options.opt1} and ${options.opt2}. 
      Provide a final dashboard report with Pros, Cons, and a Winner. Use clear headings and emojis.`;
    }

    const chat = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((m: any) => ({ role: m.role, content: m.content }))
      ],
      model: "llama-3.3-70b-versatile",
      response_format: mode === "ask_questions" ? { type: "json_object" } : undefined,
    });

    const resText = chat.choices[0]?.message?.content || "";
    
    if (mode === "ask_questions") {
      return NextResponse.json(JSON.parse(resText));
    }
    return NextResponse.json({ text: resText });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error", text: "AI is tired. Refresh!" }, { status: 500 });
  }
}