// Function to update student information
async function updateStudentInfo(studentId, updateData) {
  try {
    const response = await fetch(`${window.API_BASE}/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to update student');
    }
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

// Function to fetch student details
async function getStudentDetails(studentId) {
  try {
    const response = await fetch(`${window.API_BASE}/students/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch student details');
    }
  } catch (error) {
    console.error('Error fetching student details:', error);
    throw error;
  }
}

// Example usage in your UI
document.getElementById('updateStudentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const studentId = document.getElementById('studentId').value;
  const updateData = {
    name: document.getElementById('name').value,
    institution: document.getElementById('institution').value,
    level: document.getElementById('level').value,
    course_of_study: document.getElementById('course_of_study').value,
    gender: document.getElementById('gender').value,
    startDate: document.getElementById('startDate').value,
    duration: document.getElementById('duration').value,
    supervisor_id: document.getElementById('supervisor').value,
    interest: document.getElementById('interest').value,
    it_status: document.getElementById('it_status').value
  };

  try {
    const result = await updateStudentInfo(studentId, updateData);
    alert('Student updated successfully!');
    console.log('Updated student:', result.student);
  } catch (error) {
    alert(error.message);
  }
});

// Load student data when page loads
async function loadStudentData(studentId) {
  try {
    const student = await getStudentDetails(studentId);
    
    // Populate form fields
    document.getElementById('name').value = student.name || '';
    document.getElementById('institution').value = student.institution || '';
    document.getElementById('level').value = student.level || '';
    document.getElementById('course_of_study').value = student.course_of_study || '';
    document.getElementById('gender').value = student.gender || '';
    document.getElementById('startDate').value = student.startDate || '';
    document.getElementById('duration').value = student.duration || '';
    document.getElementById('supervisor').value = student.supervisor_id || '';
    document.getElementById('interest').value = student.interest || '';
    document.getElementById('it_status').value = student.it_status || '';
    
    // Display calculated end date
    document.getElementById('endDateDisplay').textContent = student.endDate || 'N/A';
  } catch (error) {
    console.error('Error loading student data:', error);
  }
}

// Call this when the page loads with a specific student ID
// loadStudentData('123');