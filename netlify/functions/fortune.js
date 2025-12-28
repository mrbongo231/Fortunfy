// Fallback fortunes when AI API is unavailable
const fallbackFortunes = [
  "A surprise awaits you around the corner!",
  "Today is your lucky day - embrace it!",
  "Good things come to those who scroll.",
  "Your creativity will lead to unexpected success.",
  "A new adventure is just a click away.",
  "The stars align in your favor today.",
  "Your positive attitude will attract wonderful opportunities.",
  "Something you lost will soon be found.",
  "A delightful surprise is heading your way.",
  "Your next meal will be especially tasty.",
  "Laughter is the best medicine - take a double dose today!",
  "An unexpected compliment will brighten your day.",
  "Your hard work will pay off sooner than you think.",
  "A friend will share good news with you soon.",
  "Trust your instincts - they know the way.",
  "A small act of kindness will create big ripples.",
  "Your smile has the power to change someone's day.",
  "Adventure awaits those who dare to refresh.",
  "The universe is conspiring in your favor.",
  "Something wonderful is about to happen!"
];

function getRandomFallbackFortune() {
  const index = Math.floor(Math.random() * fallbackFortunes.length);
  return fallbackFortunes[index];
}

export async function handler(event, context) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  console.log("Function invoked");
  console.log("ANTHROPIC_API_KEY present:", !!anthropicKey);

  if (!anthropicKey) {
    console.log("Missing Anthropic key — using fallback");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ fortune: getRandomFallbackFortune() })
    };
  }

  try {
    const prompt = "Generate one short, playful fortune in one sentence. Make it light-hearted and fun.";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-4.5-haiku",
        max_tokens: 100,
        system: "You generate short, fun fortunes. Respond with only the fortune itself.",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt }
            ]
          }
        ]
      })
    });

    console.log("Anthropic status:", response.status);

    const raw = await response.text();
    console.log("Anthropic raw response:", raw);

    if (response.ok) {
      const data = JSON.parse(raw);
      const fortune = data.content?.[0]?.text?.trim();

      if (fortune) {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({ fortune })
        };
      }
    }

    console.log("Anthropic returned no usable fortune — using fallback");

  } catch (error) {
    console.error("Anthropic error:", error.message);
  }

  // Fallback
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({ fortune: getRandomFallbackFortune() })
  };
}
