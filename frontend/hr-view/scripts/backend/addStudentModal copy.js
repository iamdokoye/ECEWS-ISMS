document.addEventListener('DOMContentLoaded', () => {
  const unitInput = document.querySelector('#studentUnit');
  const unitDropdown = document.getElementById('unitDrop');
  const supervisorInput = document.getElementById('studentSupervisor');
  let supervisorId = null;

  const StudentId = localStorage.getItem('StudentId');

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
        });
        unitDropdown.appendChild(div);
      });
    })
    .catch(err => console.error('Failed to fetch units:', err));

  document.getElementById('unitDisplay').addEventListener('click', () => {
    unitDropdown.classList.toggle('show');
  });

  // Handle Save Button to Register Student
  document.getElementById('saveBtn').addEventListener('click', async () => {
    const name = document.getElementById('studentName').value;
    const institution = document.getElementById('studentInstitution').value;
    const level = document.getElementById('studentLevel').value;
    const course_of_study = document.getElementById('studentCourse').value;
    const duration = document.getElementById('studentDuration').value;
    const unit = document.getElementById('studentUnit').value;
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    const confirmPassword = document.getElementById('studentConfirmPassword').value;
    const interest = document.getElementById('studentInterest')?.value || 'unspecified';
    const role = 'student';
    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'unspecified';
    const startDate = document.getElementById('studentStartDate').value;
    const added_by_hr = localStorage.getItem('hrId');
    
    if (!name ) {
      alert('Please fill in all required fields');
      return;
    }
    // Calculate endDate by adding duration (months) to startDate
    let endDate = '';
    if (startDate && duration) {
      const start = new Date(startDate);
      start.setMonth(start.getMonth() + Number(duration));
      endDate = start.toISOString().split('T')[0];
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${window.API_BASE}/students/update/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          unit,
          duration,
          institution,
          level,
          interest,
          course_of_study,
          gender,
          startDate,
          endDate,
          supervisor: supervisorId,
        })
      });

      const data = await res.json();
      if (res.status === 201) {
        document.getElementById('overlay3').style.display = 'flex';
      } else {
        alert(data.message || 'Error registering student');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Server error');
    }
  });

  // Handle Success Modal Close
  document.getElementById('okayBtn').addEventListener('click', () => {
    document.getElementById('overlay3').style.display = 'none';
    location.reload();
  });
});

