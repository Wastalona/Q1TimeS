const connection = new signalR.HubConnectionBuilder()
    .withUrl("/surveyHub")
    .build();

connection.start()
    .then(() => console.log("Connected to SignalR"))
    .catch(err => console.error(err));

function joinSurvey(code) {
    connection.invoke("JoinSurvey", code)
        .then(() => console.log(`Joined survey ${code}`))
        .catch(err => console.error(err));
}

function leaveSurvey(code) {
    connection.invoke("LeaveSurvey", code)
        .then(() => console.log(`Left survey ${code}`))
        .catch(err => console.error(err));
}

connection.on("UpdateUserCount", count => {
    document.getElementById("userCount").innerText = `Users connected: ${count}`;
});

connection.on("SurveyFull", () => {
    alert("Survey is full and cannot accept more participants.");
});