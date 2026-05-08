import { createServerFn } from "@tanstack/react-start";

export const getFunFact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = data as { country?: string; lang?: string };
    if (!d || typeof d.country !== "string") throw new Error("country required");
    return { country: d.country, lang: typeof d.lang === "string" ? d.lang : "en" };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const langNames: Record<string, string> = {
      en: "English", es: "Spanish", fr: "French", de: "German", pt: "Portuguese",
      it: "Italian", hi: "Hindi", bn: "Bengali", ar: "Arabic", zh: "Simplified Chinese",
      ja: "Japanese", ru: "Russian", sw: "Swahili",
    };
    const lang = langNames[data.lang] ?? "English";

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: `You write surprising, accurate one-sentence trivia about countries. Reply ONLY with the fact, in ${lang}, no preface, no quotation marks, max 220 characters.` },
          { role: "user", content: `Give me one little-known but verifiable fun fact about ${data.country}.` },
        ],
      }),
    });
    if (!res.ok) {
      if (res.status === 429) throw new Response("Rate limited", { status: 429 });
      if (res.status === 402) throw new Response("Out of credits", { status: 402 });
      throw new Error(`AI gateway error: ${res.status}`);
    }
    const json = await res.json();
    const fact = json?.choices?.[0]?.message?.content?.toString().trim() ?? "";
    return { fact };
  });
