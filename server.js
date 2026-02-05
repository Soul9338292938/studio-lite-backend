const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("Studio-Lite backend running");
});

app.get("/games", async (req, res) => {
  try {
    const { key, userId } = req.query || {};

    if (!key || !userId) {
      return res.status(400).json({ success: false });
    }

    const r = await fetch(
      `https://apis.roblox.com/universes/v1/users/${userId}/universes`,
      {
        headers: { "x-api-key": key }
      }
    );

    if (!r.ok) {
      return res.status(400).json({ success: false });
    }

    const data = await r.json();
    return res.json({ success: true, games: data.data || [] });
  } catch {
    return res.status(500).json({ success: false });
  }
});

app.post("/publish", async (req, res) => {
  try {
    const { key, placeId } = req.body || {};

    if (!key || !placeId) {
      return res.status(400).json({ success: false });
    }

    const r = await fetch(
      `https://apis.roblox.com/universes/v1/places/${Number(placeId)}/versions`,
      {
        method: "POST",
        headers: {
          "x-api-key": key,
          "Content-Type": "application/json"
        },
        body: "{}"
      }
    );

    if (!r.ok) {
      return res.status(400).json({ success: false });
    }

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false });
  }
});

app.listen(PORT);
