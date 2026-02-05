const express = require("express")
const axios = require("axios")
const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Studio Lite backend running")
})

app.get("/games", async (req, res) => {
  try {
    const userId = req.query.userId
    const apiKey = req.headers["x-api-key"]

    if (!userId || !apiKey) {
      return res.json({ success: false, error: "Missing userId or apiKey" })
    }

    const response = await axios.get(
      `https://apis.roblox.com/universes/v1/users/${userId}/universes`,
      {
        headers: {
          "x-api-key": apiKey
        }
      }
    )

    return res.json({
      success: true,
      games: response.data.data
    })
  } catch (err) {
    return res.json({
      success: false,
      error: err.response?.data || err.message
    })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server running on port " + PORT))
