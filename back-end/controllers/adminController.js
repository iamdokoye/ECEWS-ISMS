const Student = require('../models/Student');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        res.json({message: 'API WORKING!'});
        // Fetching dashboard statistics
        const totalStudents = await Student.countDocuments();
        const activeStudents = await Student.countDocuments({it_status: 'Active'});
        const pastStudents = await Student.countDocuments({it_status: 'Past'});

        const supervisors = await User.find({role: 'Supervisor'});
        const supervisorCount = supervisors.length;

        const units = await User.distinct('unit');
        const unitCount = units.length;

        const allStudentRecords = await Student.find().populate('user');
        const students = allStudentRecords.map(s => ({
            name: s.user.name,
            unit: s.user.unit,
            gender: s.user.gender
        }));

        const male = students.filter(s => s.gender === 'Male').length;
        const female = students.filter(s => s.gender === 'Female').length;

        res.json({
            totalStudents,
            activeStudents,
            pastStudents,
            supervisorCount,
            unitCount,
            male,
            female,
            students,
            supervisors
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};