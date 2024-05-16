const AUTH_URL = "/admin/auth";
const WORKSHOP_URL = "/admin/workshop";

// Function for obtaining a token from a cookie
function getTokenFromCookie() {
    const tokenRow = document.cookie.split('; ').find(row => row.startsWith('token='));
    return tokenRow ? tokenRow.split('=')[1] : null;
}

// Function for authorization verification
async function checkAuthorization() {
    try {
        const token = getTokenFromCookie();

        // Make a response
        const response = await fetch(WORKSHOP_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok)
            window.location.href = WORKSHOP_URL;

    } catch (error) {
        // Handle authorization errors
        alert("При проверке авторизации произошла ошибка.");
    }
}

// A function for sending an authentication request
async function submitLogin() {
    try {
        const response = await fetch("/admin/auth", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: document.getElementById("password").value
            })
        });

        if (response.ok) {
            window.location.href = "/admin/workshop";
        } else {
            throw new Error("Неверный пароль");
        }
    } catch (error) {
        alert("Произошла ошибка при аутентификации.");
    }
}

// A function to change the visibility of the password
function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var toggleIcon = document.getElementById("toggleIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("bx-show");
        toggleIcon.classList.add("bx-hide");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("bx-hide");
        toggleIcon.classList.add("bx-show");
    }
}

window.addEventListener('load', checkAuthorization);