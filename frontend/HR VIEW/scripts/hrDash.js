$(document).ready(function () {
    // Open Modal
    $("#addNewStudent").click(function () {
        $("#overlay").fadeIn(200); // Show overlay
        $("#addModal").fadeIn(200); // Show modal
    });

    // Close Modal
    $("#closeModal").click(function () {
        $("#addModal").fadeOut(200);
        $("#overlay").delay(100).fadeOut(200); // Slight delay for smoother transition
    });

    // Close Modal When Clicking Outside the Modal (on the overlay itself)
    $("#overlay").click(function (e) {
        if (e.target === this) {
            $("#addModal").fadeOut(200);
            $("#overlay").delay(100).fadeOut(200);
        }
    });
});

$(document).ready(function () {
    const $dropdown = $("#unitDrop");
    const $toggleBtn = $("#caretdown");
    const $inputField = $("#unitDisplay input");

    // Toggle dropdown on caret click
    $toggleBtn.on("click", function (e) {
        e.stopPropagation(); // Prevent closing from doc click
        $dropdown.fadeToggle(200);
    });

    // Handle unit selection
    $dropdown.on("click", ".unitLIst", function (e) {
        e.stopPropagation();
        const selectedText = $(this).text().trim();
        $inputField.val(selectedText); // Fill input field
        $dropdown.fadeOut(200);        // Hide dropdown
    });

    // Close dropdown when clicking outside
    $(document).on("click", function () {
        $dropdown.fadeOut(200);
    });

    // Prevent dropdown from closing if you click inside it
    $dropdown.on("click", function (e) {
        e.stopPropagation();
    });
});


$(document).ready(function () {
    // Open Modal
    $("#saveBtn").click(function () {
        $("#overlay2").fadeIn(200); // Show overlay
        $("#confirmModal").fadeIn(200); // Show modal
    });

    // Close Modal
    $("#closeConfirmModal").click(function () {
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
        $("#overlay3").fadeIn(200); // Show overlay
        $("#successModal").fadeIn(200); // Show modal
    });

    // Close Modal
    $("#okayBtn").click(function () {
        $("#successModal").fadeOut(200);
        $("#overlay2").fadeOut(200);
        $("#overlay").fadeOut(200);
        $("#overlay3").delay(100).fadeOut(200); // Slight delay for smoother transition
    });

    // Close Modal When Clicking Outside the Modal (on the overlay itself)
    $("#overlay3").click(function (e) {
        if (e.target === this) {
            $("#successModal").fadeOut(200);
            $("#overlay3").delay(100).fadeOut(200);
        }
    });
});

$(document).ready(function () {
    const $dropdown = $("#superUnitDrop");
    const $toggleBtn = $("#superUnit");
    const $inputField = $("#superUnitDisplay input");

    // Toggle dropdown on caret click
    $toggleBtn.on("click", function (e) {
        e.stopPropagation(); // Prevent closing from doc click
        $dropdown.fadeToggle(200);
    });

    // Handle unit selection
    $dropdown.on("click", ".unitLIst", function (e) {
        e.stopPropagation();
        const selectedText = $(this).text().trim();
        $inputField.val(selectedText); // Fill input field
        $dropdown.fadeOut(200);        // Hide dropdown
    });

    // Close dropdown when clicking outside
    $(document).on("click", function () {
        $dropdown.fadeOut(200);
    });

    // Prevent dropdown from closing if you click inside it
    $dropdown.on("click", function (e) {
        e.stopPropagation();
    });
});

$(document).ready(function () {
    const $dropdown = $("#superDrop");
    const $toggleBtn = $("#super");
    const $inputField = $("#superDisplay input");

    // Toggle dropdown on caret click
    $toggleBtn.on("click", function (e) {
        e.stopPropagation(); // Prevent closing from doc click
        $dropdown.fadeToggle(200);
    });

    // Handle unit selection
    $dropdown.on("click", ".unitLIst", function (e) {
        e.stopPropagation();
        const selectedText = $(this).text().trim();
        $inputField.val(selectedText); // Fill input field
        $dropdown.fadeOut(200);        // Hide dropdown
    });

    // Close dropdown when clicking outside
    $(document).on("click", function () {
        $dropdown.fadeOut(200);
    });

    // Prevent dropdown from closing if you click inside it
    $dropdown.on("click", function (e) {
        e.stopPropagation();
    });
});

$(document).ready(function () {
    // Open Modal
    $("#assignSupervisor").click(function () {
        $("#superOverlay").fadeIn(200); // Show overlay
        $("#assignSuperModal").fadeIn(200); // Show modal
    });

    // Close Modal
    $("#closeSuperModal, #assignBtn").click(function () {
        $("#assignSuperModal").fadeOut(200);
        $("#superOverlay").delay(100).fadeOut(200); // Slight delay for smoother transition
    });

    // Close Modal When Clicking Outside the Modal (on the overlay itself)
    $("#superOverlay").click(function (e) {
        if (e.target === this) {
            $("#assignSuperModal").fadeOut(200);
            $("#superOverlay").delay(100).fadeOut(200);
        }
    });
});