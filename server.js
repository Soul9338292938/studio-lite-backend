const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("Studio Lite backend running");
});

/* ================= STORED UNIVERSE LIST =================
   ⚠️ Replace these IDs with YOUR real universe IDs
*/
const ALLOWED_GAMES = [
  {
    name: "Falling Star",
    universeId: 1234567890, // ← replace with real universeId
    placeId: 1111111111     // ← replace with real placeId
  }
];

/* ================= GET GAMES ================= */
app.get("/games", async (req, res) => {
  return res.json({
    success: true,
    games: ALLOWED_GAMES
  });
});

/* ================= PUBLISH ================= */
app.post("/publish", async (req, res) => {
  try {
    const { universeId, apiKey } = req.body;

    if (!universeId || !apiKey) {
      return res.json({ success: false, error: "Missing universeId or apiKey" });
    }

    await axios.post(
      `https://apis.roblox.com/universes/v1/${universeId}/places/versions?versionType=Published`,
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
    return res.json({ success: false, error: "Roblox publish failed" });
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
