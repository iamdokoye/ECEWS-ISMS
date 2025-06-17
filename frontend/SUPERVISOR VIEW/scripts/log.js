// OPENS LOGIN PAGE ON NEW TAB ON CLICKING SIGNOUT BUTTON

document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.handler');
 
  if (button) {
    button.addEventListener('click', function () {
      window.location.href = 'studentProfile.html';
    });
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.homeBtn');
 
  if (button) {
    button.addEventListener('click', function () {
      window.location.href = 'homeListView.html';
    });
  }
});















// Select Elements
const overlay = document.getElementById('overlay');
const insightButton = document.querySelector('.sign-button'); // Trigger
const closeButton = document.getElementById('closeBtn');
const sendFeedbackButton = document.getElementById('sendFeedback');

// Signature Pad Setup
const canvas = document.getElementById('signatureCanvas');
const clearSignatureBtn = document.getElementById('clearSignature');
const saveSignatureBtn = document.getElementById('saveSignature');

let signaturePad;

function resizeCanvas() {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
}

function initializeSignaturePad() {
  resizeCanvas();
  signaturePad = new SignaturePad(canvas);
}

// Show the Feedback Form
insightButton.addEventListener('click', () => {
  overlay.classList.add('show');
  initializeSignaturePad();
});

// Hide the Feedback Form
function hideFeedbackForm() {
  overlay.classList.remove('show');
  if (signaturePad) {
    signaturePad.clear();
  }
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

  // Hide the popup after 6 seconds
  setTimeout(() => {
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(20px)';
    setTimeout(() => popup.remove(), 500);
  }, 6000);
}

// Feedback Submission (Custom Popup Version)
sendFeedbackButton.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!email) {
    showCustomPopup('Opps! Email Required', 'error');
    return;
  }
  if (!message) {
    showCustomPopup('Feedback Required!', 'error');
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    showCustomPopup('Invalid email format!', 'error');
    return;
  }
  if (!/[a-zA-Z]/.test(message)) {
    showCustomPopup('Your feedback should be in words!', 'error2');
    return;
  }
  if (message.trim().split(/\s+/).length < 3) {
    showCustomPopup('Opps!Minimum of 3 words required!', 'error2');
    return;
  }
  if (email.includes(' ')) {
    showCustomPopup('Email should not contain spaces!', 'error2');
    return;
  }

  // Validate Signature
  if (!signaturePad || signaturePad.isEmpty()) {
    showCustomPopup('Signature Required!', 'error');
    return;
  }

  // If needed, this is the Base64 image string:
  const signatureDataURL = signaturePad.toDataURL();
  console.log("Saved Signature:", signatureDataURL);

  showCustomPopup('Feedback sent! Thank you👏🏽🥰', 'success');
  hideFeedbackForm(); // Hide the form after submission
});

// Clear Signature
clearSignatureBtn.addEventListener('click', () => {
  if (signaturePad) {
    signaturePad.clear();
  }
});

// Ensure form is hidden on page load
window.addEventListener('DOMContentLoaded', () => {
  hideFeedbackForm();
});


