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


