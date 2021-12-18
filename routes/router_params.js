const express = require ("express");
const req = require("express/lib/request");
const router = express.Router()

router.get("/",(req,res,next)=>{
    console.log("normal call");
    res.send("example");
})

router.param("id",(req,res,next,id)=>{
    console.log("this is called first and only once");
    next();
})

router.get("/users/:id", (req,res,next)=>{
    console.log("all though this is the router")
    next();
})

router.post("/users/:id", (req,res,next)=>{
    console.log("khfkhd")
    next();
})

router.get("/users/:id", (req,res)=>{
    console.log("this is the next one");
    res.send("this matches too")
})
router.post("/users/:id", (req,res,next)=>{
    console.log("324342")
    res.send("yeah")
})


module.exports = router;