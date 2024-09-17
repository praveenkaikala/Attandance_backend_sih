const express=require('express')
const app=express()
const cors=require('cors');
const connectDB = require('./config/dbConfig');
const fileUpload = require('express-fileupload');
const employeeRoutes = require('./routes/employeeRoutes');
const locationRoutes = require('./routes/locationRoutes');
const loginRoutes=require('./routes/loginRoutes')
app.use(cors())
app.use(express.json());
app.use(fileUpload());
app.listen(5000,()=>{
    console.log("server running")
})
app.use(express.static('public'))
app.use('/api/employee', employeeRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/login',loginRoutes)
connectDB();