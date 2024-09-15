const express=require('express')
const app=express()
const cors=require('cors');
const connectDB = require('./config/dbConfig');
const fileUpload = require('express-fileupload');
const employeeRoutes = require('./routes/employeeRoutes');
const locationRoutes = require('./routes/locationRoutes');
app.use(cors())
app.use(express.json());
app.use(fileUpload());
app.listen(5000,()=>{
    console.log("server running")
})
app.use('/v1/api/employees', employeeRoutes);
app.use('/api/locations', locationRoutes);
connectDB();