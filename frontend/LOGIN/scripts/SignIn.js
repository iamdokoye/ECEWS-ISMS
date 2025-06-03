document.addEventListener("DOMContentLoaded", function () {
  // --- HEADER ARROW TOGGLE ---
  const headerUser = document.querySelector('.headerUser');
  const dropDownArrow = document.querySelector('.dropDownArrow');
  let isMenuOpen = false;

  if (headerUser && dropDownArrow) {
    dropDownArrow.style.display = 'none';

    headerUser.addEventListener('click', (event) => {
      dropDownArrow.style.display = isMenuOpen ? 'none' : 'block';
      isMenuOpen = !isMenuOpen;
      event.stopPropagation();
    });

    document.addEventListener('click', (event) => {
      if (isMenuOpen && !dropDownArrow.contains(event.target) && !headerUser.contains(event.target)) {
        dropDownArrow.style.display = 'none';
        isMenuOpen = false;
      }
    });
  }

  // --- ROW ARROW TOGGLE ---
  const iconWrapper = document.querySelector('.iconWrapper');
  const profileDropDown = document.querySelector('.profileDropDown');
  let menuOpen = false;

  if (iconWrapper && profileDropDown) {
    profileDropDown.style.display = 'none';

    iconWrapper.addEventListener('click', (event) => {
      profileDropDown.style.display = menuOpen ? 'none' : 'block';
      menuOpen = !menuOpen;
      event.stopPropagation();
    });

    document.addEventListener('click', (event) => {
      if (menuOpen && !profileDropDown.contains(event.target) && !iconWrapper.contains(event.target)) {
        profileDropDown.style.display = 'none';
        menuOpen = false;
      }
    });
  }

  // --- HOME BUTTON NAVIGATION ---
  const triggerDiv = document.getElementById("HomeWrapper");

  if (triggerDiv) {
    triggerDiv.addEventListener("click", function () {
      window.location.href = "Dashboard.html";
    });
  } else {
    console.error("Element with ID 'HomeWrapper' was not found.");
  }
});
