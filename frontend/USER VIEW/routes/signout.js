// OPENS LOGIN PAGE ON NEW TAB ON CLICKING SIGNOUT BUTTON

document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.signout');
  
  if (button) {
    button.addEventListener('click', function () {
      window.location.href = '/frontend/LOGIN/login.html';
    });
  }
});
