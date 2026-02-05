const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("Studio Lite backend running");
});

/* ================================
   GET PLAYER GAMES
================================ */
app.get("/games", async (req, res) => {
  const { apiKey, userId } = req.query;

  if (!apiKey || !userId) {
    return res.status(400).json({ success: false, error: "Missing apiKey or userId" });
  }

  try {
    const response = await fetch(
      `https://apis.roblox.com/universes/v1/users/${userId}/universes`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    const data = await response.json();

    res.json({ success: true, games: data.data || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================================
   PUBLISH BUILD
================================ */
app.post("/publish", async (req, res) => {
  const { apiKey, placeId, buildData } = req.body;

  if (!apiKey || !placeId) {
    return res.status(400).json({
      success: false,
      error: "Missing apiKey or placeId",
    });
  }

  try {
    const response = await fetch(
      `https://apis.roblox.com/datastores/v1/universes/${placeId}/standard-datastores/datastore/entries/entry`,
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: `build_${placeId}`,
          value: buildData,
        }),
      }
    );

    if (!response.ok) throw new Error("Roblox API error");

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
