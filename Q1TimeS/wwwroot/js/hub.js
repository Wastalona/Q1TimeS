const connection = new signalR.HubConnectionBuilder().withUrl("/surveyHub").build();

connection.start().catch(err => console.error('Error starting SignalR connection:', err));

connection.on("UpdateUserCount", count => {
    if (document.getElementById("userCount")) {
        document.getElementById("userCount").innerText = `Users connected: ${count}`;
    }
});

connection.on("SurveyFull", () => {
    if (document.getElementById('alert-container') && document.getElementById('alert-message')) {
        goUp();
        document.getElementById('alert-container').classList.remove('d-none');
        document.getElementById('alert-message').innerHTML = "В опросе нет места и он не может принять больше участников.";
    }
});

function joinSurvey(code) {
    try {
        connection.invoke("JoinSurvey", code);
    } catch {
        alert("Ошибка присоединения");
    }
}

function leaveSurvey(code) {
    try {
        connection.invoke("LeaveSurvey", code);
    } catch {
        alert("Ошибка отсоединения");
    }
}

function clearConnection(code) {
    try {
        connection.invoke("ClearConnection", code);
    } catch {
        alert("Ошибка очистки");
    }
}

window.signalRConnection = {
    connection,
    joinSurvey,
    leaveSurvey,
    clearConnection
};
