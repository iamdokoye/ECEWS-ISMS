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

    // Global variables for calendar management
    let studentStartDate = null;
    let calendarWeeks = [];
    let currentMonth = 1;
    let currentWeek = 1;

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

    // Generate weekly calendar based on start date
    function generateWeeklyCalendar(startDate) {
        const weeks = [];
        const start = new Date(startDate);
        
        // Ensure we start from a Monday
        const dayOfWeek = start.getDay();
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        start.setDate(start.getDate() + daysToMonday);
        
        // Generate 24 weeks (6 months * 4 weeks)
        for (let week = 0; week < 24; week++) {
            const weekDates = [];
            const weekStart = new Date(start);
            weekStart.setDate(start.getDate() + (week * 7));
            
            // Generate Monday to Friday for each week
            for (let day = 0; day < 5; day++) {
                const currentDate = new Date(weekStart);
                currentDate.setDate(weekStart.getDate() + day);
                weekDates.push({
                    date: currentDate.toISOString().split('T')[0],
                    dayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][day],
                    displayDate: currentDate.toLocaleDateString('en-GB')
                });
            }
            
            weeks.push({
                weekNumber: (week % 4) + 1,
                monthNumber: Math.floor(week / 4) + 1,
                dates: weekDates
            });
        }
        
        return weeks;
    }

    // Fetch student data
    async function fetchStudentData() {
        const data = await fetchData(`${apiBase}/students/${studentId}`);
        if (!data) return null;
        
        // Store the start date for calendar generation
        studentStartDate = data.startdate || data.created_at;
        
        // Transform data if needed to match your frontend structure
        return {
            name: data.fullName || data.name,
            interest: data.interest,
            institution: data.institution || data.school,
            level: data.level,
            duration: data.duration,
            email: data.email,
            joindate: studentStartDate,
            photoUrl: data.photoUrl || '/frontend/supervisor-view/assets/johndoe.png',
            status: data.status || 'Present',
            startdate: studentStartDate
        };
    }

    // Fetch log data for specific dates
    async function fetchLogData(dates) {
    try {
        const dateStrings = dates.map(d => d.date);
        console.log('Fetching logs for dates:', dateStrings);
        
        const url = `${apiBase}/logs/student/${studentId}`;
        console.log('API URL:', url);
        
        const allLogs = await fetchData(url);
        console.log('All logs received:', allLogs);
        
        if (!Array.isArray(allLogs)) {
            console.log('No logs array received');
            return [];
        }
        
        // Filter logs for the specific dates and only submitted ones
        const filteredLogs = allLogs.filter(log => {
            // FIX: Handle PostgreSQL boolean values
            const isSubmitted = log.is_submitted === true || log.is_submitted === 't' || log.is_submitted === 'true';
            
            if (!isSubmitted) {
                return false;
            }
            
            // Extract date from log_date field
            let logDate;
            if (log.log_date) {
                logDate = new Date(log.log_date).toISOString().split('T')[0];
            } else if (log.date) {
                logDate = new Date(log.date).toISOString().split('T')[0];
            } else if (log.created_at) {
                logDate = new Date(log.created_at).toISOString().split('T')[0];
            }
            
            // Check if this log date is in our requested dates
            const isInDateRange = dateStrings.includes(logDate);
            console.log(`Log ID ${log.id}: date=${logDate}, inRange=${isInDateRange}, submitted=${isSubmitted}`);
            
            return isInDateRange;
        });
        
        console.log('Filtered logs:', filteredLogs);
        return filteredLogs;
        
    } catch (error) {
        console.error('Error fetching log data:', error);
        return [];
    }
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
        elements.studentMajor.textContent = student.interest || 'N/A';
        
        if (elements.uniElements.length >= 4) {
            elements.uniElements[0].textContent = student.institution || 'N/A';
            elements.uniElements[1].textContent = student.level || 'N/A';
            elements.uniElements[2].textContent = student.duration || 'N/A';
            elements.uniElements[3].textContent = student.email || 'N/A';
        }
        
        elements.joinDate.textContent = `Joined on ${formatLongDate(student.joindate)}`;
        elements.studentPhoto.src = student.photoUrl;
        elements.studentPhoto.alt = student.name || 'Student photo';
        
        if (elements.status) {
            elements.status.textContent = student.status;
            elements.status.className = `status ${student.status === 'Absent' ? 'absent' : ''}`;
        }
    }

    // Display weekly log data with actual calendar dates
    async function displayWeekLog(month, week) {
    // Find the specific week from our generated calendar
    const weekData = calendarWeeks.find(w => w.monthNumber === month && w.weekNumber === week);
    
    if (!weekData) {
        console.error(`Week data not found for month ${month}, week ${week}`);
        return;
    }

    console.log('Displaying week data for:', { month, week, dates: weekData.dates });

    // Fetch logs for this week's dates
    const logData = await fetchLogData(weekData.dates);
    console.log('Received log data:', logData);
    
    // Create a map of logs by date for easy lookup - FIXED BOOLEAN VERSION
    const logMap = {};
    logData.forEach(log => {
        console.log('Processing log:', log);
        
        // Handle the log_date field from your backend
        let logDate;
        if (log.log_date) {
            logDate = new Date(log.log_date).toISOString().split('T')[0];
        } else if (log.date) {
            logDate = new Date(log.date).toISOString().split('T')[0];
        } else if (log.created_at) {
            logDate = new Date(log.created_at).toISOString().split('T')[0];
        }
        
        console.log('Extracted log date:', logDate);
        console.log('is_submitted value:', log.is_submitted, 'type:', typeof log.is_submitted);
        
        // FIX: Handle PostgreSQL boolean values (string 't'/'f' or boolean true/false)
        const isSubmitted = log.is_submitted === true || log.is_submitted === 't' || log.is_submitted === 'true';
        
        console.log('Processed isSubmitted:', isSubmitted);
        
        if (logDate && isSubmitted) {
            logMap[logDate] = log;
            console.log('Added to logMap:', logDate, '→', log.content);
        }
    });

    console.log('Log map created:', logMap);
    console.log('Log map keys:', Object.keys(logMap));

    // Reset all fields first
    elements.workDataElements.forEach(el => {
        el.textContent = '';
        el.style.color = '#999';
    });
    
    // Populate with calendar dates and corresponding logs
    weekData.dates.forEach((dateInfo, index) => {
        if (index < elements.dateDataElements.length && index < elements.workDataElements.length) {
            // Set the actual calendar date
            elements.dateDataElements[index].textContent = dateInfo.displayDate;
            
            // Check if there's a submitted log for this date
            const log = logMap[dateInfo.date];
            console.log(`Checking date ${dateInfo.date}:`, log ? 'FOUND' : 'NOT FOUND');
            
            if (log) {
                // Display the log content in work done field
                const workContent = log.content || log.work_done || log.description || 'Log submitted';
                elements.workDataElements[index].textContent = workContent;
                elements.workDataElements[index].style.color = '#000';
                elements.workDataElements[index].style.fontWeight = 'normal';
                elements.workDataElements[index].style.fontStyle = 'normal';
                console.log(`Set content for ${dateInfo.date}:`, workContent);
            } else {
                elements.workDataElements[index].textContent = 'No entry';
                elements.workDataElements[index].style.color = '#999';
                elements.workDataElements[index].style.fontStyle = 'italic';
            }
        }
    });
    
    // Update week heading with actual date range
    if (elements.weekHead && weekData.dates.length > 0) {
        const startDate = weekData.dates[0].displayDate;
        const endDate = weekData.dates[weekData.dates.length - 1].displayDate;
        elements.weekHead.textContent = `Week ${week} (${startDate} - ${endDate})`;
    }
}

    // Update month/week button availability based on generated calendar
    function updateButtonAvailability() {
        // Update month buttons
        elements.monthButtons.forEach((btn, index) => {
            const monthNum = index + 1;
            const hasWeeks = calendarWeeks.some(w => w.monthNumber === monthNum);
            
            if (hasWeeks) {
                btn.classList.remove('disabled');
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            } else {
                btn.classList.add('disabled');
                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
            }
        });

        // Update week buttons based on current month
        elements.weekButtons.forEach((btn, index) => {
            const weekNum = index + 1;
            const hasWeek = calendarWeeks.some(w => w.monthNumber === currentMonth && w.weekNumber === weekNum);
            
            if (hasWeek) {
                btn.classList.remove('disabled');
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            } else {
                btn.classList.add('disabled');
                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
            }
        });
    }

    // Error display
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            border: 1px solid #f5c6cb;
        `;
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
                const month = parseInt(btn.dataset.month);
                
                // Skip if disabled
                if (btn.classList.contains('disabled')) return;
                
                currentMonth = month;
                
                // Update active state
                elements.monthButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update week button availability
                updateButtonAvailability();
                
                // Load first available week of selected month
                const firstWeek = calendarWeeks.find(w => w.monthNumber === month);
                if (firstWeek) {
                    currentWeek = firstWeek.weekNumber;
                    await displayWeekLog(month, currentWeek);
                    
                    // Reset week selection to first available week
                    elements.weekButtons.forEach((wBtn, i) => {
                        wBtn.classList.toggle('active', i === (currentWeek - 1));
                    });
                }
            });
        });
        
        // Week selection
        elements.weekButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const week = parseInt(btn.dataset.week);
                
                // Skip if disabled
                if (btn.classList.contains('disabled')) return;
                
                currentWeek = week;
                
                // Update active state
                elements.weekButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Load selected week
                await displayWeekLog(currentMonth, week);
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
        
        // Save button - This would need a separate endpoint for supervisor comments
        document.getElementById('sendFeedback')?.addEventListener('click', async () => {
            if (signaturePad.isEmpty()) {
                alert('Please provide a signature first.');
                return;
            }
            
            try {
                const signatureData = signaturePad.toDataURL();
                const comment = elements.commentInput?.value || '';
                
                // You'll need to create a separate endpoint for supervisor comments
                // since your current endpoint only works for the authenticated user
                const response = await fetch(`${apiBase}/supervisor/comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        studentId,
                        comment,
                        signature: signatureData,
                        month: currentMonth,
                        week: currentWeek
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
        try {
            // Load student data first to get start date
            const studentData = await fetchStudentData();
            if (!studentData || !studentData.startdate) {
                showError('Student start date not found. Cannot generate calendar.');
                return;
            }
            
            displayStudentData(studentData);
            
            // Generate weekly calendar based on start date
            calendarWeeks = generateWeeklyCalendar(studentData.startdate);
            
            if (calendarWeeks.length === 0) {
                showError('Failed to generate calendar weeks.');
                return;
            }
            
            // Set default to first available month/week
            const firstWeek = calendarWeeks[0];
            currentMonth = firstWeek.monthNumber;
            currentWeek = firstWeek.weekNumber;
            
            // Update button availability
            updateButtonAvailability();
            
            // Activate default buttons
            elements.monthButtons.forEach((btn, i) => {
                btn.classList.toggle('active', i === (currentMonth - 1));
            });
            elements.weekButtons.forEach((btn, i) => {
                btn.classList.toggle('active', i === (currentWeek - 1));
            });
            
            // Load initial log data
            await displayWeekLog(currentMonth, currentWeek);
            
            // Initialize all components
            initSelectors();
            initSignaturePad();
            initHomeButton();
            initModalControls();
            
        } catch (error) {
            console.error('Initialization error:', error);
            showError('Failed to initialize student log calendar.');
        }
    }

    // Start the application
    init();
});