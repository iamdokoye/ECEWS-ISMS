

document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.signout');
 
  if (button) {
    button.addEventListener('click', function () {
      window.location.href = '/frontend/LOGIN/login.html';
    });
  }
});














// OPENS STUDENTS LOG ON CLICKING A STUDENTS RECORD ARRANGED IN ROWS

document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.tableRows');

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      window.location.href = 'log.html';
    });
  });
});


