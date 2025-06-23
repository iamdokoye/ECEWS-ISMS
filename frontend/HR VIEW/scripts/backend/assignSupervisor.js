// ✅ assignSupervisor.js

document.addEventListener('DOMContentLoaded', () => {
    const unitInput = document.querySelector('#superUnitDisplay input');
    const unitDropdown = document.getElementById('superUnitDrop');
    const supervisorInput = document.querySelector('#superDisplay input');
    const supervisorDropdown = document.getElementById('superDrop');
    const assignBtn = document.getElementById('assignBtn');

    let selectedUnit = '';
    let selectedSupervisorId = null;

    // 1. Fetch and populate units from external DB
    fetch('http://localhost:5000/api/supervisor/units')
        .then(res => res.json())
        .then(units => {
            unitDropdown.innerHTML = '';
            units.forEach(unit => {
                const div = document.createElement('div');
                div.classList.add('unitLIst');
                div.textContent = unit;
                div.addEventListener('click', () => {
                    unitInput.value = unit;
                    selectedUnit = unit;
                    unitDropdown.classList.remove('show');
                    loadSupervisors(unit);
                });
                unitDropdown.appendChild(div);
            });
        })
        .catch(err => console.error('Failed to fetch units:', err));

    // 2. Load users in the selected unit from external DB
    function loadSupervisors(unit) {
        fetch(`http://localhost:5000/api/supervisor/users/by-unit/${encodeURIComponent(unit)}`)
            .then(res => res.json())
            .then(users => {
                supervisorDropdown.innerHTML = '';
                users.forEach(user => {
                    const div = document.createElement('div');
                    div.classList.add('unitLIst');
                    div.textContent = user.name;
                    div.addEventListener('click', () => {
                        supervisorInput.value = user.name;
                        selectedSupervisorId = user.id;
                        supervisorDropdown.classList.remove('show');
                    });
                    supervisorDropdown.appendChild(div);
                });
            })
            .catch(err => console.error('Failed to fetch users:', err));
    }

    // 3. Assign selected supervisor to unit
    assignBtn.addEventListener('click', () => {
        console.log('Selected Unit:', selectedUnit);
        console.log('Selected Supervisor ID:', selectedSupervisorId);
        if (!selectedSupervisorId || !selectedUnit) {
            alert('Please select both a unit and a supervisor');
            return;
        }

        fetch('http://localhost:5000/api/supervisor/assign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ supervisorId: selectedSupervisorId, unit: selectedUnit }),
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message || 'Supervisor assigned');
                location.reload();
            })
            .catch(err => {
                console.error('Error assigning supervisor:', err);
                alert('Failed to assign supervisor');
            });
    });

    // Dropdown toggle
    document.getElementById('superUnit').addEventListener('click', () => {
        unitDropdown.classList.toggle('show');
    });

    document.getElementById('super').addEventListener('click', () => {
        supervisorDropdown.classList.toggle('show');
    });
});
