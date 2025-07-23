document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem('selectedStudentId');
    const apiBase = window.API_BASE;
    
    if (!token || !studentId) {
        window.location.href = '/frontend/supervisor-view/homeListView.html';
        return;
    }

    // DOM Elements
    const goHomeBtn = document.getElementById('goHome');
    const monthButtons = document.querySelectorAll('.btnContain');
    const weekButtons = document.querySelectorAll('.weekBtn');
    const studentName = document.querySelector('.nameInfo');
    const studentMajor = document.querySelector('.majorInfo');
    const studentUniversity = document.querySelectorAll('.Uni')[0];
    const studentLevel = document.querySelectorAll('.Uni')[1];
    const studentDuration = document.querySelectorAll('.Uni')[2];
    const studentEmail = document.querySelectorAll('.Uni')[3];
    const joinDate = document.querySelector('.dateJoined');
    const studentPhoto = document.querySelector('.studentPhoto img');
    const dayDataElements = document.querySelectorAll('.dayData');
    const dateDataElements = document.querySelectorAll('.dateData');
    const workDataElements = document.querySelectorAll('.workData');
    const commentInput = document.querySelector('.comment-input');

    // Fetch student data
    async function fetchStudentData() {
        try {
            const response = await fetch(`${apiBase}/students/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error('Failed to fetch student data');
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching student data:', error);
            return null;
        }
    }

    // Fetch log data for student
    async function fetchLogData(month, week) {
        try {
            const response = await fetch(`${apiBase}/logs?studentId=${studentId}&month=${month}&week=${week}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error('Failed to fetch log data');
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching log data:', error);
            return null;
        }
    }

    // Populate student profile
    async function populateStudentProfile() {
        const student = await fetchStudentData();
        if (!student) return;
        
        studentName.textContent = student.name || 'N/A';
        studentMajor.textContent = student.major || 'N/A';
        studentUniversity.textContent = student.institution || 'N/A';
        studentLevel.textContent = student.level || 'N/A';
        studentDuration.textContent = student.duration || 'N/A';
        studentEmail.textContent = student.email || 'N/A';
        joinDate.textContent = `Joined on ${formatDate(student.joinDate)}`;
        
        if (student.photoUrl) {
            studentPhoto.src = student.photoUrl;
        }
    }

    // Populate week log data
    async function populateWeekLog(month, week) {
        const logData = await fetchLogData(month, week);
        if (!logData) return;
        
        // Clear existing data
        workDataElements.forEach(el => el.textContent = '');
        
        // Populate with new data
        logData.forEach((log, index) => {
            if (index < dayDataElements.length) {
                dateDataElements[index].textContent = formatDate(log.date);
                workDataElements[index].textContent = log.content || 'No entry';
            }
        });
    }

    // Helper function to format date
    function formatDate(dateString) {
        if (!dateString) return 'dd/mm/yy';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }

    // Month button click handler
    function handleMonthClick(month) {
        // Update active month button
        monthButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.month === month);
        });
        
        // Load data for first week of selected month
        populateWeekLog(month, 1);
    }

    // Week button click handler
    function handleWeekClick(month, week) {
        // Update active week button
        weekButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.week === week);
        });
        
        // Get current month
        const activeMonth = document.querySelector('.btnContain.active').dataset.month;
        
        // Load data for selected week
        populateWeekLog(activeMonth, week);
    }

    // Initialize page
    async function init() {
        await populateStudentProfile();
        
        // Set default month and week
        const defaultMonth = '1';
        const defaultWeek = '1';
        
        // Activate default buttons
        document.querySelector(`.btnContain[data-month="${defaultMonth}"]`).classList.add('active');
        document.querySelector(`.weekBtn[data-week="${defaultWeek}"]`).classList.add('active');
        
        // Load initial data
        await populateWeekLog(defaultMonth, defaultWeek);
        
        // Add event listeners
        monthButtons.forEach(btn => {
            btn.addEventListener('click', () => handleMonthClick(btn.dataset.month));
        });
        
        weekButtons.forEach(btn => {
            btn.addEventListener('click', () => handleWeekClick(defaultMonth, btn.dataset.week));
        });
        
        // Home button
        goHomeBtn.addEventListener('click', () => {
            window.location.href = '/frontend/supervisor-view/homeListView.html';
        });
    }

    init();
});