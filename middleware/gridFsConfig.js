const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");

// Create a MongoDB connection
const conn = mongoose.createConnection(process.env.CONNECTION_STRING);

// Initialize GridFS
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.CONNECTION_STRING,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "uploads",
    };
  },
});

const upload = multer({ storage });

module.exports = { upload, gfs };
