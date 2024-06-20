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