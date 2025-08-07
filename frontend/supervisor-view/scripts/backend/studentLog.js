document.addEventListener('DOMContentLoaded', async () => {
    // Get student ID from URL parameters first, then fallback to sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    let studentId = urlParams.get('studentId') || sessionStorage.getItem('StudentId');
    const token = sessionStorage.getItem('token');
    const apiBase = window.API_BASE;

    // Validate required parameters
    if (!token || !studentId) {
        alert('You are not logged in or student ID is missing.');
        window.location.href = '/frontend/supervisor-view/homeListView.html';
        return;
    }

    // Store student ID for future use
    sessionStorage.setItem('StudentId', studentId);

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
            elements.uniElements[2].textContent = `${student.duration} Months` || 'N/A';
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

        // Get today's date for highlighting
        const today = new Date().toISOString().split('T')[0];

        // Fetch logs for this week's dates
        const logData = await fetchLogData(weekData.dates);
        console.log('Received log data:', logData);

        // Create a map of logs by date for easy lookup
        const logMap = {};
        logData.forEach(log => {
            let logDate;
            if (log.log_date) {
                logDate = new Date(log.log_date).toISOString().split('T')[0];
            } else if (log.date) {
                logDate = new Date(log.date).toISOString().split('T')[0];
            } else if (log.created_at) {
                logDate = new Date(log.created_at).toISOString().split('T')[0];
            }

            const isSubmitted = log.is_submitted === true || log.is_submitted === 't' || log.is_submitted === 'true';

            if (logDate && isSubmitted) {
                logMap[logDate] = log;
            }
        });

        console.log('Log map created:', logMap);

        // Reset all fields first
        elements.workDataElements.forEach(el => {
            el.textContent = '';
            el.style.color = '#999';
            el.style.backgroundColor = '';
            el.style.border = '';
        });

        elements.dateDataElements.forEach(el => {
            el.style.backgroundColor = '';
            el.style.border = '';
            el.style.fontWeight = '';
        });

        // Populate with calendar dates and corresponding logs
        weekData.dates.forEach((dateInfo, index) => {
            if (index < elements.dateDataElements.length && index < elements.workDataElements.length) {
                // Set the actual calendar date
                elements.dateDataElements[index].textContent = dateInfo.displayDate;

                // Highlight today's date
                if (dateInfo.date === today) {
                    elements.dateDataElements[index].style.backgroundColor = '#e3f2fd';
                    elements.dateDataElements[index].style.border = '2px solid #2196f3';
                    elements.dateDataElements[index].style.fontWeight = 'bold';
                    elements.workDataElements[index].style.backgroundColor = '#e3f2fd';
                    elements.workDataElements[index].style.border = '2px solid #2196f3';
                }

                // Check if there's a submitted log for this date
                const log = logMap[dateInfo.date];

                if (log) {
                    const workContent = log.content || log.work_done || log.description || 'Log submitted';
                    elements.workDataElements[index].textContent = workContent;
                    elements.workDataElements[index].style.color = '#000';
                    elements.workDataElements[index].style.fontWeight = 'normal';
                    elements.workDataElements[index].style.fontStyle = 'normal';

                    // Add a subtle indicator for days with logs
                    if (dateInfo.date !== today) {
                        elements.workDataElements[index].style.backgroundColor = '#f8f9fa';
                        elements.dateDataElements[index].style.backgroundColor = '#f8f9fa';
                    }
                } else {
                    elements.workDataElements[index].textContent = 'No entry';
                    elements.workDataElements[index].style.color = '#999';
                    elements.workDataElements[index].style.fontStyle = 'italic';
                }
            }
        });

        // Update week heading
        if (elements.weekHead && weekData.dates.length > 0) {
            const startDate = weekData.dates[0].displayDate;
            const endDate = weekData.dates[weekData.dates.length - 1].displayDate;
            const weekContainsToday = weekData.dates.some(d => d.date === today);

            elements.weekHead.textContent = `Week ${week} (${startDate} - ${endDate})${weekContainsToday ? ' - Current Week' : ''}`;

            if (weekContainsToday) {
                elements.weekHead.style.color = '#2196f3';
                elements.weekHead.style.fontWeight = 'bold';
            } else {
                elements.weekHead.style.color = '';
                elements.weekHead.style.fontWeight = '';
            }
        }

        // IMPORTANT: Load signature data for the newly displayed week
        await loadSignatureForWeek(month, week);
    }


    function findCurrentDateWeek(calendarWeeks) {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        console.log('Looking for current date:', today);

        // Find the week that contains today's date
        for (const week of calendarWeeks) {
            const weekDates = week.dates.map(d => d.date);
            if (weekDates.includes(today)) {
                console.log('Found current date in:', {
                    month: week.monthNumber,
                    week: week.weekNumber,
                    dates: weekDates
                });
                return {
                    month: week.monthNumber,
                    week: week.weekNumber
                };
            }
        }

        // If today's date is not in the generated calendar, find the closest week
        const today_date = new Date(today);
        let closestWeek = null;
        let minDifference = Infinity;

        for (const week of calendarWeeks) {
            for (const dateInfo of week.dates) {
                const weekDate = new Date(dateInfo.date);
                const difference = Math.abs(today_date - weekDate);

                if (difference < minDifference) {
                    minDifference = difference;
                    closestWeek = {
                        month: week.monthNumber,
                        week: week.weekNumber
                    };
                }
            }
        }

        if (closestWeek) {
            console.log('Today not in calendar, using closest week:', closestWeek);
            return closestWeek;
        }

        // Final fallback to first week
        console.log('Using fallback to first week');
        return {
            month: calendarWeeks[0].monthNumber,
            week: calendarWeeks[0].weekNumber
        };
    }

    // Update month/week button availability based on generated calendar
    function updateButtonAvailability() {
        const today = new Date().toISOString().split('T')[0];

        // Update month buttons
        elements.monthButtons.forEach((btn, index) => {
            const monthNum = index + 1;
            const hasWeeks = calendarWeeks.some(w => w.monthNumber === monthNum);

            if (hasWeeks) {
                btn.classList.remove('disabled');
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';

                // Check if this month contains today's date
                const monthContainsToday = calendarWeeks.some(w =>
                    w.monthNumber === monthNum &&
                    w.dates.some(d => d.date === today)
                );

                if (monthContainsToday) {
                    btn.style.backgroundColor = '#aeedc0ff'; // Highlight current week
                    // btn.style.border = '2px solid #007bff'; // Highlight current month
                    btn.style.fontWeight = 'bold';
                }
            } else {
                btn.classList.add('disabled');
                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
            }
        });

        // Update week buttons based on current month
        elements.weekButtons.forEach((btn, index) => {
            const weekNum = index + 1;
            const weekData = calendarWeeks.find(w => w.monthNumber === currentMonth && w.weekNumber === weekNum);

            if (weekData) {
                btn.classList.remove('disabled');
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';

                // Check if this week contains today's date
                const weekContainsToday = weekData.dates.some(d => d.date === today);

                if (weekContainsToday) {
                    btn.style.backgroundColor = '#aeedc0ff'; // Highlight current week
                    // btn.style.border = '2px solid #007bff'; // Highlight current week
                    btn.style.fontWeight = 'bold';
                } else {
                    btn.style.border = ''; // Reset border
                    btn.style.fontWeight = '';
                }
            } else {
                btn.classList.add('disabled');
                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
                btn.style.border = '';
                btn.style.fontWeight = '';
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

                if (btn.classList.contains('disabled')) return;

                currentWeek = week;

                // Update active state
                elements.weekButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Load selected week (this will also load the signature)
                await displayWeekLog(currentMonth, week);
            });
        });
    }

    // Initialize signature pad
    function initSignaturePad() {
        const canvas = document.getElementById('signatureCanvas');
        if (!canvas) {
            console.error('Signature canvas not found');
            return;
        }

        // Don't reinitialize if already done
        if (signaturePad && isSignatureInitialized) {
            return signaturePad;
        }

        signaturePad = new SignaturePad(canvas);
        isSignatureInitialized = true;

        // Handle canvas resize
        function resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext('2d').scale(ratio, ratio);
            signaturePad.clear(); // Clear after resize
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return signaturePad;
    }

    // Initialize home button
    function initHomeButton() {
        elements.goHomeBtn?.addEventListener('click', () => {
            window.location.href = '/frontend/supervisor-view/homeListView.html';
        });
    }

    // Initialize modal controls
    function initModalControls() {
        let cachedComment = '';

        // Open signature modal
        document.querySelector('.sign-button')?.addEventListener('click', () => {
            // Cache the comment before modal opens
            cachedComment = elements.commentInput?.value || '';
            document.getElementById('overlay')?.classList.add('show');
        });

        // Save button
        document.getElementById('sendFeedback')?.addEventListener('click', async () => {
            if (!signaturePad || signaturePad.isEmpty()) {
                alert('Please provide a signature first.');
                return;
            }
            const signatureData = signaturePad.toDataURL();
            const comment = cachedComment || elements.commentInput?.value || '';

            if (!comment.trim()) {
                alert('Please enter your comment before signing.');
                return;
            }
            try {
                const response = await fetch(`${apiBase}/supervisor/sign-log`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        studentId,
                        comment,
                        signature: compressedSignature,
                        month: currentMonth,
                        week: currentWeek
                    })
                });

                if (!response.ok) throw new Error('Failed to save comment');

                alert('Comment and signature saved successfully!');
                document.getElementById('overlay')?.classList.remove('show');
            } catch (error) {
                console.error('Error saving comment:', error);
                const errText = await response.text();
                console.error('Server response:', errText);
                alert('Error saving comment. Please try again.');
                throw new Error('Failed to save comment');
            }
        });

        // Close modal
        document.getElementById('closeBtn')?.addEventListener('click', () => {
            document.getElementById('overlay')?.classList.remove('show');
        });
    }


    async function loadSignatureForCurrentWeek() {
        await loadSignatureForWeek(currentMonth, currentWeek);
    }

    // Load saved signature for specific week
    async function loadSignatureForWeek(month, week) {
        const commentInput = document.querySelector('.comment-input');
        const signBtn = document.querySelector('.sign-button');
        const signatureBox = document.querySelector('.signature');

        if (!commentInput || !signBtn || !signatureBox) {
            console.error('Signature UI elements not found');
            return;
        }

        try {
            const response = await fetch(`${apiBase}/supervisor/sign-log/${studentId}/${month}/${week}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                if (data.signed) {
                    // Week is already signed - show read-only mode
                    commentInput.value = data.comment || '';
                    commentInput.disabled = true;
                    signBtn.style.display = 'none';
                    signBtn.textContent = 'Signed ✓';

                    // Display the saved signature
                    const img = document.createElement('img');
                    img.src = data.signature;
                    img.alt = 'Supervisor Signature';
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    img.style.border = '1px solid #ddd';
                    img.style.borderRadius = '4px';

                    signatureBox.innerHTML = '<p style="color: green; font-weight: bold;">Week Signed ✓</p>';
                    signatureBox.appendChild(img);

                    // Update week button to show signed status
                    updateWeekSignatureStatus(month, week, true);
                } else {
                    // Week not signed - show editable mode
                    commentInput.value = '';
                    commentInput.disabled = false;
                    signBtn.style.display = 'inline-block';
                    signBtn.textContent = 'Sign Week';
                    signatureBox.innerHTML = '<p style="color: #666;">No signature yet</p>';

                    // Clear signature pad if modal is open
                    if (signaturePad) {
                        signaturePad.clear();
                    }

                    // Update week button to show unsigned status
                    updateWeekSignatureStatus(month, week, false);
                }
            } else if (response.status === 404) {
                // No signature data found - show editable mode
                commentInput.value = '';
                commentInput.disabled = false;
                signBtn.style.display = 'inline-block';
                signBtn.textContent = 'Sign Week';
                signatureBox.innerHTML = '<p style="color: #666;">No signature yet</p>';

                if (signaturePad) {
                    signaturePad.clear();
                }

                updateWeekSignatureStatus(month, week, false);
            } else {
                throw new Error('Failed to load signature data');
            }
        } catch (error) {
            console.error('Error loading signature for week:', error);
            // Show default editable state on error
            commentInput.value = '';
            commentInput.disabled = false;
            signBtn.style.display = 'inline-block';
            signBtn.textContent = 'Sign Week';
            signatureBox.innerHTML = '<p style="color: #666;">Unable to load signature data</p>';
            updateWeekSignatureStatus(month, week, false);
        }
    }

    // Update week button to show signature status
    function updateWeekSignatureStatus(month, week, isSigned) {
        // Find the week button for the specified week
        const weekButton = document.querySelector(`[data-week="${week}"]`);
        if (!weekButton) return;

        // Remove existing signature indicators
        weekButton.classList.remove('week-signed', 'week-unsigned');

        // Add appropriate class and indicator
        if (isSigned) {
            weekButton.classList.add('week-signed');
            // Add checkmark if not already present
            if (!weekButton.querySelector('.signature-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'signature-indicator';
                indicator.innerHTML = ' ✓';
                indicator.style.color = 'green';
                indicator.style.fontWeight = 'bold';
                weekButton.appendChild(indicator);
            }
        } else {
            weekButton.classList.add('week-unsigned');
            // Remove checkmark if present
            const indicator = weekButton.querySelector('.signature-indicator');
            if (indicator) {
                indicator.remove();
            }
        }
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

            // Find the current date's month and week
            const currentDateInfo = findCurrentDateWeek(calendarWeeks);
            currentMonth = currentDateInfo.month;
            currentWeek = currentDateInfo.week;

            console.log('Starting with current date:', {
                month: currentMonth,
                week: currentWeek,
                today: new Date().toISOString().split('T')[0]
            });

            // Update button availability (with current date highlighting)
            updateButtonAvailability();

            // Activate current month/week buttons
            elements.monthButtons.forEach((btn, i) => {
                btn.classList.toggle('active', i === (currentMonth - 1));
            });
            elements.weekButtons.forEach((btn, i) => {
                btn.classList.toggle('active', i === (currentWeek - 1));
            });

            // Load current week's log data (this will also load signature data)
            await displayWeekLog(currentMonth, currentWeek);

            // Initialize all components
            initSelectors(); // This now includes signature updates
            initSignaturePad(); // Initialize signature pad
            initModalControls(); // Initialize modal with week-specific functionality
            initHomeButton();
            // initPhotoManager(); // If you have photo functionality

            // Load signature status for all weeks (optional - for showing indicators on all week buttons)
            await loadAllWeekSignatureStatuses();

        } catch (error) {
            console.error('Initialization error:', error);
            showError('Failed to initialize student log calendar.');
        }
    }

    // Optional: Load signature status for all weeks to show indicators
    async function loadAllWeekSignatureStatuses() {
        try {
            // Get all unique month/week combinations from calendar
            const weekCombinations = calendarWeeks.map(week => ({
                month: week.monthNumber,
                week: week.weekNumber
            }));

            // Remove duplicates
            const uniqueWeeks = weekCombinations.filter((week, index, self) =>
                index === self.findIndex(w => w.month === week.month && w.week === week.week)
            );

            // Check signature status for each week
            for (const weekInfo of uniqueWeeks) {
                try {
                    const response = await fetch(
                        `${apiBase}/supervisor/sign-log/${studentId}/${weekInfo.month}/${weekInfo.week}`,
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        updateWeekSignatureStatus(weekInfo.month, weekInfo.week, data.signed);
                    } else {
                        updateWeekSignatureStatus(weekInfo.month, weekInfo.week, false);
                    }
                } catch (error) {
                    console.error(`Failed to load signature status for week ${weekInfo.week}:`, error);
                    updateWeekSignatureStatus(weekInfo.month, weekInfo.week, false);
                }
            }
        } catch (error) {
            console.error('Failed to load signature statuses:', error);
        }
    }

    // Start the application
    init();
});