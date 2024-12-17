const express = require("express");
const { login, updatePages,fetchAllStudents, get} = require("../controllers/accountController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", login);
router.post("/update-pages",verifyToken(), updatePages);
router.get("/get", get);
router.get("/students", verifyToken("SPSO"), fetchAllStudents);
module.exports = router;
