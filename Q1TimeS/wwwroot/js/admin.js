function go_stats(id) {
    window.location.href = `/admin/statistics?key=${id}`;
}

function go_create() {
    window.location.href = "/admin/compositesurvey";
}

function delete_survey(surveyId) {
    if (confirm("Вы уверены, что хотите удалить этот опрос?")) {
        const token = getTokenFromCookie();

        // Отправка запроса на сервер для удаления опроса
        fetch(`/admin/deletesurvey/${surveyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                document.getElementById(surveyId).remove();
            } else {
                alert('Произошла ошибка при удалении опроса');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при удалении опроса');
        });
    }
}
