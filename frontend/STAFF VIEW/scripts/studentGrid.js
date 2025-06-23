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

        const cardHead = document.createElement('div');
        cardHead.className = 'cardHead';

        const statusDiv = document.createElement('div');
        statusDiv.className = student.it_status === 'past' ? 'statusPast' : 'status';
        statusDiv.textContent = student.it_status === 'past' ? 'Past' : 'Present';

        const dotsThree = document.createElement('div');
        dotsThree.className = 'dotsThree';
        const dotsImg = document.createElement('img');
        dotsImg.src = './assets/DotsThree.png';
        dotsImg.alt = '';
        dotsThree.appendChild(dotsImg);

        const editModal = document.createElement('div');
        editModal.className = 'editModal';
        ['Deactivate', 'Delete'].forEach(text => {
          const div = document.createElement('div');
          div.className = text.toLowerCase();
          div.textContent = text;
          editModal.appendChild(div);
        });

        cardHead.append(statusDiv, dotsThree, editModal);

        const cardPhoto = document.createElement('div');
        cardPhoto.className = 'cardPhoto';
        const photoWrap = document.createElement('div');
        photoWrap.className = 'studentPhoto';
        const photo = document.createElement('img');
        photo.src = './assets/johndoe.png';
        photo.alt = '';
        photoWrap.appendChild(photo);
        cardPhoto.appendChild(photoWrap);

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

        const makeUniItem = (icon, text) => {
          const container = document.createElement('div');
          container.className = 'uniContain';
          const iconDiv = document.createElement('div');
          iconDiv.className = 'uniIcon';
          const iconImg = document.createElement('img');
          iconImg.src = icon;
          iconImg.alt = '';
          iconDiv.appendChild(iconImg);
          const uniDiv = document.createElement('div');
          uniDiv.className = 'Uni';
          uniDiv.textContent = text;
          container.append(iconDiv, uniDiv);
          return container;
        };

        majorInfoContain.append(
          makeUniItem('./assets/Student.png', student.institution || 'Not specified'),
          makeUniItem('./assets/GraduationCap.png', student.level || 'Not specified'),
          makeUniItem('./assets/Clock.png', `${student.duration || ''} Months`),
          makeUniItem('./assets/Vector.png', student.email)
        );

        const cardFooter = document.createElement('div');
        cardFooter.className = 'cardFooter';
        const dateDiv = document.createElement('div');
        dateDiv.className = 'dateJoined';
        dateDiv.textContent = `Joined on ${new Date(student.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`;
        const viewDetails = document.createElement('div');
        viewDetails.className = 'viewDetails';
        viewDetails.innerHTML = `View Details <img src="./assets/CaretRight.png" alt="">`;
        cardFooter.append(dateDiv, viewDetails);

        // Assemble card
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
