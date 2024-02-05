require("dotenv").config();
const jwt = require("jsonwebtoken");

function cookieJwt (req,res,next) {
    const token = req.cookies.token;
    try {
        const id = jwt.verify(token,process.env.MY_SECRET);
        req.userId = id;
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.send("Login Again !");
    }
}

module.exports = cookieJwt;