const express = require("express");
const { login, updatePages } = require("../controllers/accountController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", login);
router.post("/update-pages", verifyToken, updatePages);

module.exports = router;
