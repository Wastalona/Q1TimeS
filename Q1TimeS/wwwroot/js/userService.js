async function connect(surveyId) {
    if (confirm("Подключиться к опросу?")) {
        try {
            await fetch(`connecttosurvey?surveyId=${surveyId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                }
            });
        }
        catch (error) {
            alert("Произошла ошибка при подключении к опросу");
        }
    }
}