var express = require('express');
var employeeJson = require("./employees.json")
var router = express.Router();
router.use(express.json());

function validateId (req,res,next){
  const id = req.params.id;
  console.log(typeof (id))
  var regExp = new RegExp("^\\d+$")
    var isValid = regExp.test(id); // or just: /^\d+$/.test(strNumber);
 console.log(isValid)
 if(isValid == false){
  return res.send("not valid id");
 }
 next();
}


// show all employees
router.get("/employees", (req, res) => {
  res.status(200).send(employeeJson.employee)
})


// show only particular employee
router.get("/employees/:id",validateId, (req, res) => {
     employeeJson.employee.filter(element => {
      if (element.id == req.params.id) {
        return res.status(200).send(element)
      }
    })
  
})



//  show particular id job
router.get("/jobs/:id", (req, res) => {
      employeeJson.dailyTask.find(element => {
    if (element.id == req.params) {
      return res.status(200).send(element)
    }
  })

})


// show all jobs
router.get("/jobs", (req, res) => {
  res.status(200).send(employeeJson.jobs)
})


// add new employee
router.post("/employees", (req, res) => {
  const newEmployess = req.body;
  newEmployess["tasks"] = [];
  console.log(newEmployess)
  employeeJson.employee.push(newEmployess);

  res.status(200).send("successfully created new employee")
})


// new job for a id
router.post("/jobs/assign", (req, res) => {
  const newJob = req.body;
  employeeJson.dailyTask.forEach(element => {
    if (element.id == req.body.id) {
      element.tasks = newJob
      return res.send("given new job to this id");
    }

  })

})

// collect the jobs and assign later
router.post("/jobs", (req, res) => {
  employeeJson.jobs.push(req.body)
  res.status(200).send("collected jobs")
})

// update profile of employee

router.put("/employees/:id", (req, res) => {
  const whatToUpdate = req.body;
  const findEmployeeToUpdate = employeeJson.employee.find(element => element.id == req.params.id)
    findEmployeeToUpdate.name = req.body.name? req.body.name : findEmployeeToUpdate.name;
 
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
module.exports = router;