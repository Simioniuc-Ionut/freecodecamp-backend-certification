var express = require("express");
var cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const bodyParser = require("body-parser");

var app = express();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File not found" });
  }
  // const { originalname, mimetype, size } = req.file;

  // res.json({
  //   name: originalname,
  //   type: mimetype,
  //   size: size,
  // });
  const {
    originalname: fileName,
    mimetype: fileType,
    size: fileSize,
  } = req.file;

  res.json({
    name: fileName,
    type: fileType,
    size: fileSize,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
