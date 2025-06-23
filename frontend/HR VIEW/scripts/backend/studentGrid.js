document.addEventListener('DOMContentLoaded', () => {
    const sections = {
        all: document.querySelector('#section1 .studentsGrid'),
        present: document.querySelector('#section2 .studentsGrid'),
        past: document.querySelector('#section3 .studentsGrid')
    };

    let allCards = []; // Save references for search

    fetch('http://localhost:5000/api/students/all')
        .then(res => res.json())
        .then(students => {
            Object.values(sections).forEach(container => container.innerHTML = '');

            students.forEach(student => {
                console.log('Loaded student:', student);
                const card = document.createElement('div');
                card.className = 'studentsCard';
                card.dataset.studentId = student.student_id;

                card.innerHTML = `
          <div class="cardHead">
            <div class="${student.it_status === 'past' ? 'statusPast' : 'status'}">
              ${student.it_status === 'past' ? 'Past' : 'Present'}
            </div>
            <div class="dotsThree">
              <img src="./assets/DotsThree.png" alt="">
            </div>
            <div class="editModal">
              <div class="edit">Deactivate</div>
              <div class="delete">Delete</div>
            </div>
          </div>
          <div class="cardPhoto">
            <div class="studentPhoto">
              <img src="./assets/johndoe.png" alt="">
            </div>
          </div>
          <div class="nameInfoContain">
            <div class="nameInfo">${student.name}</div>
            <div class="majorInfo">${student.interest || 'Not specified'}</div>
          </div>
          <div class="majorInfoContain">
            <div class="uniContain">
              <div class="uniIcon"><img src="./assets/Student.png" alt=""></div>
              <div class="Uni">${student.institution || 'Not specified'}</div>
            </div>
            <div class="uniContain">
              <div class="uniIcon"><img src="./assets/GraduationCap.png" alt=""></div>
              <div class="Uni">${student.level || 'Not specified'}</div>
            </div>
            <div class="uniContain">
              <div class="uniIcon"><img src="./assets/Clock.png" alt=""></div>
              <div class="Uni">${student.duration || ''} Months</div>
            </div>
            <div class="uniContain">
              <div class="uniIcon"><img src="./assets/Vector.png" alt=""></div>
              <div class="Uni">${student.email}</div>
            </div>
          </div>
          <div class="cardFooter">
            <div class="dateJoined">Joined on ${new Date(student.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            <div class="viewDetails">View Details <img src="./assets/CaretRight.png" alt=""></div>
          </div>
        `;

                card.addEventListener('click', () => {
                    const id = card.dataset.studentId;
                    window.location.href = `hrstudentProfile.html?id=${id}`;
                });

                sections.all.appendChild(card);
                if (student.it_status === 'active') sections.present.appendChild(card.cloneNode(true));
                else if (student.it_status === 'past') sections.past.appendChild(card.cloneNode(true));

                allCards.push(card);
            });

            // SEARCH FEATURE
            const searchInput = document.getElementById('searchInput');
            const searchBtn = document.getElementById('searchBtn');

            if (searchInput && searchBtn) {
                searchBtn.addEventListener('click', () => {
                    const query = searchInput.value.trim().toLowerCase();

                    allCards.forEach(card => {
                        const name = card.querySelector('.nameInfo')?.textContent.toLowerCase() || '';
                        const interest = card.querySelector('.majorInfo')?.textContent.toLowerCase() || '';
                        const email = card.querySelector('.uniContain:last-child .Uni')?.textContent.toLowerCase() || '';

                        const match = name.includes(query) || interest.includes(query) || email.includes(query);
                        card.style.display = match ? 'block' : 'none';
                    });
                });
            }
        })
        .catch(err => {
            console.error('Error loading students:', err);
        });
});