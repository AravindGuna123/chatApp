const express = require("express");
const cors=require('cors');
const dotenv = require("dotenv").config();
const dbConnection=require('./config/dbConnection')
dbConnection();

const NotFound=require('./middleware/errorHandler');
const checkGfsInitialized = require("./middleware/checkGfsInitialized");


const app = express();

const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/image",checkGfsInitialized,require('./routes/imageRoutes'))
app.use(NotFound)

app.listen(port,() => {
  console.log(`app is running on port ${port}`);
});

