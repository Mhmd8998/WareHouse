require("dotenv").config();
const express = require("express");
const app = express();


const Auth = require("./router/Auth");
const Product = require("./router/Product");
const Withdrawl = require('./router/Withdrawl');

app.use(express.json())

app.use("/api/auth",Auth);
app.use("/api/product",Product);
app.use("/api/withdrawl",Withdrawl);

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.listen(process.env.PORT,()=>{
    console.log("start");
})