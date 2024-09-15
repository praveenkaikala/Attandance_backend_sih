// controllers/locationController.js
const Location = require('../models/locations');


const createLocation = async (req, res) => {
  try {
    const { name, type, longitude, latitude } = req.body;
    const location = new Location({
        name,
        type,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude], 
        },
      });
    await location.save();

    res.status(201).json({
      message: 'Location created successfully.',
      location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
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
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
};
