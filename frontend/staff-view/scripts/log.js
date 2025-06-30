$(document).ready(function () {

    $("#goHome").click(function (e) {
        e.preventDefault(); // Prevent default navigation
        let targetURL = "homeGrid.html";

        $("body").fadeOut(300, function () {
            window.location.href = targetURL; // Navigate after fade-out
        });

    });
});

// ---------Script for month buttons
$(document).ready(function () {
    $('.btnContain').on('click', function () {
        $('.btnContain').removeClass('activeMonth'); // Remove active from all
        $(this).addClass('activeMonth'); // Add active to clicked one
    });
});

// -------------Script for week buttons-----  

$(document).ready(function () {
    $('.weekBtn').click(function () {
        // Reset styles for all week buttons
        $('.weekBtn').css({
            'background-color': '#FFFFFF',
            'border': '1px solid #F5F5F5'
        });

        // Apply active style to the clicked week
        $(this).css({
            'background-color': '#6BA79233',
            'border': '1px solid #096D49'
        });
    });
});

$(document).ready(function () {
    // Toggle dropdown on trigger click
    $("#monthContain").click(function (e) {
        e.stopPropagation(); // Prevent click from bubbling to body
        $("#dropdownMonths").fadeToggle(200); // Toggle dropdown visibility
    });

    // Close dropdown if clicking outside of it
    $(document).click(function (e) {
        if (!$(e.target).closest("#monthContain, #dropdownMonths").length) {
            $("#dropdownMonths").fadeOut(200);
        }
    });
    // Replace .month1 content when a .dropped item is clicked
    $(".dropdownMonths .dropped").click(function (e) {
        e.stopPropagation(); // Prevent it from triggering the document click
        var selectedMonth = $(this).text();
        $(".month1").text(selectedMonth); // Replace the displayed month
        $("#dropdownMonths").fadeOut(200); // Hide dropdown
    });
});

$(document).ready(function () {
    // Handle click on week buttons
    $('.week1Cont p').click(function () {
        // Remove active styles from all
        $('.week1Cont p').css({
            'border-bottom': 'none',
        });

        // Apply active style to clicked
        $(this).css({
            'border-bottom': '1px solid #096D49',
        });

        // Get selected week text
        var selectedWeek = $(this).text().trim();

        // Update the week header
        $('#weekHead').text(selectedWeek);
    });
});

$(document).ready(function () {
    $(".accordionHeader").click(function () {
        // Toggle active state for clicked item
        const item = $(this).closest(".accordionItem");
        item.toggleClass("active");

        // Optionally close other open accordions
        $(".accordionItem").not(item).removeClass("active");
    });
});


