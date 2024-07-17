const express = require("express");
const { login, register } = require("../controllers/userController");
const validateToken = require("../middleware/validateUserToken");
const router = express.Router();
const {upload}=require('../middleware/gridFsConfig')

router.post("/login", login);
router.post("/register",upload.single("imageUrl"), register);

router.get("/current",validateToken, (req, res) => {
  res.send(req.user);
});

module.exports = router;
