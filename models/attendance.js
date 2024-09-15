const attendanceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    totalWorkingHours: { type: Number, default: 0 }, 
    records: [{
      checkIn: {
        time: { type: Date, required: true },
        locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true }, // reference to the check-in location
        coordinates: {
          type: { type: String, enum: ['Point'], required: true },
          coordinates: { type: [Number], required: true }, // [longitude, latitude]
        },
      },
      checkOut: {
        time: { type: Date },
        locationId: { type: Schema.Types.ObjectId, ref: 'Location' }, // reference to the check-out location
        coordinates: {
          type: { type: String, enum: ['Point'] },
          coordinates: { type: [Number] }, // [longitude, latitude]
        },
      },
      workingHours: { type: Number, default: 0 }, // working hours for this session
    }],
  });
  
  attendanceSchema.index({ 'records.checkIn.coordinates': '2dsphere' });
  attendanceSchema.index({ 'records.checkOut.coordinates': '2dsphere' });
  
  module.exports = mongoose.model('Attendance', attendanceSchema);
  