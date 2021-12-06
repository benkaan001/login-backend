const express = require("express");

const app = express();

// set the viewengine to ejs
app.set("view-engine", "ejs");

app.get("/", (req, res) => {
  res.render("main.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🌍------Server is listening on port ${port}------🌍`);
});
