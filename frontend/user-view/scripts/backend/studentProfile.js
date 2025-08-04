document.addEventListener('DOMContentLoaded', async () => {
    // First try to get studentId from URL, then localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let studentId = urlParams.get('id') || sessionStorage.getItem('StudentId');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const apiBase = window.API_BASE;
    
    // Debugging: Log the values
    console.log('Student ID:', studentId);
    console.log('Token exists:', !!token);

    
    if (!token || !studentId) {
        alert('You are not logged in or student ID is missing.');
        window.location.href = '/frontend/user-view/studentCalendar.html';
        return;
    }

    // Store the studentId in sessionStorage for future use
    sessionStorage.setItem('StudentId', studentId);

    try {
        const response = await fetch(`${apiBase}/students/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const student = await response.json();
        console.log('Student data:', student); // Debugging
        
        // Populate all fields - matching your HTML structure
        // document.querySelector('.navName').textContent = user.name || 'N/A';
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