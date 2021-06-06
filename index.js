const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const FileList = require("./FileList.js");

const app = express();

//-------Mongoose----------
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/posibillion", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

const jsonparser = bodyParser.json();
const buildPath = path.join(__dirname, "..", "build");
const uploadPath = path.join(__dirname, ".", "/uploads");
app.use(express.static(buildPath));
app.use("/uploads", express.static(uploadPath));

app.use(jsonparser);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.listen(process.env.PORT || "8080", (err) => {
  if(err){
    console.log("error in server")
  }
  console.log("server started on port 8080");
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
  //NOT WORKING!!!!
  fileFilter: (req, file, cb) => {
    console.log("THE file : ", file);
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      console.log("err");
    } else {
      cb(null, true);
    }
  },
});

let upload = multer({ storage: storage });

app.post(
  "/saveFile",
  upload.fields([{ name: "thumbnail" }, { name: "file" }]),
  async (req, res) => {
    const { title, year, language } = req.body;
    console.log("req body: ", req.body);
    console.log("req files: ", req.files.file[0]['path']);
    const entry = new FileList({
      title: title,
      year: year,
      language: language,
      thumbnail: req.files.thumbnail[0]['path'],
      movie: req.files.file[0]['path'],
    });
    await entry.save();
  }
);

app.post("/getFileList", async (req, res) => {
  const filelist = await FileList.find({}).skip(req.body.currentEntry).limit(6);
  console.log("body: ", req.body.currentEntry);
  // console.log("filelist: ", filelist);
  res.json({result: 'success', list: filelist, loadedEntries: req.body.currentEntry + filelist.length});
});

if(process.env.NODE_ENV === "production"){
  app.use(express.static("client-build"));
}
