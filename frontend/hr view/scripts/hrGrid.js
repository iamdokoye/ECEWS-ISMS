

$(document).ready(function () {
    function applyActiveStyles(button) {
      $(".allStudents").css({
        "background-color": "",
        "border": "",
        "color": ""
      });
  
      button.css({
        "background-color": "#FFFFFF",
        "border": "1px solid #096D49",
        "color": "#096D49"
      });
    }
  
    // Set first button active on load
    const firstBtn = $(".allStudents").first();
    applyActiveStyles(firstBtn);
    $(".gridContain").hide();
    $($(firstBtn).data("target")).show();
  
    // Handle button click
    $(".allStudents").click(function () {
      applyActiveStyles($(this));
  
      // Hide all sections
      $(".gridContain").hide();
  
      // Show target section
      const target = $(this).data("target");
      $(target).fadeIn(200);
    });
  });

  $(document).ready(function () {
    // Open only the clicked card's modal
    $(".dotsThree").click(function (e) {
      e.stopPropagation(); // Prevent bubbling
  
      // First close any open modals
      $(".editModal").fadeOut(200);
  
      // Open the modal related to the clicked .editStud
      $(this).closest(".studentsCard").find(".editModal").fadeIn(200);
    });
  
    // Click outside any modal closes all modals
    $(document).click(function () {
      $(".editModal").fadeOut(200);
    });
  
    // Prevent click inside modal from closing it
    $(".editModal").click(function (e) {
      e.stopPropagation();
    });
  });

  $(document).ready(function () {
    // Open Modal
    $(".deactivate").click(function () {
        $("#overlay2").fadeIn(200); // Show overlay
        $("#confirmModal").fadeIn(200); // Show modal
    });

    // Close Modal
    $("#closeDeactivateModal").click(function () {
        $("#confirmModal").fadeOut(200);
        $("#overlay2").delay(100).fadeOut(200); // Slight delay for smoother transition
    });

        // Close Modal
        $("#cancelBtn").click(function () {
            $("#confirmModal").fadeOut(200);
            $("#overlay").fadeOut(200);
            $("#overlay2").delay(100).fadeOut(200); // Slight delay for smoother transition
        });

    // Close Modal When Clicking Outside the Modal (on the overlay itself)
    $("#overlay2").click(function (e) {
        if (e.target === this) {
            $("#confirmModal").fadeOut(200);
            $("#overlay2").delay(100).fadeOut(200);
        }
    });
});

$(document).ready(function () {
    // Open Modal
    $("#proceedBtn").click(function () {
        $("#overlay4").fadeIn(200); // Show overlay
        $("#successModal2").fadeIn(200); // Show modal
    });

    // Close Modal
    $("#okayBtn2").click(function () {
        $("#successModal2").fadeOut(200);
        $("#overlay2").fadeOut(200);
        $("#overlay4").delay(100).fadeOut(200); // Slight delay for smoother transition
    });

    // Close Modal When Clicking Outside the Modal (on the overlay itself)
    $("#overlay4").click(function (e) {
        if (e.target === this) {
            $("#successModal2").fadeOut(200);
            $("#overlay4").delay(100).fadeOut(200);
        }
    });
});  

$(document).ready(function () {
  $("#logoutDropdown").click(function (e) {
      e.stopPropagation();
      $("#logout").toggleClass("show");
  });

  $(document).click(function (e) {
      if (!$(e.target).closest("#logoutDropdown, #logout").length) {
          $("#logout").removeClass("show");
      }
  });
});

  