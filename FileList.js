const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  movie: {
    type: String,
    required: true,
  },
});

const FileList = mongoose.model("FileList", ListSchema);
module.exports = FileList;
