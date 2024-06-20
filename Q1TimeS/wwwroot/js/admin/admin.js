function go_stats(id) {
    window.location.href = `/admin/statistics?key=${id}`;
}

function go_create() {
    window.location.href = "/admin/compositesurvey";
}

function delete_survey(surveyId) {
    if (confirm("Вы уверены в своих действиях?")) {
        const token = getTokenFromCookie();

        fetch(`/admin/deletesurvey?key=${surveyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                document.getElementById(surveyId).remove();
                alert('Опрос стёрт');
            }
            else {
                alert('При удалении произошла ошибка');
            }
                
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('При удалении произошла ошибка');
        });
    }
}
