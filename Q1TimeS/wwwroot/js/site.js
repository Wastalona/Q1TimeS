document.addEventListener("DOMContentLoaded", function () {
    var adminBlock = document.getElementById("admin-block");
    var generalBlock = document.getElementById("general-block");

    adminBlock.addEventListener("click", function () {
        window.location.href = "/admin/auth";
    });

    generalBlock.addEventListener("click", function () {
        window.location.href = "/general/surveyspage";
    });
});