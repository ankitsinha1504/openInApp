const express = require('express');
const bodyParser = require("body-parser");
const db = require("./util/dbConnect.js");
const cookieParser = require("cookie-parser");
const loginRoute = require("./routes/login.js")
const startCron = require('./cronLogic/cronLogic.js');
const allRoutes = require("./routes/routes.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


//connect database
db.connect();

//Login
app.post("/login",loginRoute);

//routes
app.use("/",allRoutes);

//START CRON
startCron.Startcron();

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
