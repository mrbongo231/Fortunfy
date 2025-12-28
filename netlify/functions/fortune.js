export async function handler(event, context) {
  try {
    const prompt = "Generate one short, playful fortune in one sentence. Make it light-hearted and fun.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "GPT-5 nano",
        messages: [
          { role: "system", content: "You generate short, fun fortunes." },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.9
      })
    });

    const data = await response.json();
    const fortune =
      data.choices?.[0]?.message?.content?.trim() ||
      "The cookie is silent today.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ fortune })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        fortune: "The fortune maker has failed all of his classes and must retake them."
      })
    };
  }
}
