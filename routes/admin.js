var express = require('express');
var adminJson = require("./admin.json")
var employeeJson = require("./employees.json")
// var router = express.Router();
var router = require('./router')
const session = require("express-session");
router.use(express.json());


router.use((req,res,next)=>{
  console.log("middleaware2")
  next();
})

router.use((req,res,next)=>{
  console.log("middleaware1")
  next();
})

router.use(session({
  secret: "admin secret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 300000 }
}))

// admin login

router.post("/login",(req,res,next)=>{
try {

  const adminLog  = adminJson.admins.find(element => element.email == req.body.email && element.password == req.body.password)
  console.log(adminLog)
  if(adminLog){

    const  session = req.session;
            session.adminid = adminLog.aid
            // console.log(session);
            // console.log(adminLog.id)
            return res.send({success : true, message : "logged in successful", data: req.sessionID})
  }
  throw new Error ("error");
}
 catch (error) {
   next(error)
  
}
 
  
})



function validateId(req, res, next) {
  const id = req.params.id;
  console.log(typeof (id))
  var regExp = new RegExp("^\\d+$")
  var isValid = regExp.test(id); // or just: /^\d+$/.test(strNumber);
  console.log(isValid)
  if (isValid == false) {
    return res.send({success : false, message : "not valid id"});
  }
  next();
}


// show all employees
router.get("c", (req, res) => {
  res.status(200).send(employeeJson.employee)
})


// show only particular employee
router.get("/employees/:id", validateId, (req, res) => {
  employeeJson.employee.filter(element => {
    if (element.id == req.params.id) {
      return res.status(200).send({success : true, message : "employee details retrived successfully", data: element})
    }
  })

})

//  show particular id job
router.get("/jobs/:id", (req, res) => {
  employeeJson.employee.find(element => {
    if (element.id == req.params) {
      return res.status(200).send({success : true, message : "showing information of a job ", data: element.tasks})
    }
  })

})



// show all jobs
router.get("/jobs", (req, res) => {
  const queryObject = req.query;
  console.log(queryObject, "jhjiu")
  if (queryObject.status) {
    const filteredJobs = employeeJson.jobs.filter(element => element.status == queryObject.status)
    return res.send(filteredJobs)
  }
  return res.status(200).send(employeeJson.jobs)

})
// "id": "1001",
//             "name": "nomi",
//             "address": "3,plantoon greens,barcelona",
//             "email": "nomi@email.com",
//             "password": "nomi@123",
//             "designation": "gamer analyst",

function validateForm(req, res, next) {
  const wrongFeilds = [];
  if (/^[a-zA-Z ]*$/.test(req.body.name) == false) {
    wrongFeilds.push(req.body.name)
  }
  if (/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(req.body.address) == false) {
    wrongFeilds.push(req.body.address)
  }
  if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email) == false) {
    wrongFeilds.push(req.body.address)
  }
  if (wrongFeilds.length >= 0) {
    return res.send(wrongFeilds)
  }
  console.log(wrongFeilds)
  next()
}

// add new employee
router.post("/employees", validateForm, (req, res) => {
  const newEmployess = req.body;
  newEmployess["tasks"] = [];
  console.log(newEmployess)
  employeeJson.employee.push(newEmployess);

  res.status(200).send({success : true, message : "successfully created new employee"})
})


// new job for a id
router.post("/jobs/assign", (req, res) => {
  const newJob = req.body;
  employeeJson.dailyTask.forEach(element => {
    if (element.id == req.body.id) {
      element.tasks = newJob
      return res.send({success : true, message : "given new job to this id"});
    }

  })

})

// collect the jobs and assign later
router.post("/jobs", (req, res) => {
  employeeJson.jobs.push(req.body)
  res.status(200).send({success : true, message : "collected jobs"})
})

// update profile of employee

router.put("/employees/:id", (req, res) => {
  const whatToUpdate = req.body;
  const findEmployeeToUpdate = employeeJson.employee.find(element => element.id == req.params.id)
  findEmployeeToUpdate.name = req.body.name ? req.body.name : findEmployeeToUpdate.name;

  if (req.body.address) {

    findEmployeeToUpdate.address = req.body.address
  }
  if (req.body.designation) {

    findEmployeeToUpdate.designation = req.body.designation
  }
})

// update more jobs for id 

router.put("/employees/jobs/:id", (req, res) => {
  const findEmployee = employeeJson.employee.find(element => element.id == req.params.id)
  const newJob = employeeJson.jobs.find(element => element.id == req.body.id)
  console.log(newJob)
  console.log(findEmployee.tasks.push(newJob));
  res.send("added another job successfully");
})

// middleware for error 

router.use(function(err, req, res, next) {
  console.log(err)
  res.status(500);
  res.send(err.toString())
});


module.exports = router;