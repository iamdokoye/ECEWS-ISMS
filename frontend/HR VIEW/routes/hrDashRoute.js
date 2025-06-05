$(document).ready(function () {

    $("#viewBtn").click(function (e) {
        e.preventDefault(); // Prevent default navigation
        let targetURL = "homeGrid.html";

        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});