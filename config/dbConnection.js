const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(connect.connection.host, connect.connection.name,"llll");
    return connect
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnection;
