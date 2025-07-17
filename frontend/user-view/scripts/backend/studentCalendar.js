document.addEventListener('DOMContentLoaded', () => {
    const calendarBody = document.getElementById('calendar-body');
    const logDateLabel = document.getElementById('log-date');
    const logContent = document.querySelector('.log-body p');
    const addLogBtn = document.querySelector('.addLogBtn');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeBtn');
    const sendFeedbackBtn = document.getElementById('sendFeedback');
    const signatureText = document.getElementById('signatureText');
    const yearDropdown = document.getElementById('year-dropdown');
    const selectedYear = document.getElementById('selected-year');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = `${currentYear}-${currentMonth + 1}-${new Date().getDate()}`;

    const apiBase = window.API_BASE;
    const token = localStorage.getItem('token');

    window.addEventListener('DOMContentLoaded', async () => {
        try {
            const res = await axios.get(`${apiBase}/auth/debug-token`, {
                withCredentials: true
            });
            console.log('✅ User data from token:', res.data.user);
        } catch (err) {
            console.error('❌ Debug token failed:', err);
        }
    });

    window.addEventListener('DOMContentLoaded', async () => {
        try {
            const res = await axios.get(`${apiBase}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const user = res.data.user;

            document.getElementById('pText').textContent = user.name;
            localStorage.setItem('studentId', user.id); // store if needed elsewhere

        } catch (err) {
            console.error('Failed to fetch user profile:', err);
            alert('Failed to fetch user profile. Please log in again.');
            window.location.href = '/frontend/userlogin/login.html';
        }
    });


    // Fetch and display logs
    const fetchLogs = async (date) => {
        const res = await fetch(`${apiBase}/logs/${studentId}`, {
            credentials: 'include',
        });
        const logs = await res.json();
        const log = logs.find(log => log.log_date === date);
        if (log) {
            logContent.textContent = log.content || 'You haven’t filled any log for today';
        } else {
            logContent.textContent = 'You haven’t filled any log for today';
        }
    };

    // Render calendar based on current month and year
    const renderCalendar = () => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // Get the first day of the month
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the last date of the month
        const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate(); // Last date of the previous month

        calendarBody.innerHTML = ''; // Clear previous calendar

        let dayCounter = 1;
        let row = document.createElement('div');
        row.classList.add('calendar-row');
        let cellCount = 0;

        // Insert empty cells for the previous month's last few days
        for (let i = 0; i < firstDay; i++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell', 'prev-month');
            cell.textContent = prevMonthLastDate - (firstDay - i - 1);
            row.appendChild(cell);
            cellCount++;
        }

        // Insert current month's days
        for (let i = firstDay; i < 7; i++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell');
            cell.textContent = dayCounter;
            cell.setAttribute('data-date', `${currentYear}-${currentMonth + 1}-${dayCounter}`);
            if (dayCounter === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
                cell.classList.add('today');
            }
            cell.addEventListener('click', () => onDateClick(cell));
            row.appendChild(cell);
            dayCounter++;
            cellCount++;

            // If we have filled the first row, append it and reset the row
            if (cellCount === 7) {
                calendarBody.appendChild(row);
                row = document.createElement('div');
                row.classList.add('calendar-row');
                cellCount = 0;
            }
        }

        // Insert remaining days in the month
        while (dayCounter <= lastDate) {
            if (cellCount === 0) {
                row = document.createElement('div');
                row.classList.add('calendar-row');
            }

            const cell = document.createElement('div');
            cell.classList.add('calendar-cell');
            cell.textContent = dayCounter;
            cell.setAttribute('data-date', `${currentYear}-${currentMonth + 1}-${dayCounter}`);
            if (dayCounter === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
                cell.classList.add('today');
            }
            cell.addEventListener('click', () => onDateClick(cell));
            row.appendChild(cell);
            dayCounter++;
            cellCount++;

            // Once the row is filled, append it and reset for next
            if (cellCount === 7 || dayCounter > lastDate) {
                calendarBody.appendChild(row);
                row = document.createElement('div');
                row.classList.add('calendar-row');
                cellCount = 0;
            }
        }

        // If the last row has fewer than 7 cells, we fill the row with empty cells to complete the row.
        if (cellCount > 0 && cellCount < 7) {
            for (let i = cellCount; i < 7; i++) {
                const cell = document.createElement('div');
                cell.classList.add('calendar-cell', 'next-month');
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }
    };

    // Handle date click to select and display log
    const onDateClick = (cell) => {
        const date = cell.getAttribute('data-date');
        selectedDate = date;
        logDateLabel.textContent = `${new Date(date).toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`;
        fetchLogs(date);
        document.querySelectorAll('.calendar-cell').forEach(td => td.classList.remove('selected-date'));
        cell.classList.add('selected-date');
    };

    // Add log button click handler
    addLogBtn.addEventListener('click', () => {
        if (!selectedDate) return alert('Please select a date');
        overlay.classList.add('show');
    });

    // Save log content
    sendFeedbackBtn.addEventListener('click', async () => {
        const content = signatureText.value.trim();
        if (content) {
            const res = await fetch(`${apiBase}/logs/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: studentId, log_date: selectedDate, content })
            });
            const data = await res.json();
            if (data.success) {
                overlay.classList.remove('show');
                fetchLogs(selectedDate); // Refresh the log content after saving
            } else {
                alert('Error saving log');
            }
        } else {
            alert('Log content cannot be empty');
        }
    });

    // Close modal on close button click
    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('show');
    });

    // Jump to today button
    document.getElementById('todayBtn').addEventListener('click', () => {
        currentMonth = new Date().getMonth();
        currentYear = new Date().getFullYear();
        renderCalendar();
    });

    // Month change button click handlers
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

    // Year dropdown toggle
    selectedYear.addEventListener('click', () => {
        yearDropdown.classList.toggle('visible');
    });

    // Handle year selection
    const currentYearValue = new Date().getFullYear();
    const startYear = currentYearValue - 10;
    const endYear = currentYearValue + 10;

    // Dynamically populate year dropdown with 10 years before and after the current year
    yearDropdown.innerHTML = ''; // Clear any existing options
    for (let year = startYear; year <= endYear; year++) {
        const yearOption = document.createElement('li');
        yearOption.textContent = year;
        yearOption.addEventListener('click', (e) => {
            const selectedYearText = e.target.textContent;
            currentYear = parseInt(selectedYearText, 10);
            selectedYear.textContent = selectedYearText;
            yearDropdown.classList.remove('visible');
            renderCalendar();
        });
        yearDropdown.appendChild(yearOption);
    }
    yearDropdown.classList.remove('visible');


    // Initialize calendar
    renderCalendar();

});
