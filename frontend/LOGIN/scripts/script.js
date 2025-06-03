
// THIS IS THE MENU TOGGLING CODE // THIS IS THE MENU TOGGLING CODE // THIS IS THE MENU TOGGLING CODE // THIS IS THE MENU TOGGLING CODE // THIS IS THE MENU TOGGLING CODE
// Select the menu and dropDownMenu elements
const menu = document.querySelector('.menuContainer');
const dropdown = document.querySelector('.dropDownMenu');

let isOpen = false; // State tracker

// Ensure dropdown starts from the right without moving on page load
dropdown.style.right = '-300px'; // Keep it offscreen
dropdown.style.position = 'absolute';
dropdown.style.transition = 'right 0.5s ease';

// Toggle dropdown position on menu click
menu.addEventListener('click', (event) => {
  if (isOpen) {
    dropdown.style.right = '-300px'; // Slide out (hide)
  } else {
    dropdown.style.right = '0'; // Slide in (show)
  }
  isOpen = !isOpen; // Toggle state
  event.stopPropagation(); // Prevent immediate closing
});

// Close dropdown if clicked anywhere outside
document.addEventListener('click', (event) => {
  if (isOpen && !dropdown.contains(event.target) && !menu.contains(event.target)) {
    dropdown.style.right = '-300px'; // Slide out (hide)
    isOpen = false; // Update state
  }
});







// THIS IS THE SEND FEEDBACK CODE  // THIS IS THE SEND FEEDBACK CODE // THIS IS THE SEND FEEDBACK CODE // THIS IS THE SEND FEEDBACK CODE // THIS IS THE SEND FEEDBACK CODE 

// Select Elements
const overlay = document.getElementById('overlay');
const insightButton = document.querySelector('.insightButton'); // Trigger
const closeButton = document.getElementById('closeBtn');
const sendFeedbackButton = document.getElementById('sendFeedback');

// Show the Feedback Form
insightButton.addEventListener('click', () => {
  overlay.classList.add('show');
});

// Hide the Feedback Form
function hideFeedbackForm() {
  overlay.classList.remove('show');
}

// Close on clicking the close button
closeButton.addEventListener('click', hideFeedbackForm);

// Close on clicking outside the form
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    hideFeedbackForm();
  }
});

// Function to create and show a custom pop-up
function showCustomPopup(message, type) {
  const popup = document.createElement('div');
  popup.className = `customPopup ${type}`;
  popup.innerText = message;

  document.body.appendChild(popup);

  // Trigger animation
  setTimeout(() => {
    popup.style.opacity = '1';
    popup.style.transform = 'translateY(0)';
  }, 100);

  // Hide the popup after 6 seconds (Calculating in ms, 1s=1000ms)
  setTimeout(() => {
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(20px)';
    setTimeout(() => popup.remove(), 500); //500 or 500ms(0.5s) is the fading time
  }, 6000);
}

// Feedback Submission (Custom Popup Version)
sendFeedbackButton.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Validation: Check if email is empty
  if (!email) {
    showCustomPopup('Opps! Email Required', 'error');
    return;
  }
  // Validation: Check if Feedback is empty
  if (!message) {
    showCustomPopup('Feedback Required!', 'error');
    return;
  }

  // Validation: Check if email contains both "@" and "."
  if (!email.includes('@') || !email.includes('.')) {
    showCustomPopup('Invalid email format!', 'error');
    return;
  }


  // Validation: Ensure message contains at least one alphabet
  if (!/[a-zA-Z]/.test(message)) {
    showCustomPopup('Your feedback should be in words!', 'error2');
    return;
  }

// Validation: Ensure message contains at least 3 words
  if (message.trim().split(/\s+/).length < 3) {
    showCustomPopup('Opps!Minimum of 3 words required!', 'error2');
    return;
}

// Validation: Check if email contains spaces
if (email.includes(' ')) {
  showCustomPopup('Email should not contain spaces!', 'error2');
  return;
}

  // Success message if all validations pass
  showCustomPopup('Feedback sent! Thank you👏🏽🥰', 'success');
  hideFeedbackForm(); // Hide the form after submission
});

// Ensure form is hidden on page load
window.addEventListener('DOMContentLoaded', () => {
  hideFeedbackForm();
});






// THIS CODE HANDLES THE CHANGE PASSWORD DIALOGUE // THIS CODE HANDLES THE CHANGE PASSWORD DIALOGUE// THIS CODE HANDLES THE CHANGE PASSWORD DIALOGUE
const pOverlay = document.getElementById('pOverlay');
const passButton = document.querySelector('.passButton'); // Trigger
const closeModal = document.getElementById('closeModal');
const changePasswordBtn = document.getElementById('changePasswordBtn');

// Show the Password Form
passButton.addEventListener('click', () => {
  pOverlay.classList.add('show');
});

// Hide the Password Form
function hidePasswordForm() {
  pOverlay.classList.remove('show');
}

// Close on clicking the close button
closeModal.addEventListener('click', hidePasswordForm);

// Close on clicking outside the form
pOverlay.addEventListener('click', (event) => {
  if (event.target === pOverlay) {
    hidePasswordForm();
  }
});





// Feedback Submission (Custom Popup Version)
changePasswordBtn.addEventListener('click', () => {
  const cuPass = document.getElementById('cuPass').value.trim();
  const nPass = document.getElementById('nPass').value.trim();
  const coPass = document.getElementById('coPass').value.trim();

  // Validation: Check if Current Password is empty
  if (!cuPass) {
    showCustomPopup('Current Password Cannot Be Empty', 'error2');
    return;
  }

  // Validation: Check if New Password is empty
  if (!nPass) {
    showCustomPopup('New Password Cannot Be Empty', 'error2');
    return;
  }

  // Validation: Check if Confirm Password is empty
  if (!coPass) {
    showCustomPopup('Confirm Password Cannot Be Empty', 'error2');
    return;
  }

  // Success message if all validations pass
  showCustomPopup('Password Changed Successfully!!👏🏽', 'success2');
  hidePasswordForm(); // Hide the form after submission
});

// Ensure form is hidden on page load
window.addEventListener('DOMContentLoaded', () => {
  hidePasswordForm();
});


// TOGGLE PASSWORD VISIBILITY // TOGGLE PASSWORD VISIBILITY// TOGGLE PASSWORD VISIBILITY// TOGGLE PASSWORD VISIBILITY

document.addEventListener("DOMContentLoaded", function () {
    function togglePassword(buttonId, inputId) {
        const button = document.getElementById(buttonId);
        const input = document.getElementById(inputId);

        if (!button || !input) {
            console.error(`Element not found: ${buttonId} or ${inputId}`);
            return;
        }

        button.addEventListener("click", function () {
            input.type = input.type === "password" ? "text" : "password";
            this.textContent = input.type === "password" ? "👁️" : "👀";
        });
    }

    // Apply toggle functionality to all password fields
    togglePassword("togglePassword", "nPass");
    togglePassword("toggleCuPassword", "cuPass");
    togglePassword("toggleConfirmPassword", "coPass");
});





// THIS CODE HANDLES THE VIEW PROFILE DIALOGUE// THIS CODE HANDLES THE VIEW PROFILE DIALOGUE// THIS CODE HANDLES THE VIEW PROFILE DIALOGUE
const proOverlay = document.getElementById('proOverlay');
const pButton = document.querySelector('.pButton'); // Trigger
const closeProModal = document.getElementById('closeProModal');

// Show the Profile Form
pButton.addEventListener('click', () => {
  proOverlay.classList.add('show');
});

// Hide the Profile Form
function hideProfileForm() {
  proOverlay.classList.remove('show');
}

// Close on clicking the close button
closeProModal.addEventListener('click', hideProfileForm);

// Close on clicking outside the form
proOverlay.addEventListener('click', (event) => {
  if (event.target === proOverlay) {
    hideProfileForm();
  }
});



// document.addEventListener("DOMContentLoaded", function() {
//   const uploadButton = document.querySelector('.uploadLink');
//   const fileInput = document.getElementById('fileInput');
//   const profileImage = document.querySelector('.profileImage');

//   // Open file explorer when clicking "Upload image"
//   uploadButton.addEventListener('click', function() {
//       fileInput.click();
//   });

//   // When a file is selected, update the profile picture
//   fileInput.addEventListener('change', function(event) {
//       const file = event.target.files[0];
//       if (file) {
//           const reader = new FileReader();
//           reader.onload = function(e) {
//               profileImage.src = e.target.result; // Update image source
//           };
//           reader.readAsDataURL(file); // Convert file to Base64 URL
//       }
//   });
// });


document.addEventListener("DOMContentLoaded", function() {
  const uploadButton = document.querySelector('.uploadLink');
  const fileInput = document.getElementById('fileInput');
  const profileImage = document.querySelector('.profileImage');
  const profilePic = document.querySelector('.profilePic'); // New frame

  // Open file explorer when clicking "Upload image"
  uploadButton.addEventListener('click', function() {
      fileInput.click();
  });

  // When a file is selected, update both images
  fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              profileImage.src = e.target.result; // Update first image
              profilePic.src = e.target.result;   // Update second image
          };
          reader.readAsDataURL(file); // Convert file to Base64 URL
      }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const fileUpload = document.getElementById("fileUpload");
  const chooseButton = document.getElementById("chooseButton");
  const filePlaceholder = document.getElementById("filePlaceholder");
  const uploadBox = document.querySelector(".upload-box");

  // When "Choose" button is clicked, trigger file selection
  chooseButton.addEventListener("click", function () {
      fileUpload.click();
  });

  // When a file is selected
  fileUpload.addEventListener("change", function (event) {
      if (event.target.files.length > 0) {
          const fileName = event.target.files[0].name;
          
          // Ensure only PDF is accepted
          if (!fileName.endsWith(".pdf")) {
              alert("Only PDF files are allowed!");
              fileUpload.value = ""; // Reset file input
              return;
          }

          // Update placeholder with file name
          filePlaceholder.textContent = fileName;

          // Switch positions
          uploadBox.classList.add("uploaded");
      }
  });
});



// OPEN TIMEHISTORY PAGE AND SIGNIN PAGE ON NEW TABS

// document.addEventListener("DOMContentLoaded", function() {
//   const triggerDiv = document.getElementById("drop2Of1");

//   triggerDiv.addEventListener("click", function() {
//     window.open("TimeHistory.html", "_blank"); // Opens in a new tab
//   });
// });



// document.addEventListener("DOMContentLoaded", function() {
//   const triggerDiv = document.getElementById("drop2of2");

//   triggerDiv.addEventListener("click", function() {
//     window.open("SignIn.html", "_blank"); // Opens in a new tab
//   });
// });



// OPEN TIMEHISTORY PAGE AND SIGNIN PAGE ON SAME TAB
document.addEventListener("DOMContentLoaded", function() {
  const triggerDiv = document.getElementById("drop2Of1");

  triggerDiv.addEventListener("click", function() {
    window.location.href = "TimeHistory.html"; // Opens in the same tab
  });
});



document.addEventListener("DOMContentLoaded", function() {
  const triggerDiv = document.getElementById("drop2of2");
  const triggerDiv2 = document.getElementById("ancillaryButton");


  triggerDiv.addEventListener("click", function() {
    window.location.href = "SignIn.html"; // Opens in the same tab
  });
  
  triggerDiv2.addEventListener("click", function() {
    window.location.href = "TimeSheet.html"; // Opens in the same tab
  });
});
















