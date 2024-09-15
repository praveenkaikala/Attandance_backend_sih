const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  photo:{type:String,default:null},
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  officeLocationId: { type: Schema.Types.ObjectId, ref: 'Location', required: false }, // reference to office location
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Employee', employeeSchema);