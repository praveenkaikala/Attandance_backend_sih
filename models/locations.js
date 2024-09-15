const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['office', 'offsite'], required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    longitude: { type: Number, required: true }, 
    latitude: { type: Number, required: true },
  },
});

locationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);
