document.addEventListener('DOMContentLoaded', async () => {
    // Get student ID from URL parameters first, then fallback to localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let studentId = urlParams.get('studentId') || localStorage.getItem('StudentId');
    const token = localStorage.getItem('token');
    const apiBase = window.API_BASE;
    
    // Validate required parameters
    if (!token || !studentId) {
        alert('You are not logged in or student ID is missing.');
        window.location.href = '/frontend/supervisor-view/homeListView.html';
        return;
    }
    
    // Store student ID for future use
    localStorage.setItem('StudentId', studentId);

    // DOM Elements
    const elements = {
        goHomeBtn: document.getElementById('goHome'),
        monthButtons: document.querySelectorAll('.btnContain'),
        weekButtons: document.querySelectorAll('.weekBtn'),
        studentName: document.querySelector('.nameInfo'),
        studentMajor: document.querySelector('.majorInfo'),
        uniElements: document.querySelectorAll('.Uni'), // [0] institution, [1] level, [2] duration, [3] email
        joinDate: document.querySelector('.dateJoined'),
        studentPhoto: document.querySelector('.studentPhoto img'),
        dayDataElements: document.querySelectorAll('.dayData'),
        dateDataElements: document.querySelectorAll('.dateData'),
        workDataElements: document.querySelectorAll('.workData'),
        commentInput: document.querySelector('.comment-input'),
        weekHead: document.querySelector('.weekHead'),
        status: document.querySelector('.status')
    };

    // Enhanced fetch with error handling
    async function fetchData(url) {
        try {
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            showError(`Failed to load data: ${error.message}`);
            return null;
        }
    }

    // Fetch student data
    async function fetchStudentData() {
        const data = await fetchData(`${apiBase}/students/${studentId}`);
        if (!data) return null;
        
        // Transform data if needed to match your frontend structure
        return {
            name: data.fullName || data.name,
            major: data.major,
            institution: data.institution || data.school,
            level: data.level,
            duration: data.duration,
            email: data.email,
            joinDate: data.joinDate || data.startDate,
            photoUrl: data.photoUrl || '/frontend/supervisor-view/assets/johndoe.png',
            status: data.status || 'Present'
        };
    }

    // Fetch log data with week/month filtering
    async function fetchLogData(month, week) {
        const data = await fetchData(`${apiBase}/logs?studentId=${studentId}&month=${month}&week=${week}`);
        return Array.isArray(data) ? data : [];
    }

    // Format date as "dd/mm/yy"
    function formatShortDate(dateString) {
        if (!dateString) return 'dd/mm/yy';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB');
        } catch {
            return 'dd/mm/yy';
        }
    }

    // Format date as "24 March, 2025"
    function formatLongDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-GB', options);
        } catch {
            return 'N/A';
        }
    }

    // Display student profile data
    function displayStudentData(student) {
        if (!student) return;
        
        elements.studentName.textContent = student.name || 'N/A';
        elements.studentMajor.textContent = student.major || 'N/A';
        
        if (elements.uniElements.length >= 4) {
            elements.uniElements[0].textContent = student.institution || 'N/A';
            elements.uniElements[1].textContent = student.level || 'N/A';
            elements.uniElements[2].textContent = student.duration || 'N/A';
            elements.uniElements[3].textContent = student.email || 'N/A';
        }
        
        elements.joinDate.textContent = `Joined on ${formatLongDate(student.joinDate)}`;
        elements.studentPhoto.src = student.photoUrl;
        elements.studentPhoto.alt = student.name || 'Student photo';
        
        if (elements.status) {
            elements.status.textContent = student.status;
            elements.status.className = `status ${student.status === 'Absent' ? 'absent' : ''}`;
        }
    }

    // Display weekly log data
    function displayWeekLog(logData, month, week) {
        // Reset all fields
        elements.workDataElements.forEach(el => el.textContent = '');
        elements.dateDataElements.forEach(el => el.textContent = 'dd/mm/yy');
        
        // Populate with log data
        logData.forEach((log, index) => {
            if (index < elements.workDataElements.length) {
                elements.dateDataElements[index].textContent = formatShortDate(log.date);
                elements.workDataElements[index].textContent = log.content || 'No entry';
            }
        });
        
        // Update week heading
        if (elements.weekHead) {
            elements.weekHead.textContent = `Month ${month}, Week ${week}`;
        }
    }

    // Error display
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.querySelector('.studentsCard').prepend(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Initialize month/week selectors
    function initSelectors() {
        // Month selection
        elements.monthButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const month = btn.dataset.month;
                
                // Update active state
                elements.monthButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Load first week of selected month
                const logData = await fetchLogData(month, 1);
                displayWeekLog(logData, month, 1);
                
                // Reset week selection
                elements.weekButtons.forEach((wBtn, i) => {
                    wBtn.classList.toggle('active', i === 0);
                });
            });
        });
        
        // Week selection
        elements.weekButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const week = btn.dataset.week;
                const activeMonth = document.querySelector('.btnContain.active').dataset.month;
                
                // Update active state
                elements.weekButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Load selected week
                const logData = await fetchLogData(activeMonth, week);
                displayWeekLog(logData, activeMonth, week);
            });
        });
    }

    // Initialize signature pad
    function initSignaturePad() {
        const canvas = document.getElementById('signatureCanvas');
        if (!canvas) return;
        
        const signaturePad = new SignaturePad(canvas);
        
        // Handle canvas resize
        function resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext('2d').scale(ratio, ratio);
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Clear button
        document.getElementById('clearSignature')?.addEventListener('click', () => {
            signaturePad.clear();
        });
        
        // Save button
        document.getElementById('sendFeedback')?.addEventListener('click', async () => {
            if (signaturePad.isEmpty()) {
                alert('Please provide a signature first.');
                return;
            }
            
            try {
                const signatureData = signaturePad.toDataURL();
                const comment = elements.commentInput?.value || '';
                
                const response = await fetch(`${apiBase}/logs/comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        studentId,
                        comment,
                        signature: signatureData
                    })
                });
                
                if (!response.ok) throw new Error('Failed to save comment');
                
                alert('Comment and signature saved successfully!');
                document.getElementById('overlay')?.classList.remove('show');
            } catch (error) {
                console.error('Error saving comment:', error);
                alert('Error saving comment. Please try again.');
            }
        });
    }

    // Initialize home button
    function initHomeButton() {
        elements.goHomeBtn?.addEventListener('click', () => {
            window.location.href = '/frontend/supervisor-view/homeListView.html';
        });
    }

    // Initialize modal controls
    function initModalControls() {
        // Open signature modal
        document.querySelector('.sign-button')?.addEventListener('click', () => {
            document.getElementById('overlay')?.classList.add('show');
        });
        
        // Close modal
        document.getElementById('closeBtn')?.addEventListener('click', () => {
            document.getElementById('overlay')?.classList.remove('show');
        });
    }

    // Main initialization
    async function init() {
        // Load student data
        const studentData = await fetchStudentData();
        displayStudentData(studentData);
        
        // Set default month/week and load initial data
        const defaultMonth = '1';
        const defaultWeek = '1';
        
        // Activate default buttons
        document.querySelector(`.btnContain[data-month="${defaultMonth}"]`)?.classList.add('active');
        document.querySelector(`.weekBtn[data-week="${defaultWeek}"]`)?.classList.add('active');
        
        // Load initial log data
        const initialLogData = await fetchLogData(defaultMonth, defaultWeek);
        displayWeekLog(initialLogData, defaultMonth, defaultWeek);
        
        // Initialize all components
        initSelectors();
        initSignaturePad();
        initHomeButton();
        initModalControls();
    }

    // Start the application
    init();
});