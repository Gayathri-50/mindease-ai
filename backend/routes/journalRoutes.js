const express = require("express");
const Journal = require("../models/Journal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================
CREATE JOURNAL
POST /api/journals
==================================
*/
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const journal = await Journal.create({
      user: req.user.id,
      title,
      content,
    });

    res.status(201).json(journal);

  } catch (error) {
    console.error("Create Journal Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/*
==================================
GET ALL JOURNALS
GET /api/journals
==================================
*/
router.get("/", authMiddleware, async (req, res) => {
  try {

    const journals = await Journal.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(journals);

  } catch (error) {
    console.error("Get Journals Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/*
==================================
DELETE JOURNAL
DELETE /api/journals/:id
==================================
*/
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const deletedJournal = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedJournal) {
      return res.status(404).json({
        message: "Journal not found",
      });
    }

    res.status(200).json({
      message: "Journal deleted successfully",
    });

  } catch (error) {
    console.error("Delete Journal Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;