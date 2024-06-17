const alertContainer = document.getElementById('alert-container');
const alertMessage = document.getElementById('alert-message');

const connection = new signalR.HubConnectionBuilder().withUrl("/surveyHub").build();

connection.start().catch(err => console.error('Error starting SignalR connection:', err));

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
            await connection.invoke("JoinSurvey", code);
            console.log(`Joined survey ${code}`);
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

async function leaveSurvey(code) {
    try {
        await connection.invoke("LeaveSurvey", code);
        console.log(`Left survey ${code}`);
    } catch (err) {
        console.error('Error leaving survey:', err);
    }
}

connection.on("UpdateUserCount", count => {
    document.getElementById("userCount").innerText = `Users connected: ${count}`;
});

connection.on("SurveyFull", () => {
    goUp();
    alertContainer.classList.remove('d-none');
    alertMessage.innerHTML = "В опросе нет места и он не может принять больше участников.";
});
