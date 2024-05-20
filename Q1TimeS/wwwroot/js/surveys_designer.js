document.addEventListener('DOMContentLoaded', function () {
    const addQuestionButton = document.getElementById('add-question');
    const questionsContainer = document.getElementById('questions-container');
    const questionTemplate = document.getElementById('question-template').content;

    addQuestionButton.addEventListener('click', function () {
        const newQuestion = document.importNode(questionTemplate, true);

        newQuestion.querySelector('.add-answer').addEventListener('click', function () {
            const answerInput = document.createElement('input');
            answerInput.type = 'text';
            answerInput.classList.add('form-control', 'answer-input');
            answerInput.placeholder = '¬ведите вариант ответа';
            const answersContainer = newQuestion.querySelector('.answers-container');
            answersContainer.appendChild(answerInput);
        });

        newQuestion.querySelector('.remove-question').addEventListener('click', function () {
            questionsContainer.removeChild(newQuestion);
        });

        newQuestion.querySelector('.input-group button').addEventListener('click', function () {
            const fileInput = newQuestion.querySelector('.input-group input[type="file"]');
            fileInput.value = '';
        });

        questionsContainer.appendChild(newQuestion);
    });
});

/*document.addEventListener("DOMContentLoaded", function () {
    const surveyForm = document.getElementById("survey-form");
    const questionsContainer = document.getElementById("questions-container");
    const addQuestionButton = document.getElementById("add-question");
    const submitSurveyButton = document.getElementById("submit-survey");

    addQuestionButton.addEventListener("click", function () {
        const questionInput = document.getElementById("question").value;
        const newQuestion = document.createElement("div");
        newQuestion.classList.add("question");
        newQuestion.innerHTML = `<input type="text" value="${questionInput}" readonly> <button type="button" class="bx bxs-trash delete"></button>`;
        questionsContainer.appendChild(newQuestion);
        document.getElementById("question").value = "";
    });

    questionsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete")) {
            event.target.parentElement.remove();
        }
    });

    submitSurveyButton.addEventListener("click", function () {
        const questions = document.querySelectorAll(".question input");
        const surveyData = [];
        questions.forEach(question => surveyData.push(question.value));
        console.log("Survey data:", surveyData);
        // «десь можно отправить данные на сервер дл€ обработки
    });
}); */

function cancel_submit() {
    if (confirm("Do you really want to destroy your works?") === true)
        window.location.href = "/admin/workshop";
}