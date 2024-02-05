const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req,res) => {
    try{
        console.log("YES!");
        const id = req.body.id;
        const token = jwt.sign({id : id},process.env.MY_SECRET, {expiresIn: "1h"});

    res.cookie("token",token,{
        httpOnly: true
    });
    return res.send("Logged in !" + "token is " + token);
    }
    catch(err){
        console.log(err);
    }
}