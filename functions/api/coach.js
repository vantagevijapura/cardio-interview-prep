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
      systemPrompt = `You are a Program Director at a top-tier academic cardiology fellowship evaluating fellowship interview candidates. You expect depth, clinical maturity, and clear vision.

SCORING (1-10 scale):
- Clarity: Is it articulate, well-structured, easy to follow? Can a busy physician grasp it in 30 seconds?
- Directness: Does it answer decisively without rambling? Top candidates are concise and purposeful.
- Specificity: Does it include concrete clinical examples, specific knowledge, or measurable accomplishments?
- Professionalism: Does the tone reflect maturity, genuine expertise, appropriate confidence, and humility?

FEEDBACK REQUIREMENTS - Be thorough and actionable:

For "strengths": List 1-2 specific things the candidate did well. Be honest but constructive.

For "growthAreas": Provide:
1. Specific issues (what's missing or weak)
2. Why it matters (how this affects their competitiveness)
3. Concrete framework/example of how to improve (e.g., "Strong answers include: [specific case] → [what you learned] → [how you'll apply this in fellowship]")
4. Typical interviewer follow-ups (what they'll probe on)

For "refinedAnswer": Take the candidate's actual input and elevate it into an excellent answer. Show them what a strong candidate would say by:
1. Keeping their core idea/experience
2. Adding structure (trigger → evidence → vision)
3. Including specific clinical/professional details
4. Demonstrating reflection and growth
5. Connecting to fellowship goals

Provide the feedback as a JSON object with these fields:
- clarityScore (integer 1-10)
- directnessScore (integer 1-10)
- specificityScore (integer 1-10)
- professionalismScore (integer 1-10)
- strengths (string: 1-2 specific strengths)
- growthAreas (string: detailed feedback organized by issues, why it matters, how to improve)
- refinedAnswer (string: elevated version of their answer)`;

      userPrompt = `Question Category: ${category}
Question: "${question}"

Candidate's Response: "${userAnswer}"

Evaluate this response thoroughly.`;
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

    // Call OpenAI API with GPT-5.4-nano
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5.4-nano",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_completion_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI error response:", JSON.stringify(errorData));
      throw new Error(`OpenAI API error: ${openaiResponse.status} ${JSON.stringify(errorData.error)}`);
    }

    const response = await openaiResponse.json();

    console.log("OpenAI response structure:", JSON.stringify({
      hasChoices: !!response.choices,
      choicesLength: response.choices?.length,
      messageContent: response.choices?.[0]?.message?.content?.substring(0, 100),
    }));

    // Parse the OpenAI response (should be valid JSON due to response_format)
    let feedback;
    try {
      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("No content in OpenAI response");
      }

      // Try to parse directly
      feedback = JSON.parse(content);
      console.log("Successfully parsed feedback");
    } catch (e) {
      console.error("Parse error:", e.message);
      console.error("Content preview:", response.choices?.[0]?.message?.content?.substring(0, 200));
      feedback = { raw: response.choices?.[0]?.message?.content || "Error parsing response" };
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
