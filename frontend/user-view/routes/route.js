
$(document).ready(function () {
  $("#signDrop").click(function (e) {
    e.preventDefault(); // Prevent default navigation
    let targetURL = "/frontend/userlogin/login.html";

    $("body").fadeOut(300, function () {
      window.location.href = targetURL; // Navigate after fade-out
    });
  });
});

$(document).ready(function () {
  $(".profileDrop").click(function (e) {
    e.preventDefault(); // Prevent default navigation
    let targetURL = "/frontend/user-view/studentProfile.html";

    $("body").fadeOut(300, function () {
      window.location.href = targetURL; // Navigate after fade-out
    });
  });
});

$(document).ready(function () {
    // Open Modal
    $(".pIcon").click(function () {
        $(".dropDownMenu").fadeIn(200); // Show overlay 
    });
});

$(document).ready(function () {

  $(".backArrow").click(function (e) {
    e.preventDefault(); // Prevent default navigation
    let targetURL = "/frontend/user-view/studentCalendar.html";

    $("body").fadeOut(300, function () {
      window.location.href = targetURL; // Navigate after fade-out
    });

  });
});

$(document).ready(function () {

  $("#logout").click(function (e) {
    e.preventDefault(); // Prevent default navigation
    let targetURL = "/frontend/userlogin/login.html";
    sessionStorage.removeItem('token');
    
    $("body").fadeOut(300, function () {
      window.location.href = targetURL; // Navigate after fade-out
    });
  });
});