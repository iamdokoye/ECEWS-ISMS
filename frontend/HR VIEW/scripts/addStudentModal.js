// scripts/addStudent.js

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('addStudentModal');
  const toggleBtn = document.getElementById('toggleAddStudentModal');
  const form = document.getElementById('addStudentForm');
  const unitSelect = document.getElementById('studentUnit');
  const supervisorField = document.getElementById('studentSupervisor');
  const supervisorIdField = document.getElementById('studentSupervisorId');

  // Show/Hide Modal
  toggleBtn.addEventListener('click', () => {
    modal.classList.toggle('hidden');
  });

  window.closeModal = function () {
    modal.classList.add('hidden');
  };

  // Autofill Supervisor Based on Unit
  unitSelect.addEventListener('change', async () => {
    const selectedUnit = unitSelect.value;
    try {
      const response = await fetch(`http://localhost:5000/api/supervisor-by-unit/${selectedUnit}`);
      if (!response.ok) throw new Error('Supervisor not found');
      const data = await response.json();
      supervisorField.value = data.name;
      supervisorIdField.value = data.id;
    } catch (err) {
      supervisorField.value = 'Not found';
      supervisorIdField.value = '';
      console.error(err);
    }
  });

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById('studentName').value,
      institution: document.getElementById('studentInstitution').value,
      level: document.getElementById('studentLevel').value,
      course: document.getElementById('studentCourse').value,
      duration: document.getElementById('studentDuration').value,
      unit: unitSelect.value,
      supervisorId: supervisorIdField.value,
      gender: document.getElementById('studentGender').value,
      email: document.getElementById('studentEmail').value,
      password: document.getElementById('studentPassword').value,
      confirmPassword: document.getElementById('studentConfirmPassword').value,
      role: 'student'
    };

    if (payload.password !== payload.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Student registered successfully');
        closeModal();
        form.reset();
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during registration');
    }
  });
});
