var express = require('express');
var adminJson = require("./admin.json")
var employeeJson = require("./employees.json")
var feedJson = require("./feedback.json")
var router = express.Router();
const session = require("express-session");
router.use(express.json());

router.use(session({
    secret : "starwars",
    resave : false,
    saveUninitialized : false,
    cookie : {maxAge : 400000}
}))

function validUser(req,res,next) {


}

router.route("/feedbackpage")
.get((req,res) =>{
    res.send({success : true, message : "click to summit a feedback about our company"})
})
 .post((req,res) =>{
    const obj = {}
    obj.id = req.body.userId;
    obj.feedback = req.body.feedback;
    feedJson.feedback.push({"id" : req.body.userId, "feedback" : req.body.feedback})
 feedJson.feeds.push(obj)
 })
 .put(validUser,(req,res) =>{
      const updateuser = feedJson.feedback.find(element => element.Id == req.body.id)
      updateuser.feedback = req.body.feedback;
})

module.exports = router;
