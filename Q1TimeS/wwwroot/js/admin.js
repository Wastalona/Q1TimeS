function go_stats(id) {
    window.location.href = `/admin/statistics?key=${id}`;
}

function go_create() {
    window.location.href = "/admin/compositesurvey";
}

function delete_survey(surveyId) {
    if (confirm("�� �������, ��� ������ ������� ���� �����?")) {
        const token = getTokenFromCookie();

        // �������� ������� �� ������ ��� �������� ������
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
                alert('��������� ������ ��� �������� ������');
            }
        })
        .catch(error => {
            console.error('������:', error);
            alert('��������� ������ ��� �������� ������');
        });
    }
}
