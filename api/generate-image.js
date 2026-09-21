export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.POLLINATIONS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "POLLINATIONS_API_KEY is not configured on the server." });
  }

  try {
    const { prompt, size = "1024x1024" } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt wajib diisi." });
    }

    const response = await fetch("https://gen.pollinations.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image",
        prompt: `Create a premium cinematic background for a motivational quote poster. No text, no letters, no logos. ${prompt}`,
        size,
        response_format: "b64_json",
        n: 1
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Pollinations image generation failed."
      });
    }

    const imageData = data?.data?.[0]?.b64_json;
    if (!imageData) {
      return res.status(502).json({ error: "Pollinations tidak mengembalikan gambar." });
    }

    return res.status(200).json({
      image: `data:image/jpeg;base64,${imageData}`,
      provider: "pollinations",
      model: "google/gemini-3.1-flash-image"
    });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Server error." });
  }
}
