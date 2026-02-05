const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("Studio Lite backend running");
});

/* ================= GET USER GAMES ================= */
app.get("/games", async (req, res) => {
  try {
    const { userId, apiKey } = req.query;

    if (!userId || !apiKey) {
      return res.json({ success: false, error: "Missing userId or apiKey" });
    }

    const response = await axios.get(
      `https://develop.roblox.com/v1/universes?creatorTargetId=${userId}&creatorType=User`,
      {
        headers: { "x-api-key": apiKey }
      }
    );

    return res.json({
      success: true,
      games: response.data.data || []
    });

  } catch (err) {
    console.log("Roblox error:", err.response?.data || err.message);
    return res.json({ success: false, error: "Failed to fetch games" });
  }
});

/* ================= PUBLISH PLACE ================= */
app.post("/publish", async (req, res) => {
  try {
    const { placeId, apiKey } = req.body;

    if (!placeId || !apiKey) {
      return res.json({ success: false, error: "Missing placeId or apiKey" });
    }

    await axios.post(
      `https://apis.roblox.com/universes/v1/places/${placeId}/versions`,
      {},
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        }
      }
    );

    return res.json({ success: true });

  } catch (err) {
    console.log("Publish error:", err.response?.data || err.message);
    return res.json({ success: false, error: "Roblox publish API failed" });
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
