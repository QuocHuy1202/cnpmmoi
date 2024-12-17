const jwt = require("jsonwebtoken");
const { getAccountByEmail, updateRemainingPages, getAllStudents} = require("../models/accountModel");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getAccountByEmail(email);
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }

    console.log(user.number_of_pages_remaining);

    // Add account_type to the token payload
    const token = jwt.sign(
      { email: user.email, account_type: user.account_type },
      process.env.JWT_SECRET ,
      { expiresIn: "6h" }
    );

    res.status(200).json({
      token,
      status: user.status,
      number_of_pages_remaining: user.number_of_pages_remaining,
      account_type: user.account_type,
      name: user.name,
      faculty: user.Faculty
    });
    console.log(user);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error during authentication" });
  }
};
const get = async (req, res) => {
  const  email  = "user2@hcmut.edu.vn";

  try {
    const user = await getAccountByEmail(email);


    res.status(200).json({
      status: user.status,
      number_of_pages_remaining: user.number_of_pages_remaining,
      account_type: user.account_type,
      name: user.name,
      faculty: user.Faculty,
      mssv: user.MSSV
    });
    console.log(user);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error" });
  }
};

const updatePages = async (req, res) => {
  const  email  = req.user.id;
  const { number_of_pages_remaining } = req.body;

  try {
    const rowsAffected = await updateRemainingPages(email, number_of_pages_remaining);
    if (rowsAffected === 0) {
      return res.status(404).json({ message: "Account not found." });
    }
    res.status(200).json({ message: "Updated remaining pages successfully." });
  } catch (err) {
    console.error("Error updating remaining pages:", err);
    res.status(500).json({ message: "Error updating remaining pages." });
  }
};
const fetchAllStudents = async (req, res) => {
  try {
    const students = await getAllStudents();
    res.status(200).json(students);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sinh viên:", err);
    res.status(500).send("Lỗi hệ thống");
  }
};
module.exports = { login, updatePages, fetchAllStudents, get};
