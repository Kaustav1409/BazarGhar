const express = require("express");
const { seedDatabase } = require("../scripts/seed");

const router = express.Router();

router.post("/seed", async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: "Database seeded successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;