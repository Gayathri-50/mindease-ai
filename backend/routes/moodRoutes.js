const express = require("express");

const Mood = require("../models/Mood");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {

  try {

    const { mood, note } = req.body;

    const newMood = await Mood.create({
      user: req.user.id,
      mood,
      note,
    });

    res.status(201).json(newMood);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

router.get("/", authMiddleware, async (req, res) => {

  try {

    const moods = await Mood.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(moods);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({
        message: "Mood not found",
      });
    }

    await Mood.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Mood deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});
module.exports = router;