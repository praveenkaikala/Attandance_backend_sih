// routes/locationRoutes.js
const express = require('express');
const {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');

const router = express.Router();

// Route for creating a new location
router.post('/create', createLocation);

// Route for getting all locations
router.get('/', getAllLocations);

// Route for getting a location by ID
router.get('/:id', getLocationById);

// Route for updating a location
router.put('/:id', updateLocation);

// Route for deleting a location
router.delete('/:id', deleteLocation);

module.exports = router;
