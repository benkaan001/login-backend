if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const {
  checkIfAuthenticated,
  checkIfNotAuthenticated,
} = require("./middleware/authentication");

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const app = express();

const port = process.env.PORT || 5000;

app.set("view-engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

const users = [];

app.get("/", checkIfAuthenticated, (req, res) => {
  res.render("main.ejs", { name: req.user.name });
});

app.get("/login", checkIfNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkIfNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/signup", checkIfNotAuthenticated, (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", checkIfNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/signup");
  }
  console.log(users);
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});
app.listen(port, () => {
  console.log(`🌍------Server is listening on port ${port}------🌍`);
});
