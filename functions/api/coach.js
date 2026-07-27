export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await context.request.json();
    const { userAnswer, question, category, mode } = body;

    if (!userAnswer || !question) {
      return new Response(
        JSON.stringify({ error: "Missing userAnswer or question" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build the system prompt based on mode
    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "chat") {
      systemPrompt = `You are an expert cardiology fellowship interview coach. Your role is to provide constructive, actionable feedback on interview responses. Focus on clarity, specificity, professionalism, and demonstrating genuine interest in cardiology.

Evaluate the response and provide feedback in this JSON format:
{
  "clarityScore": <1-10>,
  "directnessScore": <1-10>,
  "specificityScore": <1-10>,
  "professionalismScore": <1-10>,
  "strengths": "<2-3 key things they did well>",
  "growthAreas": "<2-3 specific suggestions for improvement>",
  "followUpQuestion": "<One probing follow-up question a real interviewer might ask>"
}

Be encouraging but honest. Focus on specificity and concrete examples.`;

      userPrompt = `Interview Question Category: ${category}
Question: "${question}"

The candidate's answer: "${userAnswer}"

Provide structured feedback on this answer.`;
    } else if (mode === "quiz") {
      systemPrompt = `You are a cardiology fellowship interview quiz coach. A candidate answered a multiple-choice question. Provide brief, encouraging feedback.

Respond in this JSON format:
{
  "isCorrect": <boolean>,
  "score": <0-100>,
  "explanation": "<brief explanation of the answer>",
  "tip": "<one quick learning point>"
}`;

      userPrompt = `Question: ${question}
User's answer: ${userAnswer}

Provide feedback.`;
    }

    // Call Cloudflare Workers AI with GLM flash
    const response = await context.env.AI.run("@cf/zai-org/glm-4.7-flash", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    // Parse the response
    let feedback;
    try {
      const content = response.response || response.text || response;
      // Extract JSON from response if it's wrapped in text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content };
    } catch (e) {
      feedback = { raw: response.response || response.text || response };
    }

    return new Response(JSON.stringify(feedback), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Coach API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
