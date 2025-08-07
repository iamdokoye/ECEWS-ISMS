document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('id');
  console.log('Id:', studentId);
  const id = sessionStorage.setItem('studentId', studentId) || studentId;
  const apiBase = window.API_BASE;
  const log = document.getElementById('viewLog')

  if (!studentId) {
    alert('No student ID provided');
    return;
  }

  log.addEventListener('onClick', () => {
    sessionStorage.getItem('studentId', id)
    window.location.href = `log.html?id=${id}`;
  });

  try {
    const response = await fetch(`${apiBase}/students/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch student details');

    const student = await response.json();

    document.querySelector('.johnDoe').textContent = student.name || 'N/A';
    document.querySelector('.Interest').textContent = student.interest || 'N/A';
    document.querySelector('.bioBody').textContent = student.bio || 'No bio available';

    // Info section
    const infoDataElements = document.querySelectorAll('.infoData');
    if (infoDataElements.length >= 8) {
      infoDataElements[0].textContent = student.name || 'N/A';
      infoDataElements[1].textContent = student.institution || 'N/A';
      infoDataElements[2].textContent = student.course_of_study || 'N/A';
      infoDataElements[3].textContent = student.email || 'N/A';
      infoDataElements[4].textContent = student.contact || 'N/A';
      infoDataElements[5].textContent = student.unit || 'N/A';
      infoDataElements[6].textContent = student.interest || 'N/A';
      infoDataElements[7].textContent = student.startdate || 'N/A';
    }

    // Additional info
    document.querySelectorAll('.infoData')[8].textContent = student.duration ?
      `${student.duration} Months` : 'N/A';
    document.querySelectorAll('.infoData')[9].textContent = student.supervisor || 'N/A';

    // Photo
    if (student.photoUrl) {
      document.querySelector('.photoBox img').src = student.photoUrl;
      document.querySelector('.navPic img').src = student.photoUrl;
    }
    // else {
    //   document.querySelector('.photoBox img').src = './assets/johndoe.png';
    //   document.querySelector('.navPic img').src = './assets/johndoe.png';
    // }

  } catch (error) {
    console.error('Error loading student details:', error);
    showError('Could not load student profile');
  }
});

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  document.querySelector('.bodyContain').prepend(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}