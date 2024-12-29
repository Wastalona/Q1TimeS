connection.on("ShowSurvey", () => {
    location.reload();
});

function updateAnswers() {
    connection.invoke("SendAnswers");
}