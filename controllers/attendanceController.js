const checkIn = async (req, res) => {
    try {
        const { userId, checkInTime, locationId, coordinates } = req.body;

        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        const distance = checkDistance(location.coordinates.coordinates, coordinates);
        if (distance > 200) { // Distance is greater than 200 meters
            return res.status(400).json({ message: 'Check-in location is too far' });
        }

        let attendance = await Attendance.findOne({ userId });
        
        const currentDate = new Date(checkInTime).toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)

        if (!attendance) {
            // No previous attendance, create a new one
            attendance = new Attendance({ userId, records: [] });
        } else {
            // Check if the last record is from a different day
            const lastRecord = attendance.records[attendance.records.length - 1];
            if (lastRecord) {
                const lastCheckInDate = new Date(lastRecord.checkIn.time).toISOString().split('T')[0];
                if (lastCheckInDate !== currentDate) {
                    attendance = new Attendance({ userId, records: [] });
                }
            }
        }

        // Add the new check-in record
        attendance.records.push({
            checkIn: {
                time: checkInTime,
                locationId,
                coordinates: {
                    type: 'Point',
                    coordinates
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

        const distance = checkDistance(location.coordinates.coordinates, coordinates);
        if (distance > 200) { // Distance is greater than 200 meters
            return res.status(400).json({ message: 'Check-out location is too far' });
        }

        const attendance = await Attendance.findOne({ userId });
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        const lastRecord = attendance.records[attendance.records.length - 1];
        if (!lastRecord || lastRecord.checkOut.time) {
            return res.status(400).json({ message: 'Check-out not possible, no check-in record found' });
        }

        lastRecord.checkOut = {
            time: checkOutTime,
            locationId,
            coordinates: {
                type: 'Point',
                coordinates
            }
        };

        lastRecord.workingHours = (new Date(checkOutTime) - new Date(lastRecord.checkIn.time)) / 3600000; // hours
        attendance.totalWorkingHours += lastRecord.workingHours;
        await attendance.save();

        res.status(200).json({ message: 'Checked out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
module.exports = {
    checkIn,
    checkOut
};