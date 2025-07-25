window.onload = async () => {
    try {
        const response = await fetch(`${window.API_BASE}/admin/dashboard`);
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');

        const data = await response.json();

        // Populate general stats
        document.getElementById('totalStudents').textContent = data.totalStudents || 0;
        document.getElementById('activeStudents').textContent = data.status?.active || 0;
        document.getElementById('pastStudents').textContent = data.status?.past || 0;
        document.getElementById('supervisorCount').textContent = data.supervisorCount || 0;
        document.getElementById('unitCount').textContent = data.units?.length || 0;
        document.getElementById('maleCount').textContent = data.gender?.male || 0;
        document.getElementById('femaleCount').textContent = data.gender?.female || 0;

        // Populate Units Section
        const unitContainer = document.getElementById('unitListContainer');
        unitContainer.innerHTML = ''; // Clear default units
        data.units.forEach(unit => {
            const unitDiv = document.createElement('div');
            unitDiv.classList.add('units');

            const unitName = document.createElement('div');
            unitName.classList.add('totesUnit');
            unitName.textContent = unit.name;

            const unitCount = document.createElement('div');
            unitCount.classList.add('totesNum');
            unitCount.textContent = unit.count;

            unitDiv.appendChild(unitName);
            unitDiv.appendChild(unitCount);
            unitContainer.appendChild(unitDiv);
        });

        // Populate Supervisor Section
        const supervisorContainer = document.getElementById('supervisorList');
        supervisorContainer.innerHTML = ''; // Clear default supervisors
        data.supervisors.forEach(supervisor => {
            const supDiv = document.createElement('div');
            supDiv.classList.add('supervisor');

            // const photoDiv = document.createElement('div');
            // photoDiv.classList.add('superPhoto');
            // const img = document.createElement('img');
            // img.src = supervisor.photo || './assets/johndoe.png';
            // img.alt = 'Supervisor Photo';
            // photoDiv.appendChild(img);

            const nameDiv = document.createElement('div');
            nameDiv.classList.add('superName');
            nameDiv.textContent = supervisor.name;

            const unitDiv = document.createElement('div');
            unitDiv.classList.add('supervisorUnit');
            unitDiv.textContent = supervisor.unit;

            // supDiv.appendChild(photoDiv);
            supDiv.appendChild(nameDiv);
            supDiv.appendChild(unitDiv);

            supervisorContainer.appendChild(supDiv);
        });

        // Populate Student Section
        const studentContainer = document.getElementById('lessBody');
        studentContainer.innerHTML = '';

        data.students.forEach(student => {
            const studentsList = document.createElement('div');
            studentsList.classList.add('studentsList');

            const nameUnitContain = document.createElement('div');
            nameUnitContain.classList.add('nameUnitContain');

            const nameBox = document.createElement('div');
            nameBox.classList.add('nameBox');
            nameBox.textContent = student.name || 'Unnamed';

            const unitBox = document.createElement('div');
            unitBox.classList.add('unitBox');
            const interest = student.interest || 'Not specified';
            const unit = student.unit || 'Unknown';
            unitBox.textContent = `${interest}, ${unit}`;

            nameUnitContain.appendChild(nameBox);
            nameUnitContain.appendChild(unitBox);

            studentsList.appendChild(nameUnitContain);
            studentContainer.appendChild(studentsList);
        });

    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        alert('Something went wrong while loading dashboard stats.');
    }
};
