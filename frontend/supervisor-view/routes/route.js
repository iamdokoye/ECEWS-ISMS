$(document).ready(function () {

    $("#viewBtn").click(function (e) {
        e.preventDefault(); // Prevent default navigation
        let targetURL = "homeListView.html";

        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});

$(document).ready(function () {

    $("#dashboardBtn").click(function (e) {
        e.preventDefault(); // Prevent default navigation
        let targetURL = "homeListView.html";

        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});

$(document).ready(function () {

    $(".studentsCard").click(function (e) {
        e.preventDefault(); // Prevent default navigation
        let targetURL = "studentProfile.html";

        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});

$(document).ready(function () {

    $(".backArrow").click(function (e) {
        e.preventDefault(); // Prevent default navigation
        let targetURL = "studentLog.html";

        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});

$(document).ready(function () {

    $(".delete").click(function (e) {
        e.preventDefault(); // Prevent default navigation
        let targetURL = "studentProfile.html";

        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});

$(document).ready(function () {

    $("#logout").click(function (e) {
        e.preventDefault(); // Prevent default navigation
        let targetURL = "/frontend/userlogin/login.html";
        sessionStorage.removeItem('token'); // Clear token from sessionStorage
        
        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});