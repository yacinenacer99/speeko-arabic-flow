import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { transcript, topic, metrics } = await req.json() as {
      transcript: string;
      topic: string;
      metrics: {
        fillerCount: number;
        forbiddenUsed: number;
        duration: number;
        pace: number;
        flowScore: number;
      };
    };

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `أنت مدرب متخصص في تطوير مهارات الكلام والثقة بالنفس للناطقين بالعربية.

تحليل جلسة تدريبية:
- السؤال: ${topic}
- ما قاله المتحدث: ${transcript}
- مدة الكلام: ${Math.round(metrics.duration)} ثانية
- سرعة الكلام: ${metrics.pace} كلمة/دقيقة
- كلمات الحشو: ${metrics.fillerCount}
- الكلمات الممنوعة المستخدمة: ${metrics.forbiddenUsed}

أعطني JSON فقط بدون أي نص إضافي:
{
  "relevancyScore": <0-100>,
  "answerQualityScore": <0-100>,
  "coachingFeedback": "<3-4 جمل تقييم شامل بالعربية، صادق ومحدد وبناء>",
  "strengths": ["<نقطة قوة 1>", "<نقطة قوة 2>"],
  "improvements": ["<نقطة تحسين 1>", "<نقطة تحسين 2>"]
}

معايير:
- relevancyScore: هل كلامه ذو صلة بالسؤال؟
- answerQualityScore: هل أجاب فعلاً بوجهة نظر واضحة؟
- coachingFeedback: تقييم صادق ومحدد
- strengths: ما أحسن فيه تحديداً
- improvements: ما يجب تحسينه تحديداً`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[MLASOON] Claude API error:", err);
      return new Response(
        JSON.stringify({ error: "Claude API failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const text = data.content[0].text as string;

    let coaching;
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      coaching = JSON.parse(clean);
    } catch {
      console.error("[MLASOON] JSON parse error:", text);
      return new Response(
        JSON.stringify({ error: "Invalid coaching response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(coaching),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[MLASOON] Coach function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
