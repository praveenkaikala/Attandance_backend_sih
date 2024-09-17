const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    totalWorkingHours: { type: Number, default: 0 },
    records: [{
        checkIn: {
            time: { type: Date, required: true },
            locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true }, // reference to the check-in location
            coordinates: {
                type: { type: String, enum: ['Point'], required: true },
                coordinates: { type: [Number], required: true } // [longitude, latitude]
            }
        },
        checkOut: {
            time: { type: Date }, // reference to the check-out location
        },
        workingHours: { type: Number, default: 0 } // working hours for this session
    }]
}, {
    timeStamp: true,
});

// Index the coordinates correctly
attendanceSchema.index({ 'records.checkIn.coordinates': '2dsphere' });

module.exports = mongoose.model('Attendance', attendanceSchema);
