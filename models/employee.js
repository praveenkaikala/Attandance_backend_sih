const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  photo:{type:String,default:null,required:false},//
  phone:{type:String,required:true},
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  officeLocationId: { type: Schema.Types.ObjectId, ref: 'Location', required: false }, 
  isActive: { type: Boolean, default: true },
  managerId: { type: Schema.Types.ObjectId, ref: 'Employee', required: false },
  password:{type:String,required:true} 
},
{
    timeStamp:true,
});

module.exports = mongoose.model('Employee', employeeSchema);