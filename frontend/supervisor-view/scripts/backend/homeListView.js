document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const unitHeader = document.querySelector('.ItHeader');
    const profileName = document.getElementById('profilename');
    const signoutBtn = document.getElementById('signout');
    const searchNameInput = document.querySelector('.searchName .searchField');
    const searchInstitInput = document.querySelector('.searchInstit .searchField');
    const searchInterestInput = document.querySelector('.searchInterest .searchField');
    const tableBody = document.querySelector('.table');

    // Check if elements exist
    if (!unitHeader || !profileName || !signoutBtn || !tableBody) {
        console.error('Required elements not found');
        return;
    }

    // Remove static rows while preserving headers
    const staticRows = tableBody.querySelectorAll('.tableRows, .straightLines');
    staticRows.forEach(row => row.remove());

    // Create container for dynamic rows
    const rowsContainer = document.createElement('div');
    rowsContainer.className = 'table-rows-container';
    tableBody.appendChild(rowsContainer);

    const token = localStorage.getItem('token');
    const apiBase = window.API_BASE || 'http://localhost:5000';

    if (!token) {
        window.location.href = '/frontend/userlogin/login.html';
        return;
    }

    // Create text node safely
    function createTextElement(parent, className, text) {
        const el = document.createElement('div');
        el.className = className;
        el.textContent = text || '';
        parent.appendChild(el);
        return el;
    }

    // Fetch supervisor and student data
    async function fetchData() {
        try {
            // Show loading state
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading';
            loadingDiv.textContent = 'Loading students...';
            rowsContainer.appendChild(loadingDiv);

            // Get supervisor info
            const supervisorRes = await fetch(`${apiBase}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!supervisorRes.ok) throw new Error('Failed to fetch supervisor data');

            const supervisor = await supervisorRes.json();

            // Update UI with supervisor info
            if (supervisor.user) {
                unitHeader.textContent = `${supervisor.user.unit || 'IT'} Unit`;
                profileName.textContent = `Welcome, ${supervisor.user.name || 'Supervisor'}`;
            }

            // Get students for this unit
            const studentsRes = await fetch(`${apiBase}/supervisor/my-students`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!studentsRes.ok) throw new Error('Failed to fetch students');

            return await studentsRes.json();

        } catch (error) {
            console.error('Error:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = `Error: ${error.message}`;
            rowsContainer.appendChild(errorDiv);
            return { data: [] };
        }
    }

    // Render students table without innerHTML
    function renderStudents(students) {
        // Clear existing rows
        while (rowsContainer.firstChild) {
            rowsContainer.removeChild(rowsContainer.firstChild);
        }

        if (!students || students.length === 0) {
            const noStudentsDiv = document.createElement('div');
            noStudentsDiv.className = 'no-students';
            noStudentsDiv.textContent = 'No students found in your unit';
            rowsContainer.appendChild(noStudentsDiv);
            return;
        }

        students.forEach((student, index) => {
            const row = document.createElement('div');
            row.className = 'tableRows';

            // Add click handler
            row.addEventListener('click', () => {
                // Store student ID in localStorage
                localStorage.setItem('StudentId', student.student_id);
                // Redirect to log page
                window.location.href = `/frontend/supervisor-view/studentLog.html?studentId=${encodeURIComponent(student.student_id)}`;
            });

            // Add columns
            createTextElement(row, 'c1', (index + 1).toString());
            createTextElement(row, 'c2', student.name);
            createTextElement(row, 'c3', student.institution || 'N/A');
            createTextElement(row, 'c4', student.email);
            createTextElement(row, 'c5', student.contact || 'N/A');
            createTextElement(row, 'c6', student.interest || 'N/A');

            rowsContainer.appendChild(row);

            // Add divider line
            const divider = document.createElement('div');
            divider.className = 'straightLines';
            rowsContainer.appendChild(divider);
        });
    }

    // Filter students based on search inputs
    function filterStudents(students, nameFilter, institFilter, interestFilter) {
        return students.filter(student => {
            const nameMatch = !nameFilter ||
                (student.name && student.name.toLowerCase().includes(nameFilter.toLowerCase()));

            const institMatch = !institFilter ||
                (student.institution && student.institution.toLowerCase().includes(institFilter.toLowerCase()));

            const interestMatch = !interestFilter ||
                (student.interest && student.interest.toLowerCase().includes(interestFilter.toLowerCase()));

            return nameMatch && institMatch && interestMatch;
        });
    }

    // Initialize page
    async function init() {
        const response = await fetchData();
        let allStudents = response.data || [];

        renderStudents(allStudents);

        // Search functionality for all three fields
        function handleSearch() {
            const nameFilter = searchNameInput ? searchNameInput.value : '';
            const institFilter = searchInstitInput ? searchInstitInput.value : '';
            const interestFilter = searchInterestInput ? searchInterestInput.value : '';

            const filtered = filterStudents(allStudents, nameFilter, institFilter, interestFilter);
            renderStudents(filtered);
        }

        if (searchNameInput) searchNameInput.addEventListener('input', handleSearch);
        if (searchInstitInput) searchInstitInput.addEventListener('input', handleSearch);
        if (searchInterestInput) searchInterestInput.addEventListener('input', handleSearch);

        // Sign out
        signoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '/frontend/userlogin/login.html';
        });
    }

    init();
});