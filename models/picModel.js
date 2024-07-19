const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    filename: String,
    contentType: String,
  }, {
    collection: 'uploads.files'
  });
  
module.exports = mongoose.model("File", fileSchema);