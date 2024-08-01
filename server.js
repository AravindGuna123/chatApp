const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv").config();
const dbConnection = require('./config/dbConnection')
dbConnection();

const NotFound = require('./middleware/errorHandler');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/users", require("./routes/chatRoutes"));
app.use(NotFound)

const server = app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173"
  }
})

io.on("connection", (socket) => {
  console.log("socket connection successfull")
  socket.on("setup", (userData) => {
    socket.join(userData?._id)
    console.log(userData._id, "id");
    socket.emit("connected")

    socket.on("join room", (room) => {
      socket.join(room)
      console.log("Joined room:", room)
    })

    socket.on("new message", (newMessageReceived) => {
      var users = newMessageReceived.users
      if (!users) {
        return console.log("chat.users is not defined")
      }
      users.forEach((user) => {
        if (user._id === newMessageReceived.senderId) {
          return
        } else {
          socket.in(user._id).emit("message received", newMessageReceived)
        }
      })
    })
  })
})

