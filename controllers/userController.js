const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.name,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30d" }
    );
    res.status(200).json({userInfo:user,accessToken,success:true});
  }else{
    res.status(401)
    throw new Error('Email or password is invalid')
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const {id:pic}=req.file
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    pic
  });
  if (user) {
    res.status(201).json({ id: user._id, email: user.email, success: true });
  } else {
    res.status(400).message("User data is not valid");
  }
};

module.exports = {
  login,
  register,
};
