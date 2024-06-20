const alertContainer = document.getElementById('alert-container');
const alertMessage = document.getElementById('alert-message');

async function connectSurvey(event) {
    event.preventDefault();
    const code = document.getElementById('s-code').value;
    const nick = document.getElementById('s-nickname').value;
    document.getElementById('s-code').value = null;
    document.getElementById('s-nickname').value = null;

    try {
        const response = await fetch(`/user/ConnectWithCode?code=${code}&nickname=${nick}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            await window.signalRConnection.joinSurvey(code);
        } else {
            const errorText = await response.text();
            throw new Error(errorText);
        }
    } catch (error) {
        goUp();
        alertContainer.classList.remove('d-none');
        alertMessage.innerHTML = error.message || "Ошибка при подключении к опросу.";
    }
}