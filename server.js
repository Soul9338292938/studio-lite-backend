const express = require("express")
const axios = require("axios")

const app = express()
app.use(express.json())

// Root test
app.get("/", (req, res) => {
    res.send("Studio Lite backend running")
})


// GET GAMES
app.get("/games", async (req, res) => {
    try {
        const userId = req.query.userId
        const apiKey = req.query.apiKey

        if (!userId || !apiKey) {
            return res.json({ success: false, error: "Missing userId or apiKey" })
        }

        const response = await axios.get(
            `https://apis.roblox.com/cloud/v2/users/${userId}/places`,
            {
                headers: {
                    "x-api-key": apiKey
                }
            }
        )

        res.json({
            success: true,
            games: response.data.data || []
        })

    } catch (err) {
        console.log("Games error:", err.response?.data || err.message)
        res.json({ success: false, error: "Failed to fetch games" })
    }
})


// PUBLISH PLACE
app.post("/publish", async (req, res) => {
    try {
        const { placeId, apiKey } = req.body

        if (!placeId || !apiKey) {
            return res.json({ success: false, error: "Missing placeId or apiKey" })
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
        )

        res.json({ success: true })

    } catch (err) {
        console.log("Publish error:", err.response?.data || err.message)
        res.json({ success: false, error: "Roblox publish API failed" })
    }
})


// PORT
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server running on port", PORT))
