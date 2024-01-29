const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const server = require("http").createServer(app);
const crypto = require("crypto");
const fs = require("fs");
const session = require("express-session");
const utils = require("./utils");
const logger = require("./logger");
const db = require("./database");

CTF_TITLE = process.env.CTF_TITLE || "TitleCTF";
CTFd_TOKEN = process.env.CTFd_TOKEN || "TOKEN";
start_date = process.env.start_date || "2000-01-01 00:00:00";
finish_date = process.env.finish_date || "2000-01-02 00:00:00";
PORT = process.env.PORT || 5000;
DOMAIN = process.env.DOMAIN || "localhost";

var random_token = crypto.randomBytes(128).toString("hex");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(session({
    name: "token",
    secret: random_token,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 3, // 3 hours
    },
  }),
);

const socket = require("socket.io")(server, {
  cors: {
    origin: DOMAIN + ":" + PORT,
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});

db.init();

const watch = function () {
  fs.watch("./activity.log", function (event, filename) {
    // file modified so emit the changes to logs page
    fs.readFile("./activity.log", "utf8", function (err, data) {
      // Display the file content
      socket.emit("logs", data);
    });
  });
};

socket.on("connection", (socket) => {
  console.log("Connected via socket:" + socket.id.toString());
  logger.info("Connected via socket:" + socket.id.toString());

  try {
    let solves = JSON.parse(db.get_solves());
    socket.emit("activity", solves);
    logger.info("200 OK! => Rendered full solves");

    let score = JSON.parse(db.get_scoreboard());
    socket.emit("update", score);
    logger.info("200 OK! => Render full scoreboard");

    watch();
  } catch (e) {
    logger.error("NOT OK! => " + e.toString());
  }
});

app.post("/api/scoreboard", utils.auth, (req, res) => {
  try {
    score = JSON.parse(JSON.stringify(req.body));
    db.update_scoreboard(score);

    let s = JSON.parse(db.get_scoreboard());
    socket.emit("update", s);

    res.json({
        success: true,
        message: "OK! Scoreboard saved!",
      }).status(200);
  } catch (e) {
    logger.error("NOT OK! => " + e.toString());
    res.status(500).json({
      success: false,
      message: "Something went wrong..",
    });
  }
});

app.post("/api/solve", utils.auth, (req, res) => {
  try {
    data = JSON.parse(JSON.stringify(req.body));
    if (data.length !== 1) {
      res.status(500).json({
        success: false,
        message: "Cant send more than one solve at a time",
      });
    }

    socket.emit("activity", data);
    logger.info("200 OK! => Render new activity!");

    db.add_solve(data);
    // check if its a first blood
    // if yes trigger animation
    if (data[0]["first_blood"]) {
      db.addblood(data[0]["team"]);
      socket.emit("first_blood", data);
      logger.info("200 OK! => Render first blood animation");
    }
    res.json({
        success: true,
        message:
          "OK! Solve saved! firstblood status: " + data[0]["first_blood"],
      }).status(200);
  } catch (e) {
    logger.error("NOT OK! => " + e.toString());
    res.status(500).json({
      success: false,
      message: "Something went wrong..",
    });
  }
});

app.get("/activity", (req, res) => {
  res.render("activity", {
    title: CTF_TITLE,
    start: start_date,
    finish: finish_date,
  });
});

app.get("/dashboard", utils.admin_auth, (req, res) => {
  res.render("./dashboard/dashboard", {
    title: CTF_TITLE,
  });
});

app.get("/dashboard/login", (req, res) => {
  if (req.session.admin){
    res.redirect("/dashboard")
  }
  res.render("./dashboard/login", {
    title: CTF_TITLE,
    status: "",
  });
});

app.post("/dashboard/login", (req, res) => {
  try {
    login_token = req.body.login_token;
    let login = db.login(login_token);
    if (login) {
      req.session.admin = true;
      res.json({
        success: true,
        message: "Login successful",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (e) {
    logger.error("NOT OK! => " + e.toString());
  }
});

app.get("/dashboard/logs", utils.admin_auth, (req, res) => {
  watch();
  res.render("./dashboard/logs", {
    title: CTF_TITLE,
  });
});

app.get("/dashboard/settings", utils.admin_auth, (req, res) => {
  res.render("./dashboard/settings", {
    title: CTF_TITLE,
  });
});

app.get("/", (req, res) => {
  res.render("index", {
    title: CTF_TITLE,
    start: start_date,
    finish: finish_date,
  });
});

// error handler
app.use((e, req, res, next) => {
  res.status(e.status || 500).json({
    success: true,
    message: "Something went wrong...",
  });
  logger.error("NOT OK! => " + e.toString()); 
});

server.listen(PORT,"0.0.0.0", function () {
  console.log("RUNNING: http://0.0.0.0:%s", PORT);
  logger.info(`Server listening on: http://0.0.0.0:${PORT}`);
});