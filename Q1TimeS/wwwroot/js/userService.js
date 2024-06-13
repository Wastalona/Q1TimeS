async function connect(surveyId) {
    if (confirm("������������ � ������?")) {
        try {
            await fetch(`connecttosurvey?surveyId=${surveyId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                }
            });
        }
        catch (error) {
            console.error("Error: " + error);
            alert("��������� ������ ��� ����������� � ������");
        }
    }
}