// models/Location.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['office', 'offsite'], required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true }, // GeoJSON type
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
},
{
    timeStamp:true,
});

// Apply 2dsphere index on the coordinates field
locationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);
