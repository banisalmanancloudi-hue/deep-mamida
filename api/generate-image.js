export default async function handler(req, res) {
  const allowedOrigin = "https://banisalmanancloudi-hue.github.io";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.POLLINATIONS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "POLLINATIONS_API_KEY is not configured in Vercel Production." });
  }

  try {
    const { prompt, size = "1024x1024" } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt wajib diisi." });
    }
    if (prompt.length > 1000) {
      return res.status(400).json({ error: "Prompt terlalu panjang (maksimal 1000 karakter)." });
    }

    const safeSize = ["1024x1024", "1024x1536"].includes(size) ? size : "1024x1024";
    const upstream = await fetch("https://gen.pollinations.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image",
        prompt: `Create a premium cinematic background for a motivational quote poster. No text, no letters, no logos. ${prompt}`,
        size: safeSize,
        n: 1,
        response_format: "url"
      })
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.error?.message || data?.error || `Pollinations returned HTTP ${upstream.status}.`
      });
    }

    const imageUrl = data?.data?.[0]?.url;
    if (!imageUrl) {
      return res.status(502).json({ error: "Pollinations tidak mengembalikan URL gambar." });
    }

    return res.status(200).json({
      image: imageUrl,
      provider: "pollinations",
      model: "google/gemini-3.1-flash-image"
    });
  } catch (error) {
    console.error("generate-image error:", error);
    return res.status(500).json({ error: error?.message || "Server error saat membuat gambar." });
  }
}
