const express = require("express");
const session = require("express-session");
const empJson = require("./employees.json")
var router = require('./router')
router.use(express.json());

router.use(session({
    secret : "it's a secret",
    resave : false,
    saveUninitialized : false,
    cookie: { maxAge: 3000000 }
}
))

router.use((req,res,next)=>{
    console.log("middleaware")
    next();
})

// login
router.post("/login",(req,res,next) => {
    
    const email = req.body.email;
    const password = req.body.password;
try {
    const currentUser = empJson.employee.find(element => element.email == email && element.password == password)
    if(currentUser){
        
           const  session = req.session;
            session.userid = currentUser.id
            console.log(session)
        return res.send({success : true, message : "logged in successful", data: req.sessionID})

      
    }
    throw new Error ("no such user!")
    
} catch (err) {
    console.log(err)
    // return res.status(400).send("give correct email and password")
    next(err)
}

})

router.use((req,res,next)=>{
    if(req.session.userid){
        next();
        }
        else{
            return res.send({message : "please login again" })
        }
})



// show details 

router.get("/home", (req,res)=>{
  if(req.session.userid){
     const emp = empJson.employee.find(element => element.id == req.session.userid)
     return res.send({success : true, message : "logged in successful", data: emp})
  }
})




// update status
router.put("/employee/status", (req,res) =>{
    const updateWhichTask = req.body.job;
    if(req.session.userid){
        const empStatus = empJson.employee.find(element => element.id == req.session.userid)
     const findTask = empStatus.tasks.find(element => element.jid == req.body.job)
        findTask["status"] = req.body.status;
        const findJob = empJson.jobs.find(element => element.jid == req.body.job)
        findJob.status = req.body.status;
        console.log(empJson.jobs)
     console.log(empStatus)
     return res.send({success : true, message : "status updated!", data: req.sessionID})
    }
  return res.send("session ended, please login again!")
})

// logout
router.delete("/logout", (req,res) =>{
    // delete sessionid 
   req.session.destroy();
   res.send({success : true, message : "login or sign up", data: req.sessionID});

})



router.use(function(err, req, res, next) {
    console.log(err)
    res.status(500);
    res.send(err)
 });

module.exports = router;