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
    const { transcript, topic, metrics, userGoal, userStage, sessionCount, previousFlowScore } = await req.json() as {
      transcript: string;
      topic: string;
      metrics: {
        fillerCount: number;
        forbiddenUsed: number;
        duration: number;
        pace: number;
        flowScore: number;
        longestPause: number;
        wordCount: number;
      };
      userGoal: string;
      userStage: number;
      sessionCount: number;
      previousFlowScore: number | null;
    };

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const goalContext: Record<string, string> = {
      interview: "المستخدم يتدرب للمقابلات الوظيفية — ركز على الوضوح والبنية والثقة في الثواني الأولى",
      work: "المستخدم يتدرب لاجتماعات العمل والعروض — ركز على وضوح الطلب وتجنب الإطالة",
      personal: "المستخدم يتدرب للتطوير الشخصي — ركز على الأصالة والتواصل الحقيقي",
      content: "المستخدم يتدرب للمحتوى والبودكاست — ركز على الخطاف والتدفق والطاقة",
    };

    const stageContext = userStage <= 2
      ? "المستخدم في المراحل الأولى — شجعه على الاستمرار، كن لطيفاً لكن صادقاً"
      : userStage <= 4
      ? "المستخدم في مرحلة متوسطة — ارفع سقف توقعاتك، كن أكثر تحدياً"
      : "المستخدم متقدم — كن صارماً، ركز على الدقة والتأثير";

    const progressContext = previousFlowScore !== null
      ? previousFlowScore > metrics.flowScore
        ? `تراجع من ${previousFlowScore} إلى ${metrics.flowScore} — اذكر هذا التراجع وساعده يفهم السبب`
        : `تحسن من ${previousFlowScore} إلى ${metrics.flowScore} — اعترف بهذا التقدم تحديداً`
      : "هذه أولى جلساته — ضع توقعات واقعية وحفزه على الاستمرار";

    const prompt = `أنت أفضل مدرب في العالم لتطوير مهارات الكلام والثقة بالنفس للناطقين بالعربية.
مهمتك: تحليل هذه الجلسة وتقديم تغذية راجعة تجعل المتحدث يشعر أنك كنت في الغرفة معه.

السياق:
- السؤال الذي طُرح: ${topic}
- هدف المستخدم: ${goalContext[userGoal] ?? "تطوير الكلام بشكل عام"}
- مستواه: ${stageContext}
- عدد الجلسات السابقة: ${sessionCount}
- ${progressContext}

ما قاله المتحدث بالضبط:
"${transcript}"

المقاييس:
- تحدث لمدة: ${Math.round(metrics.duration)} ثانية من أصل 60
- السرعة: ${metrics.pace} كلمة/دقيقة (المثالي: 120-140)
- كلمات الحشو: ${metrics.fillerCount}
- الكلمات الممنوعة: ${metrics.forbiddenUsed}
- أطول توقف: ${metrics.longestPause} ثانية
- عدد الكلمات: ${metrics.wordCount}

تعليمات التحليل — اتبعها بدقة:

1. افحص كيف بدأ: هل بدأ بموقف واضح أم بتمهيد مطول؟
2. ابحث عن لغة التردد: "يعني، ممكن، نوعاً ما، في الحقيقة، كيف أقول"
3. ابحث عن طلب التأكيد: "صح؟ مو كذا؟ تعرف؟"
4. هل أجاب على السؤال أم تحدث حوله؟
5. هل أنهى أفكاره أم قطعها في المنتصف؟
6. أين تجمعت كلمات الحشو؟ قبل الأفكار الصعبة؟ عند الانتقال؟
7. هل استخدم أدلة وأمثلة أم مجرد ادعاءات؟
8. كيف أنهى إجابته؟ بقوة أم بتلاشٍ؟

أعطني JSON فقط بدون أي نص خارجه، بهذا الشكل بالضبط:
{
  "relevancyScore": <0-100 — هل ما قاله ذو صلة بالسؤال؟>,
  "answerQualityScore": <0-100 — هل أجاب فعلاً بوجهة نظر واضحة ومدعومة؟>,
  "rootCause": "<جملة واحدة — السبب الجذري الحقيقي وراء الأداء، مش الأعراض>",
  "evidenceQuote": "<اقتبس كلماته الحرفية من النص كدليل على التشخيص>",
  "coachingFeedback": "<3-4 جمل — تقييم صادق وإنساني ومحدد، كأنك تتكلم معه وجهاً لوجه>",
  "strengths": ["<نقطة قوة محددة مع دليل من كلامه>"],
  "improvements": ["<نقطة تحسين محددة مع تمرين عملي واضح>"],
  "nextSessionDrill": "<تمرين واحد محدد يطبقه في جلسته القادمة — عملي وقابل للتنفيذ فوراً>",
  "patternAlert": "<اختياري — إذا لاحظت نمطاً خطيراً يكرره، اذكره بوضوح، وإلا اتركه فارغاً>"
}

قواعد صارمة:
- لا تكتب أي شيء خارج JSON
- اقتبس من كلامه الحرفي دائماً كدليل
- كن صادقاً حتى لو كان الأداء ضعيفاً — الصدق هو الاحترام الحقيقي
- لا تكتب نصائح عامة — كل شيء يجب أن يكون مخصصاً لهذه الجلسة
- التمرين العملي يجب أن يكون شيئاً يقدر يطبقه في 5 دقائق`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1000,
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
