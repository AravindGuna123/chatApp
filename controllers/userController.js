const User = require("../models/userModels");
const File = require("../models/picModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user,"user");
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
    res.status(200).json({ userInfo: user, accessToken, success: true });
  } else {
    res.status(401)
    throw new Error('Email or password is invalid')
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(password,"kkk");
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
    pic: ''
  });
  if (user) {
    res.status(201).json({ id: user._id, email: user.email, success: true });
  } else {
    res.status(400).message("User data is not valid");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { searchValue } = req.query
    const regex = new RegExp(searchValue, 'i');
    const currentUserId = req.user.id;
    const users = await User.find({ name: { $regex: regex }, _id: { $ne: currentUserId } }).populate('pic');
    const usersWithImageURL = users.map(user => {
      let imageUrl = '';
      if (user.pic) {
        imageUrl = `${req.protocol}://${req.get('host')}/api/image/${user.pic.filename}`;
      } else {
        imageUrl = 'https://avatar.iran.liara.run/public/boy?username=Ash'
      }

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: imageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    res.json({ usersList: usersWithImageURL, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  login,
  register,
  getAllUsers
};
