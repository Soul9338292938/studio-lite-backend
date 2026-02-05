const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ================= GET USER GAMES ================= */
app.get("/games", async (req, res) => {
  const userId = req.query.userId;
  const apiKey = req.query.apiKey;

  if (!userId || !apiKey) {
    return res.json({ success: false, error: "Missing userId or apiKey" });
  }

  try {
    const response = await axios.get(
      `https://games.roblox.com/v2/users/${userId}/games`,
      {
        headers: { "x-api-key": apiKey }
      }
    );

    return res.json({
      success: true,
      games: response.data.data
    });

  } catch (err) {
    return res.json({ success: false, error: "Roblox API failed" });
  }
});

/* ================= PUBLISH PLACE ================= */
app.post("/publish", async (req, res) => {
  const { apiKey, placeId } = req.body;

  if (!apiKey || !placeId) {
    return res.json({ success: false, error: "Missing apiKey or placeId" });
  }

  try {
    await axios.post(
      `https://apis.roblox.com/universes/v1/places/${placeId}/versions?versionType=Published`,
      {},
      {
        headers: { "x-api-key": apiKey }
      }
    );

    return res.json({ success: true });

  } catch (err) {
    return res.json({ success: false, error: "Publish failed" });
  }
});

/* ================= START SERVER ================= */
app.get("/", (req, res) => {
  res.send("Studio Lite Backend Running");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
