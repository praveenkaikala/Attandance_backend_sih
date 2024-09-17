// controllers/locationController.js
const Location = require('../models/locations');


const createLocation = async (req, res) => {
  try {
    const { name, type, longitude, latitude } = req.body;

    // Ensure latitude and longitude are numbers and valid ranges
    if (
      typeof longitude !== 'number' || typeof latitude !== 'number' ||
      longitude < -180 || longitude > 180 ||
      latitude < -90 || latitude > 90
    ) {
      return res.status(400).json({ message: 'Invalid longitude or latitude values' });
    }

    // Create new location
    const location = new Location({
      name,
      type,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    // Save location to the database
    await location.save();

    res.status(201).json({
      message: 'Location created successfully.',
      location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getOfficeLocations = async (req, res) => {
  try {
    const locations = await Location.find({type:"office"});
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getOffSiteLocations = async (req, res) => {
  try {
    const locations = await Location.find({type:"offsite"});
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const location = await Location.findByIdAndUpdate(id, updates, { new: true });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json({
      message: 'Location updated successfully.',
      location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json({
      message: 'Location deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createLocation,
  getOffSiteLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  getOfficeLocations
};
