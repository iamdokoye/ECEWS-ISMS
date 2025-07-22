const { getStudentsByUnit } = require('../models/studentModel');

const getStudentsForSupervisor = async (req, res) => {
    try {
        // Get supervisor's unit from JWT or session
        const supervisorUnit = req.user.unit; 
        
        if (!supervisorUnit) {
            return res.status(403).json({ 
                message: 'Supervisor unit not specified' 
            });
        }

        const students = await getStudentsByUnit(supervisorUnit);
        
        res.status(200).json({
            success: true,
            data: students
        });
    } catch (err) {
        console.error('Error in getStudentsForSupervisor:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch students'
        });
    }
};

module.exports = {getStudentsForSupervisor};