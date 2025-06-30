

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