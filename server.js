const express=require('express')
const app=express()
const cors=require('cors');
const connectDB = require('./config/dbConfig');


app.use(cors())
app.use(express.json());

app.listen(5000,()=>{
    console.log("server running")
})
connectDB();