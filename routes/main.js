const express = require("express");
const para = require("./router_params")
const appp = express();
const http = require("http")
console.log(http)
appp.use("/check", para);

appp.listen(3000, ()=>{
    console.log("running . . . .")
})