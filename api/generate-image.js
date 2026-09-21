export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
  }

  try {
    const { prompt, size = "1024x1024" } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt wajib diisi." });
    }

    const aspectRatio = size === "1024x1536" ? "9:16" : "1:1";
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          model: "gemini-3.1-flash-image",
          input: [
            {
              type: "text",
              text: `Create a premium cinematic background for a motivational quote poster. No text, no letters, no logos. ${prompt}`
            }
          ],
          response_format: [
            {
              type: "image",
              mime_type: "image/png",
              aspect_ratio: aspectRatio,
              image_size: "1K"
            }
          ]
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Gemini image generation failed."
      });
    }

    const imageData = data?.output_image?.data;
    if (!imageData) {
      return res.status(502).json({ error: "Gemini tidak mengembalikan gambar." });
    }

    return res.status(200).json({
      image: `data:image/png;base64,${imageData}`,
      provider: "gemini"
    });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Server error." });
  }
}
