const token = getTokenFromCookie();
const timers = {};
const timerElement = document.getElementById("remaining-time");
timerElement.classList.add('time-out');

function updateTimer(surveyId, isRunning, endTime) {
    if (timers[surveyId]) {
        clearInterval(timers[surveyId]);
        delete timers[surveyId];
    }

    if (isRunning) {
        const end = new Date(endTime);
        timers[surveyId] = setInterval(() => {
            const now = new Date();
            const remainingTime = end - now;

            if (remainingTime <= 0) {
                clearInterval(timers[surveyId]);
                delete timers[surveyId];
                timerElement.textContent = "Время истекло";
                toggleRun(surveyId);
            } else {
                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                timerElement.textContent = `${hours}ч ${minutes}м ${seconds}с`;
            }
        }, 1000);
    } else {
        timerElement.textContent = "Таймер остановлен";
    }
}

connection.on("UpdateTimer", (surveyId, isRunning, endTime) => {
    updateTimer(surveyId, isRunning, endTime);
});

connection.on("SendAnswers", () => {
    location.reload();
});

async function toggleRun(surveyId) {
    const response = await fetch(`/admin/toggletimer?surveyId=${surveyId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok)
        alert("Ошибка при переключении таймера");
}

function updateTable() {
    var userId = document.getElementById("userSelect").value;
    var userAnswers = JSON.parse(document.getElementById("userAnswersData").textContent);
    var questions = JSON.parse(document.getElementById("questionsData").textContent);
    var answers = JSON.parse(document.getElementById("answersData").textContent);

    var tableBody = document.getElementById("answersTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    userAnswers.forEach(function (userAnswer) {
        if (userAnswer.UserId == userId) {
            var question = questions.find(q => q.QuestionId == userAnswer.QuestionId);
            var answer = answers.find(a => a.AnswerId == userAnswer.AnswerId);

            var row = tableBody.insertRow();
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);

            cell1.innerHTML = question ? question.QuestionText : "Неизвестный вопрос";
            cell2.innerHTML = answer ? answer.AnswerText : "Неизвестный ответ";
        }
    });
}

function download(extension, id) {
    fetch(`/Admin/ExportFile?key=${id}&extension=${extension}`, {
        method: 'GET',
    })
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке файла.');
            }
            return response.blob();
        })
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `survey_answers.${extension}`;
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            alert('Не удалось загрузить файл.');
        });
}

async function clear_answers(surveyId) {
    if (!confirm("Вы уверены в своих действиях?"))
        return;

    try {
        const response = await fetch(`/admin/clearsurveyusers?surveyId=${surveyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.ok) {
            const surveyCode = await response.text();
            window.signalRConnection.clearConnection(surveyCode);
        }
    } catch (error) {
        alert("Ошибка при очистке пользователей опроса.");
    }
    location.reload();
}

async function checkTimer(surveyId) {
    const response = await fetch(`/admin/getTimerData?surveyId=${surveyId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    const data = await response.json();

    if (data.endTime)
        updateTimer(surveyId, true, data.endTime);
    else
        timerElement.textContent = "Таймер остановлен";
}

window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('key');
    checkTimer(surveyId);
});