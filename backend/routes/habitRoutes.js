const express = require("express");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================
CREATE HABIT
POST /api/habits
==================================
*/
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Habit name is required",
      });
    }

    const habit = await Habit.create({
      user: req.user.id,
      name,
    });

    res.status(201).json(habit);

  } catch (error) {
    console.error("Create Habit Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/*
==================================
GET ALL HABITS
GET /api/habits
==================================
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(habits);

  } catch (error) {
    console.error("Get Habits Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/*
==================================
TOGGLE HABIT COMPLETE
PUT /api/habits/:id
==================================
*/
router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    habit.completed = !habit.completed;

    await habit.save();

    res.status(200).json(habit);

  } catch (error) {
    console.error("Update Habit Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/*
==================================
DELETE HABIT
DELETE /api/habits/:id
==================================
*/
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const deletedHabit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedHabit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    res.status(200).json({
      message: "Habit deleted successfully",
    });

  } catch (error) {
    console.error("Delete Habit Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;