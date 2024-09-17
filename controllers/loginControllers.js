const generateToken = require('../config/createToken')
const Employee = require('../models/employee')



const loginController=async(req,res)=>{
try {
    const {email,password}=req.body
    const user=await Employee.findOne({email})
    if(!user)
    {
       return res.status(404).send({message:"user not found"})
    }
    if(user.password===password)
    {
        if(user.role==="manager")
        {

            return res.status(200).send({message:"success",user,token:generateToken(user.email)})
        }
        return res.status(403).send({message:"not allowed"})
    }
    else
    {
        return res.status(401).send({message:"invalid credentials"})
    }

} catch (error) {
    res.status(500).send({message:"internAL server error"})
    console.log(error)
}


}
const loginUserController=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await Employee.findOne({email})
        if(!user)
        {
           return res.status(404).send({message:"user not found"})
        }
        if(user.password!=password)
        {
            return res.status(401).send({message:"invalid credentials"})
        }
        if(user.role==="employee" || user.role==="admin" )
            {
    
                return res.status(200).send({message:"success",user})
            }
            return res.status(403).send({message:"not allowed"})
    
    } catch (error) {
        res.status(500).send({message:"internAL server error"})
        console.log(error)
    }
    
    
    }
module.exports = {
    loginController,
    loginUserController
  };