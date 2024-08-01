const express = require("express");
const { addOrUpdateChat,fetchChat, fetchChats } = require("../controllers/chatController");
const validateToken = require("../middleware/validateUserToken");
const router = express.Router();


router.post("/addOrUpdateChat",validateToken, addOrUpdateChat);
router.get("/fetchChat",validateToken, fetchChat);
router.get("/fetchChats",validateToken, fetchChats);

module.exports =router;