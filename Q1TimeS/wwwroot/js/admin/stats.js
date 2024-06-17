let checkbox = document.getElementById("clock-checkbox");

function toggleRun() {
    if (checkbox.checked) {
        if (confirm("Вы уверены, что хотите отключить опрос?")) {
            checkbox.checked = false;
            alert("Опрос отключен");
        } else {
            checkbox.checked = true;
        }
    }
    else {
        alert("Опрос запущен");
    }
}