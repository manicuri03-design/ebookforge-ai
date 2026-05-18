import { NextResponse } from "next/server";
import { detectNiche } from "@/lib/smartNicheDetector";

export async function POST(request: Request) {
  try {
    const { userPrompt } = await request.json();
    if (!userPrompt || userPrompt.trim().length < 3) {
      return NextResponse.json({ error: "Descreva o tema do seu ebook." }, { status: 400 });
    }

    const niche = detectNiche(userPrompt);

    // Forward to the main generate route with auto-detected params
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: userPrompt,
        topic: userPrompt,
        category: niche.nichoKey,
        tone: niche.tom,
        chapters: 7,
        visualStyle: niche.visualStyle,
      }),
    });

    const data = await res.json();
    return NextResponse.json({ ...data, nicheProfile: niche });
  } catch (err) {
    console.error("Auto-generate error:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
