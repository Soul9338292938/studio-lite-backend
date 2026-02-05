const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Studio Lite backend running");
});

/* ===============================
   GET PLAYER GAMES
================================ */
app.get("/games", async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.json({ success: false, error: "Missing userId" });
    }

    try {
        const response = await fetch(
            `https://games.roblox.com/v2/users/${userId}/games?accessFilter=2&limit=50`
        );

        const data = await response.json();

        res.json({
            success: true,
            games: data.data || []
        });

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

/* ===============================
   PUBLISH BUILD
================================ */
app.post("/publish", async (req, res) => {
    const { placeId, apiKey, buildData } = req.body;

    if (!placeId || !apiKey) {
        return res.json({ success: false, error: "Missing placeId or apiKey" });
    }

    try {
        const response = await fetch(
            `https://apis.roblox.com/universes/v1/places/${placeId}/versions?versionType=Published`,
            {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/octet-stream"
                },
                body: Buffer.from(buildData || "StudioLiteBuild")
            }
        );

        if (response.ok) {
            res.json({ success: true });
        } else {
            const text = await response.text();
            res.json({ success: false, error: text });
        }

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
