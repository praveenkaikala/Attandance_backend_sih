const Location = require('../models/locations')
const Attendance=require('../models/attendance')
const checkDistance = (loc1, loc2) => {
    const [lng1, lat1] = loc1;
    const [lng2, lat2] = loc2;
    
    // Haversine formula to calculate distance between two points
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in meters

    return d;
};
const checkIn = async (req, res) => {
    try {
        const { userId, checkInTime, locationId, coordinates } = req.body;

        // Find location by ID
        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        const distance = checkDistance(location.location.coordinates, coordinates);
        if (distance > 200) {
            return res.status(400).json({ message: 'Check-in location is too far', distance });
        }

        let attendance = await Attendance.findOne({ userId });
        const currentDate = new Date(checkInTime).toISOString().split('T')[0]; 

        if (!attendance) {
            // If no previous attendance, create a new one
            attendance = new Attendance({ userId, records: [] });
        } else {
            // If last record is from a different day, create a new attendance
            const lastRecord = attendance.records[attendance.records.length - 1];
            if (lastRecord) {
                const lastCheckInDate = new Date(lastRecord.checkIn.time).toISOString().split('T')[0];
                if (lastCheckInDate !== currentDate) {
                    attendance = new Attendance({ userId, records: [] });
                }
            }
        }

        // Ensure valid check-in coordinates
        if (!coordinates || coordinates.length !== 2) {
            return res.status(400).json({ message: 'Invalid coordinates' });
        }

        // Add the new check-in record
        attendance.records.push({
            checkIn: {
                time: checkInTime,
                locationId,
                coordinates: {
                    type: 'Point',
                    coordinates // Ensure that coordinates are valid [longitude, latitude]
                }
            }
        });

        await attendance.save();

        res.status(200).json({ message: 'Checked in successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const checkOut = async (req, res) => {
    try {
        const { userId, checkOutTime, locationId, coordinates } = req.body;

        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        const attendance = await Attendance.findOne({ userId });
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        const lastRecord = attendance.records[attendance.records.length - 1];
        if (!lastRecord || lastRecord.checkOut.time) {
            return res.status(400).json({ message: 'Check-out not possible, no check-in record found' });
        }

        // Ensure check-in time is valid
        if (!lastRecord.checkIn.time) {
            return res.status(400).json({ message: 'Invalid check-in time' });
        }

        // Parse times to ensure proper calculation
        const checkInTime = new Date(lastRecord.checkIn.time);
        const validCheckOutTime = new Date(checkOutTime);

        if (isNaN(validCheckOutTime.getTime())) {
            return res.status(400).json({ message: 'Invalid check-out time' });
        }

        // Calculate working hours
        const workingHours = (validCheckOutTime - checkInTime) / 3600000; // Convert milliseconds to hours

        if (isNaN(workingHours) || workingHours < 0) {
            return res.status(400).json({ message: 'Invalid working hours calculation' });
        }

        lastRecord.checkOut = {
            time: validCheckOutTime,
            locationId,
            coordinates: {
                type: 'Point',
                coordinates
            }
        };

        lastRecord.workingHours = workingHours;
        attendance.totalWorkingHours += workingHours;

        await attendance.save();

        res.status(200).json({ message: 'Checked out successfully', workingHours });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    checkIn,
    checkOut
};