export async function handler(event, context) {
  const key = process.env.OPENAI_API_KEY;

  console.log("Function invoked");
  console.log("OPENAI_API_KEY present:", !!key);

  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        fortune: "Missing OpenAI key. The cookie is silent today."
      })
    };
  }

  try {
    const prompt = "Generate one short, playful fortune in one sentence. Make it light-hearted and fun.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You generate short, fun fortunes." },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.9
      })
    });

    console.log("OpenAI status:", response.status);

    const raw = await response.text();
    console.log("OpenAI raw response:", raw);

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = JSON.parse(raw);
    const fortune = data.choices?.[0]?.message?.content?.trim() || "The cookie is silent today.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ fortune })
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        fortune: "The fortune maker has failed all of his classes and must retake them."
      })
    };
  }
}
