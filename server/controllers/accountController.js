const jwt = require("jsonwebtoken");
const { getAccountByEmail, updateRemainingPages } = require("../models/accountModel");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getAccountByEmail(email);
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }
    console.log(user.number_of_pages_remaining)
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || "jwt_secret_key", { expiresIn: "6h" });
    res.status(200).json({
      token,
      status: user.status,
      number_of_pages_remaining: user.number_of_pages_remaining,
      account_type: user.account_type,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error during authentication" });
  }
};


const updatePages = async (req, res) => {
  const { email } = req.user;
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

module.exports = { login, updatePages };
