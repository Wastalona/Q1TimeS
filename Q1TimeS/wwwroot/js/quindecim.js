const AUTH_URL = "/admin/auth";
const WORKSHOP_URL = "/admin/workshop";

// Function for authorization verification
async function checkAuthorization() {
    try {
        const token = getTokenFromCookie();
        if (!token) {
            window.location.href = AUTH_URL;
            return;
        }
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
        else if (response.status === 401)
            window.location.href = AUTH_URL;
        else
            throw new Error("Ошибка проверки авторизации.");
        
    } catch (error) {
        // Handle authorization errors
        alert("При проверке авторизации произошла ошибка.");
    }
}

// Function to add click event handlers to elements
function addClickHandler(elementId, url) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener("click", () => {
            if (elementId === "admin-block") {
                checkAuthorization();
            } else {
                window.location.href = url;
            }
        });
    }
}

// Adding click event handlers
addClickHandler("admin-block", AUTH_URL);
addClickHandler("general-block", "/general/surveyspage");
