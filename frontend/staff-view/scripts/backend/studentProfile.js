document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('student_id');

  if (!studentId) {
    alert('No student ID provided');
    return;
  }

  try {
    const response = await fetch(`api/students/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch student details');
    
    const student = await response.json();

    // ✅ Populate the page with the student's data
    document.querySelector('.nameInfo').textContent = student.name || 'N/A';
    document.querySelector('.majorInfo').textContent = student.interest || 'Not specified';
    document.querySelector('.unitDisplay').textContent = student.unit || 'N/A';
    document.querySelector('.durationDisplay').textContent = `${student.duration} Months`;
    document.querySelector('.levelDisplay').textContent = student.level || 'N/A';
    document.querySelector('.emailDisplay').textContent = student.email || 'N/A';
    document.querySelector('.institutionDisplay').textContent = student.institution || 'N/A';
    document.querySelector('.courseDisplay').textContent = student.course_of_study || 'N/A';
    document.querySelector('.supervisorDisplay').textContent = student.supervisor || 'N/A';
    document.querySelector('.joinedDate').textContent = new Date(student.created_at).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    // Optional: profile photo
    if (student.photo) {
      document.querySelector('.studentPhoto img').src = student.photo;
    }

  } catch (err) {
    console.error('Error loading student details:', err);
    alert('Could not load student profile');
  }
});
