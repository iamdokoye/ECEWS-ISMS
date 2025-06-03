
// THIS IS THE  TOGGLING CODE FOR THE HEADER ARROW// THIS IS THE  TOGGLING CODE FOR THE HEADER ARROW// 
// Select the Arrow and dropDown elements
const headerUser = document.querySelector('.headerUser');
const dropDownArrow = document.querySelector('.dropDownArrow');

let isMenuOpen = false;

// Start hidden
dropDownArrow.style.display = 'none';

// Toggle menu on click
headerUser.addEventListener('click', (event) => {
  dropDownArrow.style.display = isMenuOpen ? 'none' : 'block';
  isMenuOpen = !isMenuOpen;
  event.stopPropagation(); // Prevent accidental close on the same click
});

// Close the menu when clicking outside
document.addEventListener('click', (event) => {
  if (isMenuOpen && !dropDownArrow.contains(event.target) && !headerUser.contains(event.target)) {
    dropDownArrow.style.display = 'none';
    isMenuOpen = false;
  }
});






// THIS IS THE  TOGGLING CODE FOR THE ROWS  ARROW// THIS IS THE  TOGGLING CODE FOR THE HEADER ARROW// 
// Select the Arrow and dropDown elements
const iconWrapper = document.querySelector('.iconWrapper');
const profileDropDown = document.querySelector('.profileDropDown');

let menuOpen = false;

// Initial hidden state
profileDropDown.style.display = 'none';

// Toggle dropdown menu
iconWrapper.addEventListener('click', (event) => {
  profileDropDown.style.display = menuOpen ? 'none' : 'block';
  menuOpen = !menuOpen;
  event.stopPropagation(); // Prevent immediate close
});

// Close menu if clicked outside
document.addEventListener('click', (event) => {
  if (menuOpen && !profileDropDown.contains(event.target) && !iconWrapper.contains(event.target)) {
    profileDropDown.style.display = 'none';
    menuOpen = false;
  }
});



