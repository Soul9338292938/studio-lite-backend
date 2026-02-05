const express = require("express")
const axios = require("axios")

const app = express()
app.use(express.json())

// Root test
app.get("/", (req, res) => {
    res.send("Studio Lite backend running")
})

/*
==============================
GET USER GAMES
==============================
Body:
{
  userId,
  apiKey
}
*/
app.post("/games", async (req, res) => {
    const { userId, apiKey } = req.body

    if (!userId || !apiKey) {
        return res.json({ success: false, error: "Missing userId or apiKey" })
    }

    try {
        const response = await axios.get(
            `https://develop.roblox.com/v1/universes?creatorTargetId=${userId}&creatorType=User`,
            {
                headers: { "x-api-key": apiKey }
            }
        )

        return res.json({
            success: true,
            games: response.data.data.map(g => ({
                name: g.name,
                placeId: g.rootPlace.id,
                universeId: g.id
            }))
        })

    } catch (err) {
        return res.json({ success: false, error: "Failed to load games" })
    }
})

/*
==============================
PUBLISH GAME
==============================
Body:
{
  universeId,
  apiKey
}
*/
app.post("/publish", async (req, res) => {
    const { universeId, apiKey } = req.body

    if (!universeId || !apiKey) {
        return res.json({ success: false, error: "Missing data" })
    }

    try {
        await axios.post(
            `https://develop.roblox.com/v1/universes/${universeId}/publish`,
            {},
            {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json"
                }
            }
        )

        return res.json({ success: true })

    } catch (err) {
        return res.json({
            success: false,
            error: "Roblox publish API failed"
        })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server running on port " + PORT))
