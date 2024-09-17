// routes/locationRoutes.js
const express = require('express');
const {
  createLocation,
  getOffSiteLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');

const router = express.Router();

// Route for creating a new location
router.post('/create', createLocation);

// Route for getting all locations
router.get('/offsite', getOffSiteLocations);

// Route for getting a location by ID
router.get('/:id', getLocationById);

// Route for updating a location
router.put('/:id', updateLocation);

// Route for deleting a location
router.delete('/:id', deleteLocation);

module.exports = router;
