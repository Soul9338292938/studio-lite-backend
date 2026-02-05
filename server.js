const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

/* ===============================
   HEALTH CHECK (optional)
================================ */
app.get("/", (req, res) => {
  res.send("Studio Lite backend running");
});

/* ===============================
   PUBLISH BUILD TO SELECTED PLACE
================================ */
app.post("/publish", async (req, res) => {
  const { apiKey, placeId, buildData } = req.body;

  // Basic validation
  if (!apiKey || !placeId) {
    return res.status(400).json({
      success: false,
      error: "Missing apiKey or placeId",
    });
  }

  try {
    const response = await fetch(
      `https://apis.roblox.com/universes/v1/places/${placeId}/versions`,
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildData || {}),
      }
    );

    // If Roblox API fails, capture real error
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Publish error:", err);

    return res.status(500).json({
      success: false,
      error: "Publish failed",
    });
  }
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
