document.addEventListener('DOMContentLoaded', () => {
    // Get current student ID from URL or data attribute
    const urlParams = new URLSearchParams(window.location.search);
    const StudentId = urlParams.get('id') || localStorage.getItem('StudentId');
    
    // DOM Elements
    const editBioBtn = document.getElementById('editBio');
    const overlay = document.getElementById('overlay');
    const closeModalBtn = document.getElementById('closeModal');
    const saveBtn = document.getElementById('saveBtn');
    const okayBtn = document.getElementById('okayBtn');
    const unitDropdown = document.getElementById('unitDrop');
    const unitInput = document.getElementById('studentUnit');
    const supervisorInput = document.getElementById('studentSupervisor');
    let supervisorId = null;

    // Load student data when edit button is clicked
    editBioBtn.addEventListener('click', () => {
        if (!StudentId) {
            alert('No student selected');
            return;
        }
        overlay.style.display = 'flex';
        loadStudentData(StudentId);
    });

    // Close modal handler
    closeModalBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // Load units dropdown
    function loadUnits() {
        fetch(`${window.API_BASE}/students/units`)
            .then(res => res.json())
            .then(units => {
                unitDropdown.innerHTML = '';
                units.forEach(unit => {
                    const div = document.createElement('div');
                    div.classList.add('unitLIst');
                    div.textContent = unit;
                    div.addEventListener('click', () => {
                        unitInput.value = unit;
                        unitDropdown.classList.remove('show');
                        fetchSupervisor(unit);
                    });
                    unitDropdown.appendChild(div);
                });
            })
            .catch(console.error);
    }

    // Fetch supervisor for selected unit
    function fetchSupervisor(unit) {
        fetch(`${window.API_BASE}/students/supervisor/${encodeURIComponent(unit)}`)
            .then(res => res.json())
            .then(data => {
                supervisorInput.value = data.name || 'N/A';
                supervisorId = data.id;
            })
            .catch(err => {
                console.error('Failed to fetch supervisor:', err);
                supervisorInput.value = 'Not Found';
            });
    }

    // Toggle unit dropdown
    document.getElementById('unitDisplay').addEventListener('click', () => {
        unitDropdown.classList.toggle('show');
    });

    // Load student data into form
    async function loadStudentData(studentId) {
        try {
            const response = await fetch(`${window.API_BASE}/students/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch student data');
            
            const student = await response.json();
            
            // Populate form fields
            document.getElementById('studentName').value = student.name || '';
            document.getElementById('studentInstitution').value = student.institution || '';
            document.getElementById('studentLevel').value = student.level || '';
            document.getElementById('studentCourse').value = student.course_of_study || '';
            
            // Set gender radio button
            if (student.gender) {
                document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;
            }
            
            document.getElementById('studentDuration').value = student.duration || '';
            document.getElementById('studentStartDate').value = student.startDate ? student.startDate.split('T')[0] : '';
            document.getElementById('studentInterest').value = student.interest || '';
            document.getElementById('studentUnit').value = student.unit || '';
            document.getElementById('studentEmail').value = student.student_email || '';
            
            // Load units and set current unit
            loadUnits();
            
            // Fetch supervisor if exists
            if (student.supervisor_id) {
                fetch(`${window.API_BASE}/users/${student.supervisor_id}`)
                    .then(res => res.json())
                    .then(data => {
                        supervisorInput.value = data.name || 'N/A';
                        supervisorId = data.id;
                    })
                    .catch(() => {
                        supervisorInput.value = 'Not Found';
                    });
            }
            
        } catch (error) {
            console.error('Error loading student data:', error);
            alert('Failed to load student data');
        }
    }

    // Save updated student data
    saveBtn.addEventListener('click', async () => {
        if (!StudentId) {
            alert('No student selected');
            return;
        }

        // Collect form data
        const updateData = {
            name: document.getElementById('studentName').value,
            institution: document.getElementById('studentInstitution').value,
            level: document.getElementById('studentLevel').value,
            course_of_study: document.getElementById('studentCourse').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            duration: document.getElementById('studentDuration').value,
            startDate: document.getElementById('studentStartDate').value,
            interest: document.getElementById('studentInterest').value,
            unit: document.getElementById('studentUnit').value,
            supervisor_id: supervisorId
        };

        // Basic validation
        if (!updateData.name || !updateData.institution || !updateData.level || 
            !updateData.course_of_study || !updateData.startDate) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch(`${window.API_BASE}/students/update/${StudentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();
            
            if (response.ok) {
                overlay.style.display = 'none';
                document.getElementById('overlay3').style.display = 'flex';
            } else {
                throw new Error(data.message || 'Failed to update student');
            }
        } catch (error) {
            console.error('Error updating student:', error);
            alert(error.message || 'Failed to update student');
        }
    });

    // Success modal close handler
    okayBtn.addEventListener('click', () => {
        document.getElementById('overlay3').style.display = 'none';
        location.reload(); // Refresh to show updated data
    });

    // Initialize units dropdown
    loadUnits();
});