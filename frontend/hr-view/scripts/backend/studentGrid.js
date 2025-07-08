document.addEventListener('DOMContentLoaded', () => {
  const sections = {
    all: document.querySelector('#section1 .studentsGrid'),
    present: document.querySelector('#section2 .studentsGrid'),
    past: document.querySelector('#section3 .studentsGrid')
  };

  let allCards = [];
  // Fetch all students from the backend
  const apiBase = window.APP_CONFIG.API_BASE;
  fetch(`${apiBase}/students/all`)
    .then(res => res.json())
    .then(students => {
      Object.values(sections).forEach(container => container.innerHTML = '');

      students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'studentsCard';
        card.dataset.studentId = student.student_id;

        // Create cardHead wrapper (if not already)
        const cardHead = document.createElement('div');
        cardHead.className = 'cardHead';
        cardHead.style.position = 'relative'; // Needed for absolute positioning of editModal

        // Create status
        const statusDiv = document.createElement('div');
        statusDiv.className = student.it_status === 'past' ? 'statusPast' : 'status';
        statusDiv.textContent = student.it_status === 'past' ? 'Past' : 'Present';

        // Create dotsThree icon
        const dotsThree = document.createElement('div');
        dotsThree.className = 'dotsThree';
        const dotsImg = document.createElement('img');
        dotsImg.src = './assets/DotsThree.png';
        dotsImg.alt = '';
        dotsThree.appendChild(dotsImg);

        // Create editModal
        const editModal = document.createElement('div');
        editModal.className = 'editModal';
        editModal.style.display = 'none'; // Default hidden
        ['Deactivate', 'Delete'].forEach(action => {
          const actionDiv = document.createElement('div');
          actionDiv.className = action.toLowerCase(); // "deactivate" or "delete"
          actionDiv.textContent = action;

          actionDiv.style.cursor = 'pointer';

          // Prevent click from bubbling to the card
          actionDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`${action} clicked`);
            // Add logic for deactivate/delete here
          });

          editModal.appendChild(actionDiv);
        });


        // Toggle logic
        dotsThree.addEventListener('click', (e) => {
          e.stopPropagation();
          editModal.style.display = editModal.style.display === 'block' ? 'none' : 'block';
        });

        // Hide on outside click
        document.addEventListener('click', (e) => {
          if (!dotsThree.contains(e.target) && !editModal.contains(e.target)) {
            editModal.style.display = 'none';
          }
        });

        // Append everything to cardHead
        cardHead.append(statusDiv, dotsThree, editModal);


        const cardPhoto = document.createElement('div');
        cardPhoto.className = 'cardPhoto';
        const studentPhoto = document.createElement('div');
        studentPhoto.className = 'studentPhoto';
        const photo = document.createElement('img');
        photo.src = './assets/johndoe.png';
        photo.alt = '';
        studentPhoto.appendChild(photo);
        cardPhoto.appendChild(studentPhoto);

        const nameInfoContain = document.createElement('div');
        nameInfoContain.className = 'nameInfoContain';
        const nameInfo = document.createElement('div');
        nameInfo.className = 'nameInfo';
        nameInfo.textContent = student.name;
        const majorInfo = document.createElement('div');
        majorInfo.className = 'majorInfo';
        majorInfo.textContent = student.interest || 'Not specified';
        nameInfoContain.append(nameInfo, majorInfo);

        const majorInfoContain = document.createElement('div');
        majorInfoContain.className = 'majorInfoContain';
        const details = [
          ['./assets/Student.png', student.institution || 'Not specified'],
          ['./assets/GraduationCap.png', student.level || 'Not specified'],
          ['./assets/Clock.png', `${student.duration || ''} Months`],
          ['./assets/Vector.png', student.email]
        ];
        details.forEach(([icon, text]) => {
          const row = document.createElement('div');
          row.className = 'uniContain';
          const iconDiv = document.createElement('div');
          iconDiv.className = 'uniIcon';
          const img = document.createElement('img');
          img.src = icon;
          img.alt = '';
          iconDiv.appendChild(img);
          const value = document.createElement('div');
          value.className = 'Uni';
          value.textContent = text;
          row.append(iconDiv, value);
          majorInfoContain.appendChild(row);
        });

        const cardFooter = document.createElement('div');
        cardFooter.className = 'cardFooter';
        const dateJoined = document.createElement('div');
        dateJoined.className = 'dateJoined';
        dateJoined.textContent = `Joined on ${new Date(student.created_at).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'long', year: 'numeric'
        })}`;
        const viewDetails = document.createElement('div');
        viewDetails.className = 'viewDetails';
        viewDetails.innerHTML = 'View Details <img src="./assets/CaretRight.png" alt="">';
        cardFooter.append(dateJoined, viewDetails);

        card.append(cardHead, cardPhoto, nameInfoContain, majorInfoContain, cardFooter);

        card.addEventListener('click', () => {
          const id = card.dataset.studentId;
          window.location.href = `hrstudentProfile.html?id=${id}`;
        });

        sections.all.appendChild(card);
        if (student.it_status === 'active') sections.present.appendChild(card.cloneNode(true));
        else if (student.it_status === 'past') sections.past.appendChild(card.cloneNode(true));

        allCards.push(card);
      });

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
