const express = require("express");
const { login, register, getAllUsers } = require("../controllers/userController");
const validateToken = require("../middleware/validateUserToken");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getAllUsers",validateToken, getAllUsers);

router.get("/current", validateToken, (req, res) => {
  res.send(req.user);
});

module.exports = router;
