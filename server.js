const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const API_KEY = "PASTE_OPEN_CLOUD_KEY_HERE";
const UNIVERSE_ID = "PASTE_UNIVERSE_ID_HERE";

app.post("/publish", async (req, res) => {
    const { userId, placeId, buildData } = req.body;

    if (!userId || !placeId || !buildData) {
        return res.status(400).json({ success: false });
    }

    try {
        const response = await fetch(
            `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`,
            {
                method: "POST",
                headers: {
                    "x-api-key": API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key: `${placeId}_${userId}`,
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
