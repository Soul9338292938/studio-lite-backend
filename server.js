const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("Studio-Lite backend running");
});

app.post("/publish", async (req, res) => {
  try {
    const { key, placeId } = req.body || {};

    if (!key || !placeId) {
      return res.status(400).json({ success: false });
    }

    const numericPlaceId = Number(placeId);

    const robloxResponse = await fetch(
      `https://apis.roblox.com/universes/v1/places/${numericPlaceId}/versions`,
      {
        method: "POST",
        headers: {
          "x-api-key": key,
          "Content-Type": "application/json",
        },
        body: "{}",
      }
    );

    if (!robloxResponse.ok) {
      return res.status(400).json({ success: false });
    }

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false });
  }
});

app.listen(PORT);
