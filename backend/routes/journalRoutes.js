const express = require("express");
const Journal = require("../models/Journal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const journal = await Journal.create({
      user: req.user.id,
      title,
      content,
    });

    res.status(201).json(journal);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {

    const journals = await Journal.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(journals);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    await Journal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Journal deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

module.exports = router;