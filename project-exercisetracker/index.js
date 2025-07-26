const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const { parse } = require("dotenv");
var counter = 1;
var allUsers = new Map();
var allExercices = new Map();
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.post("/api/users", (req, res) => {
  let createUser = { username: req.body.username, _id: counter };
  allUsers.set(counter, createUser);
  counter++;
  console.log(allUsers);
  res.json(createUser);
});
app.post("/api/users/:_id/exercises", (req, res) => {
  // Convert string ID to number to match Map keys
  let userId = parseInt(req.params._id);
  let user = allUsers.get(userId);
  if (!user) {
    return res.json({ error: "User not found" });
  }
  let exercise = [
    {
      description: req.body.description.toString(),
      duration: parseInt(req.body.duration),
      date: req.body.date
        ? new Date(req.body.date).toDateString()
        : new Date().toDateString(),
    },
  ];
  if (!allExercices.get(userId)) {
    allExercices.set(userId, exercise);
  } else {
    let arrayOfExercices = allExercices.get(userId);
    arrayOfExercices.push(exercise[0]);
    allExercices.set(userId, arrayOfExercices);
  }

  res.json({
    username: user.username,
    description: exercise[0].description,
    duration: exercise[0].duration,
    date: exercise[0].date,
    _id: userId,
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  let userId = parseInt(req.params._id);
  let getUser = allUsers.get(userId);
  if (!getUser) {
    return res.json({ error: "User not found" });
  }

  let arrayWithExercices = allExercices.get(userId) || [];

  let { from, to, limit } = req.query;

  // Debug
  console.log({
    from: from,
    to: to,
    limit: limit,
  });

  let fromDate = from ? new Date(from) : null;

  let toDate = to ? new Date(to) : null;

  if (fromDate instanceof Date && isNaN(fromDate)) {
    return res.json({ error: "Invalid from date" });
  }

  if (toDate instanceof Date && isNaN(toDate)) {
    return res.json({ error: "Invalid to date" });
  }

  let filteredExercises = arrayWithExercices.filter((exercise) => {
    let exerciseDate = new Date(exercise.date);
    if (!fromDate) {
      return true;
    }
    if (!toDate) {
      return exerciseDate >= fromDate;
    }
    return exerciseDate >= fromDate && exerciseDate <= toDate;
  });

  if (limit) {
    let limitValue = parseInt(limit);
    if (isNaN(limitValue) || limitValue <= 0) {
      return res.json({ error: "Invalid limit value" });
    }
    filteredExercises = filteredExercises.slice(0, limitValue);
  }
  console.log("Exercices");
  console.log(allExercices.get(userId));
  console.log("------");
  console.log(filteredExercises);
  res.json({
    username: getUser.username,
    count: filteredExercises.length,
    _id: userId,
    log: filteredExercises,
  });
});

app.get("/api/users", (req, res) => {
  const usersArray = [];
  for (let [key, value] of allUsers) {
    usersArray.push({ username: value.username, _id: value._id.toString() });
  }
  res.json(usersArray);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
