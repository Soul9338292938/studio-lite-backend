const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("Studio Lite backend running");
});


/* ===============================
   GET USER UNIVERSes
   URL: /games?key=API_KEY&userId=USER_ID
================================ */
app.get("/games", async (req, res) => {
  try {
    const { key, userId } = req.query;

    if (!key || !userId) {
      return res.json({ success: false, error: "Missing key or userId" });
    }

    const response = await fetch(
      `https://apis.roblox.com/universes/v1/users/${userId}/universes`,
      {
        method: "GET",
        headers: {
          "x-api-key": key,
        },
      }
    );

    if (!response.ok) {
      return res.json({ success: false, error: "Invalid API key" });
    }

    const data = await response.json();

    return res.json({
      success: true,
      data: data.data || [],
    });

  } catch (err) {
    return res.json({ success: false, error: err.message });
  }
});


/* ===============================
   PUBLISH PLACE
   URL: POST /publish
   BODY: { key, placeId }
================================ */
app.post("/publish", async (req, res) => {
  try {
    const { key, placeId } = req.body;

    if (!key || !placeId) {
      return res.json({ success: false, error: "Missing key or placeId" });
    }

    const response = await fetch(
      `https://apis.roblox.com/universes/v1/places/${placeId}/versions?versionType=Published`,
      {
        method: "POST",
        headers: {
          "x-api-key": key,
          "Content-Type": "application/json",
        },
        body: "{}",
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.json({ success: false, error: text });
    }

    return res.json({ success: true });

  } catch (err) {
    return res.json({ success: false, error: err.message });
  }
});


app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
