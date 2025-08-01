// signout.js
$(document).ready(function() {
  $('#signDrop').on('click', function() {
    // Clear all localStorage data
    // localStorage.clear();
    
    // Redirect to login page
    window.location.href = '/frontend/userlogin/login.html';
  });
});
