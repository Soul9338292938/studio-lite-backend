const express = require("express");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

/* ===============================
   GET USER ID FROM API KEY
================================ */
async function getUserIdFromKey(apiKey) {
    const res = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
        headers: {
            "x-api-key": apiKey
        }
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.sub; // userId
}

/* ===============================
   GET USER GAMES
================================ */
app.get("/games", async (req, res) => {
    try {
        const apiKey = req.query.apiKey;
        if (!apiKey) {
            return res.json({ success: false, error: "Missing apiKey" });
        }

        const userId = await getUserIdFromKey(apiKey);
        if (!userId) {
            return res.json({ success: false, error: "Invalid API key" });
        }

        const gamesRes = await fetch(
            `https://develop.roblox.com/v2/users/${userId}/experiences`,
            { headers: { "x-api-key": apiKey } }
        );

        const gamesData = await gamesRes.json();

        return res.json({
            success: true,
            games: gamesData.data || []
        });

    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

/* ===============================
   PUBLISH PLACE
================================ */
app.get("/publish", async (req, res) => {
    return res.json({ success: true, message: "Publish endpoint ready" });
});

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
