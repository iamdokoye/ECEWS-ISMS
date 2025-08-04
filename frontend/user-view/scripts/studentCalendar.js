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
      window.location.href = '/frontend/userlogin/login.html';
    });
  }
});
