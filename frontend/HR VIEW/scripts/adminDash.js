window.onload = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        
        // Populate dashboard stats
        document.getElementById('totalStudents').textContent = data.totalStudents;
        document.getElementById('activeStudents').textContent = data.activeStudents;
        document.getElementById('pastStudents').textContent = data.pastStudents;
        document.getElementById('supervisorCount').textContent = data.supervisorCount;
        document.getElementById('unitCount').textContent = data.unitCount;
        document.getElementById('maleCount').textContent = data.male;
        document.getElementById('femaleCount').textContent = data.female;
        
        // Populate students
        const studentList = document.getElementById('studentList');
        data.students.forEach(student => {
            const li = document.createElement('li');
            li.textContent = `${student.name} - ${student.unit} - ${student.gender}`;
            studentList.appendChild(li);
        });

        // Populate supervisors
        const supervisorList = document.getElementById('supervisorList');
        data.supervisors.forEach(supervisor => {
            const li = document.createElement('li');
            li.textContent = `${supervisor.name} - ${supervisor.unit}`;
            supervisorList.appendChild(li);
        });
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        alert('Failed to load dashboard data. Please try again later.');
    }
};

