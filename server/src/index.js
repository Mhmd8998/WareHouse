require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const Auth = require("./router/Auth");
const Product = require("./router/Product");
const Withdrawl = require('./router/Withdrawl');
const Admin = require("./router/Admin");
const WeeklyReport = require('./router/WeeklyReport');


app.use(express.json())
app.use(cors({origin: "http://localhost:3000"}))

app.use("/api/auth",Auth);
app.use("/api/product",Product);
app.use("/api/withdrawl",Withdrawl);
app.use("/api/admin",Admin);
app.use('/api', WeeklyReport);

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.listen(process.env.PORT,()=>{
    console.log("start");
})
