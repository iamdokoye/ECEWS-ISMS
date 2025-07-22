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


