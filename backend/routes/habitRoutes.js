const express = require("express");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
  CREATE HABIT
  POST /api/habits
*/
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    const habit = await Habit.create({
      user: req.user.id,
      name,
    });

    res.status(201).json(habit);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

/*
  GET ALL HABITS
  GET /api/habits
*/
router.get("/", authMiddleware, async (req, res) => {
  try {

    const habits = await Habit.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(habits);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

/*
  TOGGLE HABIT COMPLETE
  PUT /api/habits/:id
*/
router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    habit.completed = !habit.completed;

    await habit.save();

    res.status(200).json(habit);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

/*
  DELETE HABIT
  DELETE /api/habits/:id
*/
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    await Habit.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Habit deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

module.exports = router;