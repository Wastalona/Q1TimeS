function go_stats(id) {
    window.location.href = `/admin/statistics?key=${id}`;
}

function go_create() {
    window.location.href = "/admin/compositesurvey";
}

function delete_survey(){
    if (confirm("Вы уверены, что хотите удалить этот опрос?")) {
        // Отправка запроса на сервер для удаления опроса
        fetch(`/survey/delete/${surveyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('input[name="__RequestVerificationToken"]').value
            }
        })
        .then(response => {
            if (response.ok) {
                document.getElementById(surveyId).remove();
            } else {
                alert('Произошла ошибка при удалении опроса');
            }
        });
    }
}
