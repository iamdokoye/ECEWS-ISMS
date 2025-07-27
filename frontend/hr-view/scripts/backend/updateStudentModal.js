document.addEventListener('DOMContentLoaded', () => {
    // Get student ID from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id') || localStorage.getItem('StudentId');
    token = localStorage.getItem('token');
    if (!studentId) {
        console.error('No student ID found');
        return;
    }

    // DOM Elements
    const unitInput = document.querySelector('#studentUnit');
    const unitDropdown = document.getElementById('unitDrop');
    const supervisorInput = document.getElementById('studentSupervisor');
    let supervisorId = null;

    // First load the student's current data
    loadStudentData(studentId);

    // Load units from backend
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
                    fetchSupervisorForUnit(unit);
                });
                unitDropdown.appendChild(div);
            });
        })
        .catch(err => console.error('Failed to fetch units:', err));

    // Function to fetch supervisor for a unit
    function fetchSupervisorForUnit(unit) {
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

    // Handle Save Button to Update Student
    document.getElementById('saveBtn').addEventListener('click', async () => {
        const name = document.getElementById('studentName').value;
        const institution = document.getElementById('studentInstitution').value;
        const level = document.getElementById('studentLevel').value;
        const course_of_study = document.getElementById('studentCourse').value;
        const duration = document.getElementById('studentDuration').value;
        const unit = document.getElementById('studentUnit').value;
        const email = document.getElementById('studentEmail').value;
        const interest = document.getElementById('studentInterest')?.value || '';
        const gender = document.querySelector('input[name="gender"]:checked')?.value || '';
        const startDate = document.getElementById('studentStartDate').value;

        if (!name || !institution || !level || !course_of_study || !startDate) {
            alert('Please fill in all required fields');
            return;
        }

        // Calculate endDate
        let endDate = '';
        if (startDate && duration) {
            const start = new Date(startDate);
            start.setMonth(start.getMonth() + Number(duration));
            endDate = start.toISOString().split('T')[0];
        }

        try {
            const res = await fetch(`${window.API_BASE}/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    email,
                    unit,
                    duration,
                    institution,
                    level,
                    interest,
                    course_of_study,
                    gender,
                    startDate,
                    endDate,
                    supervisor_id: supervisorId
                })
            });

            const data = await res.json();
            if (res.ok) {
                document.getElementById('overlay3').style.display = 'flex';
            } else {
                alert(data.message || 'Error updating student');
            }
        } catch (err) {
            console.error('Update failed:', err);
            alert('Server error');
        }
    });

    // Handle Success Modal Close
    document.getElementById('okayBtn').addEventListener('click', () => {
        document.getElementById('overlay3').style.display = 'none';
        location.reload();
    });

    // Function to load student data
    async function loadStudentData(id) {
        try {
            const response = await fetch(`${window.API_BASE}/students/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch student data');

            const student = await response.json();

            // Populate form fields
            document.getElementById('studentName').value = student.name || '';
            document.getElementById('studentInstitution').value = student.institution || '';
            document.getElementById('studentLevel').value = student.level || '';
            document.getElementById('studentCourse').value = student.course_of_study || '';
            document.getElementById('studentDuration').value = student.duration || '';

            // Format and set date properly
            const startDateValue = student.startDate || student.startdate;
            if (startDateValue) {
              const date = new Date(startDateValue);
              if (!isNaN(date)) {
                const formattedDate = date.toISOString().split('T')[0];
                document.getElementById('studentStartDate').value = formattedDate;
              }
            }

            document.getElementById('studentInterest').value = student.interest || '';
            document.getElementById('studentUnit').value = student.unit || '';
            document.getElementById('studentEmail').value = student.student_email || '';

            // Set gender radio button
            if (student.gender) {
                const genderValue = student.gender.toLowerCase().trim();
                const genderRadio = document.querySelector(`input[type="radio"][name="gender"][value="${genderValue}"]`);
                if (genderRadio) {
                    genderRadio.checked = true;
                }
            }

            // Load supervisor if unit exists
            if (student.unit) {
                fetchSupervisorForUnit(student.unit);

                // Also fetch and set current supervisor if exists
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
            }

        } catch (error) {
            console.error('Error loading student data:', error);
            alert('Failed to load student data');
        }
    }
});