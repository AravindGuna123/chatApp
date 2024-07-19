const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");

const conn = mongoose.createConnection(process.env.CONNECTION_STRING);

let gfs, gridfsBucket;
const initializeGridFS = new Promise((resolve, reject) => {
  conn.once("open", () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    resolve();
  });

  conn.on("error", (error) => {
    reject(error);
  });
});

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

const getGfs = async () => {
  await initializeGridFS;
  return gfs;
};

const getGridfsBucket = async () => {
  if (!gridfsBucket) {
    await new Promise((resolve) => conn.once('open', resolve));
  }
  return gridfsBucket;
};

module.exports = { upload, getGfs, getGridfsBucket };
