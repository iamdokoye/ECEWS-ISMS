// OPENS STUDENTSCALENDAR WHEN BACK ARROW IS CLICKED

document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.backArrow');
 
  if (button) {
    button.addEventListener('click', function () {
      window.location.href = '/frontend/user-view/studentCalendar.html';
    });
  }
});


document.addEventListener("DOMContentLoaded", function() {
  const uploadBox = document.querySelector('.uploadBox');
  const fileInput = document.getElementById('fileInput');
  const photoBox = document.querySelector('.photoBox');

  // Trigger file input when uploadBox is clicked
  uploadBox.addEventListener('click', function() {
      fileInput.click();
  });

  // When a file is selected, display it in photoBox
  fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              // Create or update image in photoBox
              let img = photoBox.querySelector('img');
              if (!img) {
                  img = document.createElement('img');
                  img.style.maxWidth = '100%';
                  img.style.height = 'auto';
                  photoBox.appendChild(img);
              }
              img.src = e.target.result;
          };
          reader.readAsDataURL(file);
      }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const bioImg = document.querySelector('.bioImg');
  const bioOverlay = document.getElementById('bioOverlay');
  const closeBioModal = document.querySelector('.close-bio-modal');
  const cancelBioBtn = document.querySelector('.cancel-bio-btn');
  const saveBioBtn = document.querySelector('.save-bio-btn');
  const bioTextarea = document.getElementById('bioTextarea');
  const bioBody = document.querySelector('.bioBody');
  
  // Current bio text
  let currentBio = bioBody.textContent.trim();

  // Open modal with transition
  bioImg.addEventListener('click', function() {
    bioTextarea.value = currentBio;
    bioOverlay.style.display = 'flex';
    
    // Trigger reflow to enable transitions
    void bioOverlay.offsetWidth;
    
    bioOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  });

  // Close modal with transition
  function closeModal() {
    bioOverlay.classList.remove('show');
    document.body.style.overflow = '';
    
    // Wait for transition to complete before hiding
    setTimeout(() => {
      bioOverlay.style.display = 'none';
    }, 300);
  }

  // Initialize modal as hidden (but in DOM)
  bioOverlay.style.display = 'none';

  // Event listeners
  closeBioModal.addEventListener('click', closeModal);
  // cancelBioBtn.addEventListener('click', closeModal);

  // Save bio
  saveBioBtn.addEventListener('click', function() {
    const newBio = bioTextarea.value.trim();
    if (newBio) {
      bioBody.textContent = newBio;
      currentBio = newBio;
      // Here you would typically send the data to your server
    }
    closeModal();
  });

  // Close modal when clicking outside
  bioOverlay.addEventListener('click', function(e) {
    if (e.target === bioOverlay) {
      closeModal();
    }
  });
});

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