/**
 * Studio-Lite Publish Backend
 * Compatible with Roblox Open Cloud (2026)
 * Works on Node 18+ (Render, Railway, etc.)
 */

const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;


/* =========================================================
   HEALTH CHECK
   ========================================================= */
app.get("/", (_req, res) => {
  res.send("Studio-Lite backend running");
});


/* =========================================================
   PUBLISH PLACE VERSION
   Endpoint used by your Roblox ServerScript
   POST /publish
   Body: { key: string, placeId: number|string }
   ========================================================= */
app.post("/publish", async (req, res) => {
  try {
    const { key, placeId } = req.body || {};

    /* ---------- VALIDATION ---------- */
    if (!key || typeof key !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid API key",
      });
    }

    if (!placeId) {
      return res.status(400).json({
        success: false,
        error: "Missing placeId",
      });
    }

    const numericPlaceId = Number(placeId);

    if (!Number.isFinite(numericPlaceId)) {
      return res.status(400).json({
        success: false,
        error: "placeId must be a number",
      });
    }

    /* ---------- ROBLOX OPEN CLOUD CALL ---------- */
    const robloxResponse = await fetch(
      `https://apis.roblox.com/universes/v1/places/${numericPlaceId}/versions?versionType=Published`,
      {
        method: "POST",
        headers: {
          "x-api-key": key,
          "Content-Type": "application/json",
        },
        body: "{}",
      }
    );

    /* ---------- HANDLE ROBLOX ERROR ---------- */
    if (!robloxResponse.ok) {
      const errorText = await robloxResponse.text();

      return res.status(400).json({
        success: false,
        error: errorText || "Roblox publish failed",
        status: robloxResponse.status,
      });
    }

    /* ---------- SUCCESS ---------- */
    return res.json({
      success: true,
      message: "Publish successful",
    });

  } catch (err) {
    /* ---------- SERVER FAILURE ---------- */
    console.error("Publish error:", err);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});


/* =========================================================
   404 FALLBACK
   Prevents confusing “Cannot GET /something”
   ========================================================= */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});


/* =========================================================
   START SERVER
   ========================================================= */
app.listen(PORT, () => {
  console.log(`Studio-Lite backend listening on port ${PORT}`);
})
