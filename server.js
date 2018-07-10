var express = require("express");
var session = require("express-session");
var app = express();


var PORT = process.env.PORT || 5000;

app.set("PORT", PORT)
  .use(express.json())
  .use(express.urlencoded({
    extended: true
  }))
  .use(express.static(__dirname + "/public"))
  .use(logRequest)
  .use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
  .listen(app.get("PORT"), function () {
    console.log('Listening on port#:' + app.get("PORT"));
  });

app.post("/login", function (req, res) {
  console.log("In login");
  var username = req.body.username;
  var password = req.body.password;
  if (username === 'admin' && password === 'password') {
    req.session.user = username;
    res.json({
      success: true
    });
  } else {
    res.json({
      success: false
    });
  }
});

app.post("/logout", function (req, res) {
  console.log("Logging out:");
  var username = req.body.username;

  if (req.session.user) {
    console.log("User on session");
    req.session.user = null;
    res.json({
      success: true
    });
  } else {
    console.log("Not on session");
    res.json({
      success: false
    });
  }
});

app.get("/getServerTime", verifyLogin, function (req, res) {
  console.log("Getting server time");
  var date = new Date();
  res.json({
    success: true,
    time: date
  });
});

function logRequest(req, res, next) {
  console.log("Received a request for: " + req.url);
  next();
}

function verifyLogin(req, res, next) {
  if (req.session.user) {
    next();
  }
  else{
    res.status(401).json({message:"Unauthorized"});
  }
}