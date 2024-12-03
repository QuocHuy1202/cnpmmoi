const express = require("express");
const { files, uploadFile } = require("../controllers/fileController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/", verifyToken, files);


module.exports = router;


