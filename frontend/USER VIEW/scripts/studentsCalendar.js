// OPENS LOGIN PAGE ON NEW TAB ON CLICKING SIGNOUT BUTTON

document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.signout');
 
  if (button) {
    button.addEventListener('click', function () {
      window.location.href = '/frontend/LOGIN/login.html';
    });
  }
});














// THIS IS THE  TOGGLING CODE FOR THE HEADER ARROW// THIS IS THE  TOGGLING CODE FOR THE HEADER ARROW//
// Select the Arrow and dropDown elements
const headerarrow = document.querySelector('.profile');
const dropDownMenu = document.querySelector('.dropDownMenu');

let isMenuOpen = false;

// Start hidden
dropDownMenu.style.display = 'none';

// Toggle menu on click
headerarrow.addEventListener('click', (event) => {
  dropDownMenu.style.display = isMenuOpen ? 'none' : 'block';
  isMenuOpen = !isMenuOpen;
  event.stopPropagation(); // Prevent accidental close on the same click
});

// Close the menu when clicking outside
document.addEventListener('click', (event) => {
  if (isMenuOpen && !dropDownMenu.contains(event.target) && !headerarrow.contains(event.target)) {
    dropDownMenu.style.display = 'none';
    isMenuOpen = false;
  }
});






// OPENS LOGIN PAGE ON NEW TAB ON CLICKING SIGNOUT BUTTON

document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.signDrop');
 
  if (button) {
    button.addEventListener('click', function () {
      window.location.href = '/frontend/LOGIN/login.html';
    });
  }
});

























// OPENS LOGIN PAGE ON NEW TAB ON CLICKING SIGNOUT BUTTON

document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.profileDrop');
 
  if (button) {
    button.addEventListener('click', function () {
      window.location.href = 'studentProfile.html';
    });
  }
});






const calendarBody = document.getElementById('calendar-body');
const monthLabel = document.getElementById('month-label');
const selectedYear = document.querySelector('.selected-year');
const yearDropdown = document.getElementById('year-dropdown');
const customYearSelector = document.querySelector('.custom-year-selector');

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function populateCustomYearDropdown() {
  for (let y = 1990; y <= 2100; y++) {
    const li = document.createElement('li');
    li.textContent = y;
    li.onclick = () => {
      currentYear = y;
      selectedYear.textContent = y;
      yearDropdown.classList.add('hidden');
      renderCalendar();
    };
    yearDropdown.appendChild(li);
  }
}

function toggleYearDropdown() {
  yearDropdown.classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
  if (!customYearSelector.contains(e.target)) {
    yearDropdown.classList.add('hidden');
  }
});

function renderCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  monthLabel.textContent = monthNames[currentMonth];
  selectedYear.textContent = currentYear;

  calendarBody.innerHTML = "";
  let date = 1;
  let nextMonthDate = 1;

  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');

      if (i === 0 && j < firstDay) {
        cell.classList.add('prev-month');
        cell.innerHTML = `<span>${daysInPrevMonth - firstDay + j + 1}</span>`;
      } else if (date > daysInMonth) {
        cell.classList.add('next-month');
        cell.innerHTML = `<span>${nextMonthDate++}</span>`;
      } else {
        const isToday =
          date === today.getDate() &&
          currentMonth === today.getMonth() &&
          currentYear === today.getFullYear();

        const span = document.createElement('span');
        span.textContent = date;

        if (isToday) {
          span.classList.add('today');
        }

        cell.appendChild(span);
        date++;
      }

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
    if (date > daysInMonth) break;
  }
}

function changeMonth(direction) {
  currentMonth += direction;

  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }

  renderCalendar();
}

function goToToday() {
  today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  renderCalendar();
  setTodayInLogHeader();
}

function setTodayInLogHeader() {
  const logDate = document.getElementById('log-date');
  if (logDate) {
    const options = { weekday: 'short', month: 'long', day: 'numeric' };
    logDate.textContent = today.toLocaleDateString('en-US', options);
  }
}

// Init
populateCustomYearDropdown();
renderCalendar();
setTodayInLogHeader();













// ===== DIALOGUE 1 ELEMENTS =====
const overlay = document.getElementById('overlay');
const insightButton = document.querySelector('.addLogBtn'); // Button to open Dialogue 1
const closeButton = document.getElementById('closeBtn');
const sendFeedbackButton = document.getElementById('sendFeedback');

// ===== DIALOGUE 2 ELEMENTS =====
const overlay2 = document.getElementById('overlay2');
const closeButton2 = document.getElementById('closeBtn2');
const proceedBtn = document.getElementById('proceedBtn');
const cancelBtn = document.getElementById('cancelBtn');

// ===== DIALOGUE 3 ELEMENTS =====
const overlay3 = document.getElementById('overlay3');
const okayBtn3 = document.getElementById('okayBtn');

// ===== DIALOGUE 4 ELEMENTS =====
const overlay4 = document.getElementById('overlay4');
const closeButton4 = document.getElementById('closeBtn4');
const cancelBtn4 = document.getElementById('cancelBtn4');
const proceedBtn4 = document.getElementById('proceedBtn4');
const submitTrigger = document.querySelector('.submit-button'); // Add this button to trigger Dialogue 4

// ===== DIALOGUE 5 ELEMENTS =====
const overlay5 = document.getElementById('overlay5');
const okayBtn5 = document.getElementById('okayBtn5');

// ===== DIALOGUE 1 LOGIC =====
insightButton.addEventListener('click', () => {
  overlay.classList.add('show');
});
function hideFeedbackForm1() {
  overlay.classList.remove('show');
}
closeButton.addEventListener('click', hideFeedbackForm1);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) hideFeedbackForm1();
});

// ===== DIALOGUE 2 LOGIC =====
sendFeedbackButton.addEventListener('click', () => {
  hideFeedbackForm1();
  overlay2.classList.add('show2');
});
function hideFeedbackForm2() {
  overlay2.classList.remove('show2');
}
closeButton2.addEventListener('click', hideFeedbackForm2);
cancelBtn.addEventListener('click', hideFeedbackForm2);
overlay2.addEventListener('click', (e) => {
  if (e.target === overlay2) hideFeedbackForm2();
});
proceedBtn.addEventListener('click', () => {
  hideFeedbackForm2();
  overlay3.classList.add('show3');
});

// ===== DIALOGUE 3 LOGIC =====
function hideFeedbackForm3() {
  overlay3.classList.remove('show3');
}
okayBtn3.addEventListener('click', hideFeedbackForm3);
overlay3.addEventListener('click', (e) => {
  if (e.target === overlay3) hideFeedbackForm3();
});

// ===== DIALOGUE 4 LOGIC =====
submitTrigger.addEventListener('click', () => {
  overlay4.classList.add('show4');
});
function hideFeedbackForm4() {
  overlay4.classList.remove('show4');
}
closeButton4.addEventListener('click', hideFeedbackForm4);
cancelBtn4.addEventListener('click', hideFeedbackForm4);
overlay4.addEventListener('click', (e) => {
  if (e.target === overlay4) hideFeedbackForm4();
});
proceedBtn4.addEventListener('click', () => {
  hideFeedbackForm4();
  overlay5.classList.add('show5');
});

// ===== DIALOGUE 5 LOGIC =====
function hideFeedbackForm5() {
  overlay5.classList.remove('show5');
}
okayBtn5.addEventListener('click', hideFeedbackForm5);
overlay5.addEventListener('click', (e) => {
  if (e.target === overlay5) hideFeedbackForm5();
});


