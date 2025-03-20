const express = require("express");
const router = express.Router();
const Chapter = require("../models/Chapter");

// Lấy nội dung chương theo ID
router.get("/:chapterId", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId).populate("bookId");

    if (!chapter) {
      return res.status(404).json({ message: "Không tìm thấy chương." });
    }

    // Tìm chương trước và chương sau dựa vào `order`
    const prevChapter = await Chapter.findOne({ bookId: chapter.bookId, order: chapter.order - 1 });
    const nextChapter = await Chapter.findOne({ bookId: chapter.bookId, order: chapter.order + 1 });

    res.json({
      success: true,
      data: {
        chapter,
        book: chapter.bookId,
        navigation: {
          prev: prevChapter ? prevChapter._id : null,
          next: nextChapter ? nextChapter._id : null,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error });
  }
});

module.exports = router;
