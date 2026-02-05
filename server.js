const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Studio Lite backend running");
});


// 🔹 GET GAMES
app.get("/games", async (req, res) => {
    const { userId, apiKey } = req.query;

    if (!userId || !apiKey) {
        return res.json({ success: false, error: "Missing userId or apiKey" });
    }

    try {
        const response = await axios.get(
            `https://games.roblox.com/v2/users/${userId}/games`,
            {
                headers: {
                    "x-api-key": apiKey
                }
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


// 🔹 PUBLISH GAME (REAL FIX)
app.post("/publish", async (req, res) => {
    const { userId, placeId, apiKey } = req.body;

    if (!userId || !placeId || !apiKey) {
        return res.json({ success: false, error: "Missing data" });
    }

    try {
        await axios.post(
            `https://develop.roblox.com/v1/universes/${placeId}/publish`,
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
        return res.json({
            success: false,
            error: "Roblox publish API failed"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
