// OPENS HOMELISTVIEW ON NEW TAB ON CLICKING LOGIN BUTTON

document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.lButton');
  
  if (button) {
    button.addEventListener('click', function () {
      window.location.href = '/frontend/SUPERVISOR VIEW/homeListView.html';
    });
  }
});
