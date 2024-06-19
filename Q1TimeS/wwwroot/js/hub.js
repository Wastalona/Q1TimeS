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
        document.getElementById('alert-message').innerHTML = "� ������ ��� ����� � �� �� ����� ������� ������ ����������.";
    }
});

function joinSurvey(code) {
    try {
        connection.invoke("JoinSurvey", code);
    } catch {
        alert("������ �������������");
    }
}

function leaveSurvey(code) {
    try {
        connection.invoke("LeaveSurvey", code);
    } catch {
        alert("������ ������������");
    }
}

function clearConnection(code) {
    try {
        connection.invoke("ClearConnection", code);
    } catch {
        alert("������ �������");
    }
}

window.signalRConnection = {
    connection,
    joinSurvey,
    leaveSurvey,
    clearConnection
};
