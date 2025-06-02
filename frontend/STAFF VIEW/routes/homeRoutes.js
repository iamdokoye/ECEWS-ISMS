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
        let targetURL = "homeGrid.html";

        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});

$(document).ready(function () {

    $("#viewLog").click(function (e) {
        e.preventDefault(); // Prevent default navigation
        let targetURL = "log.html";

        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});

$(document).ready(function () {

    $("#goHome").click(function (e) {
        e.preventDefault(); // Prevent default navigation
        let targetURL = "homeGrid.html";

        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});