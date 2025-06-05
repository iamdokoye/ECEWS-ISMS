

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