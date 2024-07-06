const express = require("express");

const dotenv = require("dotenv").config();
const dbConnection=require('./config/dbConnection')
const NotFound=require('./middleware/errorHandler')

const app = express();
dbConnection();

const port = process.env.PORT || 5000;

app.use(express.json())

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(NotFound)

app.listen(port,() => {
  console.log(`app is running on port ${port}`);
});
