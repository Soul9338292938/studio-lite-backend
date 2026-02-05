const express = require("express")
const fs = require("fs")
const axios = require("axios")
const app = express()

app.use(express.json())

const API_KEY = process.env.ROBLOX_API_KEY
const TEMPLATE_PATH = "./TEMPLATE.rbxl"





// ================= LOAD USER GAMES =================
app.get("/games", async (req, res) => {
    const userId = req.query.userId
    if (!userId) return res.json({ success:false, error:"Missing userId" })

    try {
        const r = await axios.get(
            `https://games.roblox.com/v2/users/${userId}/games`
        )

        res.json({ success:true, games:r.data.data })
    } catch (e) {
        res.json({ success:false, error:"Failed to fetch games" })
    }
})




// ================= REAL PLACE PUBLISH =================
app.post("/publish", async (req, res) => {
    const placeId = req.body.placeId
    if (!placeId) return res.json({ success:false, error:"Missing placeId" })

    try {

        const fileBuffer = fs.readFileSync(TEMPLATE_PATH)

        const upload = await axios.post(
            `https://apis.roblox.com/universes/v1/places/${placeId}/versions`,
            fileBuffer,
            {
                headers: {
                    "x-api-key": API_KEY,
                    "Content-Type": "application/octet-stream"
                }
            }
        )

        res.json({ success:true, version:upload.data.versionNumber })

    } catch (e) {
        res.json({ success:false, error:"Publish failed" })
    }
})



app.listen(3000, () => console.log("Server running"))
