// Vercel serverless function: /api/chat
// Keeps the real Anthropic API key on the server. The browser never sees it.
//
// Setup:
//   1. In your Vercel project settings, add an environment variable:
//        ANTHROPIC_API_KEY = sk-ant-...   (your real key)
//   2. Deploy. Vercel automatically turns any file under /api into an
//      endpoint at /api/<filename>, so this becomes POST /api/chat.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error:
        "Server is missing ANTHROPIC_API_KEY. Set it in your hosting provider's environment variables.",
    });
  }

  const { system, messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  // Basic guardrails: cap message count and length so one request can't
  // blow up your API bill.
  const trimmedMessages = messages.slice(-20).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 4000),
  }));

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: String(system || "").slice(0, 4000),
        messages: trimmedMessages,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.error?.message || "Upstream request to Anthropic failed",
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach Anthropic API" });
  }
}
