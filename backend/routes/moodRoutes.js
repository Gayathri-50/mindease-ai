const express = require("express");

const Mood = require("../models/Mood");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================
CREATE MOOD
POST /api/moods
==================================
*/
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { mood, note } = req.body;

    if (!mood) {
      return res.status(400).json({
        message: "Mood is required",
      });
    }

    const newMood = await Mood.create({
      user: req.user.id,
      mood,
      note,
    });

    res.status(201).json(newMood);

  } catch (error) {
    console.error("Create Mood Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/*
==================================
GET ALL MOODS
GET /api/moods
==================================
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(moods);

  } catch (error) {
    console.error("Get Moods Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/*
==================================
DELETE MOOD
DELETE /api/moods/:id
==================================
*/
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const deletedMood = await Mood.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedMood) {
      return res.status(404).json({
        message: "Mood not found",
      });
    }

    res.status(200).json({
      message: "Mood deleted successfully",
    });

  } catch (error) {
    console.error("Delete Mood Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;