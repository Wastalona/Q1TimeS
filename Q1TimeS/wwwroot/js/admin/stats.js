const token = getTokenFromCookie();

async function toggleRun(surveyId) {
    const response = await fetch(`/admin/toggletimer?surveyId=${surveyId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (response.ok) {
        const result = await response.json();
        if (result.isRunning)
            startTimer(surveyId);
        else {
            stopTimer();
        }
    } else {
        alert("Ошибка при переключении таймера");
    }
}

let timerInterval;
function startTimer(surveyId) {
    const cutoffTime = document.getElementById("remaining-time").dataset.cutoffTime;
    if (!cutoffTime) 
        return;

    const endTime = new Date().getTime() + cutoffTime * 1000;
    timerInterval = setInterval(async () => {
        const remainingTime = endTime - new Date().getTime();
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            document.getElementById("remaining-time").innerHTML = "div";
            document.getElementById("remaining-time").innerText = "Время истекло!";

            try {
                const response = await fetch(`/admin/clearsurveyusers?surveyId=${surveyId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (response.ok)
                    window.signalRConnection.clearConnection(await response.text());
            } catch (error) {
                alert("Ошибка при очистке пользователей опроса.");
            }
            location.reload();
        } else {
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            document.getElementById("remaining-time").innerText = `${hours} ч ${minutes} мин ${seconds} сек`;
            document.getElementById("remaining-time").classList.add('time-out');
        }
    }, 1000);
}


function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById("remaining-time").innerText = "";
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

            console.log(question ? question.QuestionText : question);
            console.log(answer ? answer.AnswerText : answer);

            cell1.innerHTML = question ? question.QuestionText : "Неизвестный вопрос";
            cell2.innerHTML = answer ? answer.AnswerText : "Неизвестный ответ";
        }
    });
}