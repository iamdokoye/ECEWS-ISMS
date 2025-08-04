const studentId = sessionStorage.getItem("studentId");
const token = sessionStorage.getItem('token');
const user = JSON.parse(sessionStorage.getItem('user'));
console.log('user:', user);

document.addEventListener('DOMContentLoaded', () => {
    const calendarBody = document.getElementById('calendar-body');
    const logDateLabel = document.getElementById('log-date');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeBtn');
    const yearDropdown = document.getElementById('year-dropdown');
    const selectedYear = document.getElementById('selected-year');
    const overlay2 = document.getElementById('overlay2');
    const logTextArea = document.getElementById('signatureText');
    const saveLogBtn = document.getElementById('sendFeedback');
    const submitBtn = document.getElementById('proceedBtn4')
    const profilebtn = document.querySelector('.profileDrop');



    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null;

    const apiBase = window.API_BASE;

    const pad = num => num.toString().padStart(2, '0');

    // Helper function to format date as YYYY-MM-DD
    const formatDate = (date) => {
        const d = new Date(date);
        // Use local date components instead of UTC
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`${apiBase}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const user = res.data.user;
            document.getElementById('pText').textContent = user.name;
            // sessionStorage.setItem('studentId', user.id);
            console.log('User profile fetched:', user);
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
            alert('Failed to fetch user profile. Please log in again.');
            window.location.href = '/frontend/userlogin/login.html';
        }
    };

    // Fetch and display logs
    const fetchLogs = async (date) => {
        try {
            // Convert date to proper format (YYYY-MM-DD) if needed
            const dateStr = formatDate(new Date(date));

            const res = await fetch(`${apiBase}/logs?student_id=${studentId}&date=${dateStr}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            // API returns an array of logs for the student
            // Find the log for a specific date
            const logForDate = Array.isArray(data)
                ? data.find(log => log.log_date === dateStr || log.log_date.split('T')[0] === dateStr)
                : null;

            const logContent = document.querySelector('.log-body p');

            if (logForDate && logForDate.content) {
                logContent.textContent = logForDate.content;
            } else {
                logContent.textContent = `No log entry for ${new Date(date).toDateString()}`;
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            document.querySelector('.log-body p').textContent = 'Error loading log data';
        }
    };

    // Render calendar based on current month and year
    const renderCalendar = () => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();

        calendarBody.innerHTML = '';
        let dayCounter = 1;
        let row = document.createElement('div');
        row.classList.add('calendar-row');
        let cellCount = 0;

        // Previous month's days
        for (let i = 0; i < firstDay; i++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell', 'prev-month');
            cell.textContent = prevMonthLastDate - (firstDay - i - 1);
            row.appendChild(cell);
            cellCount++;
        }

        // Current month's days
        for (let i = firstDay; i < 7; i++) {
            const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(dayCounter)}`;
            const cell = createCalendarCell(dayCounter, dateStr);
            row.appendChild(cell);
            dayCounter++;
            cellCount++;

            if (cellCount === 7) {
                calendarBody.appendChild(row);
                row = document.createElement('div');
                row.classList.add('calendar-row');
                cellCount = 0;
            }
        }

        // Remaining days
        while (dayCounter <= lastDate) {
            if (cellCount === 0) {
                row = document.createElement('div');
                row.classList.add('calendar-row');
            }

            const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(dayCounter)}`;
            const cell = createCalendarCell(dayCounter, dateStr);
            row.appendChild(cell);
            dayCounter++;
            cellCount++;

            if (cellCount === 7) {
                calendarBody.appendChild(row);
                row = document.createElement('div');
                row.classList.add('calendar-row');
                cellCount = 0;
            }
        }

        // Next month's days
        if (cellCount > 0 && cellCount < 7) {
            for (let i = 1; cellCount < 7; i++, cellCount++) {
                const cell = document.createElement('div');
                cell.classList.add('calendar-cell', 'next-month');
                cell.textContent = i;
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }
    };

    // Helper function to create calendar cell
    const createCalendarCell = (day, dateStr) => {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');
        cell.textContent = day;
        cell.setAttribute('data-date', dateStr);

        const today = new Date();
        if (day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()) {
            cell.classList.add('today');
        }

        cell.addEventListener('click', () => onDateClick(cell));
        return cell;
    };

    // Handle date click
    const onDateClick = (cell) => {
        const date = cell.getAttribute('data-date');
        selectedDate = date;

        // Update date label
        logDateLabel.textContent = new Date(date).toLocaleDateString('en-GB', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Update selection
        document.querySelectorAll('.calendar-cell').forEach(td => td.classList.remove('selected-date'));
        cell.classList.add('selected-date');

        // Fetch logs
        fetchLogs(date);
    };

    // Select today's date on initial load
    const selectTodayOnLoad = () => {
        const today = new Date();
        const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayStr = formatDate(todayLocal);

        logDateLabel.textContent = today.toLocaleDateString('en-GB', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Highlight today's cell
        const todayCell = calendarBody.querySelector(`.calendar-cell[data-date="${todayStr}"]`);
        if (todayCell) {
            todayCell.classList.add('selected-date');
        }

        selectedDate = todayStr;
        fetchLogs(todayStr);
    };

    // Initialize
    fetchUserProfile();
    renderCalendar();
    selectTodayOnLoad();

    // Event listeners
    document.getElementById('todayBtn').addEventListener('click', () => {
        currentMonth = new Date().getMonth();
        currentYear = new Date().getFullYear();
        renderCalendar();
        selectTodayOnLoad();
    });

    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    selectedYear.addEventListener('click', () => {
        yearDropdown.classList.toggle('visible');
    });

    // Populate year dropdown
    const currentYearValue = new Date().getFullYear();
    const startYear = currentYearValue - 10;
    const endYear = currentYearValue + 10;

    yearDropdown.innerHTML = '';
    for (let year = startYear; year <= endYear; year++) {
        const yearOption = document.createElement('li');
        yearOption.textContent = year;
        yearOption.addEventListener('click', (e) => {
            currentYear = parseInt(e.target.textContent, 10);
            selectedYear.textContent = currentYear;
            yearDropdown.classList.remove('visible');
            renderCalendar();
        });
        yearDropdown.appendChild(yearOption);
    }

    // Add Log Submission
    saveLogBtn.addEventListener('click', async () => {
        const logContent = logTextArea.value.trim();
        if (!logContent) {
            alert('Log content cannot be empty');
            return;
        }

        if (!selectedDate) {
            alert('Please select a date');
            return;
        }

        overlay.classList.remove('show');
        overlay2.classList.add('show');
    });

    document.getElementById('proceedBtn').addEventListener('click', async () => {
        const logContent = logTextArea.value.trim();
        try {
            const response = await fetch(`${apiBase}/logs/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    student_id: studentId,
                    log_date: selectedDate,
                    content: logContent
                })
            });

            const data = await response.json();
            overlay2.classList.remove('show');
            logTextArea.value = '';

            if (response.ok) {
                alert('Log saved successfully');
                fetchLogs(selectedDate);
            } else {
                alert('Error saving log: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the log.');
        }
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        overlay2.classList.remove('show');
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('show');
    });

    // <!-- Submit your logs --!>
    submitBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`${apiBase}/logs/submit-all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            const data = await response.json();

            if (response.ok) {
                alert('Log saved successfully');
                fetchLogs(selectedDate);
            } else {
                alert('Error saving log: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the log.');
        }
    });

    profilebtn.addEventListener('click', () => {
        window.location.href = `/frontend/user-view/studentProfile.html?id=${studentId}`;
    });
});
