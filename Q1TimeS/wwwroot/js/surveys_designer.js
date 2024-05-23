document.addEventListener('DOMContentLoaded', function () {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const dropdownButton = document.getElementById('dropdownMenu2');

    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            dropdownButton.textContent = this.textContent;
            dropdownButton.value = this.value; // save value in button
        });
    });
});

// Common
function saveSurvey() {
    /* Save to localstorage */
    const questionsContainer = document.getElementById('questions-container');
    const surveyData = questionsContainer.innerHTML;
    localStorage.setItem('surveyData', surveyData);
}

function loadSurvey() {
    /* Load from localstorage */
    const questionsContainer = document.getElementById('questions-container');
    const savedSurvey = localStorage.getItem('surveyData');
    if (savedSurvey) {
        questionsContainer.innerHTML = savedSurvey;
    }
}

// answers
document.addEventListener('DOMContentLoaded', () => {
    const addQuestionButton = document.getElementById('add-question');
    const questionsContainer = document.getElementById('questions-container');
    const questionTemplate = document.getElementById('question-template').content;

    loadSurvey();

    addQuestionButton.addEventListener('click', () => {
        addQuestion();
        saveSurvey();
    });

    questionsContainer.addEventListener('click', (event) => {
        if (event.target.matches('.remove-question')) {
            const questionBlock = event.target.closest('.que-n-ans');
            questionsContainer.removeChild(questionBlock);
            saveSurvey();
        } else if (event.target.matches('.add-answer')) {
            const questionBlock = event.target.closest('.question-block');
            const answerTypeSelector = questionBlock.querySelector('.form-select');
            if (answerTypeSelector.value !== 'text') {
                const answersContainer = event.target.previousElementSibling;
                addAnswer(answersContainer);
                saveSurvey();
            } else {
                alert('Для текстового ответа нельзя добавлять варианты.');
            }
        } else if (event.target.matches('.remove-answer')) {
            const answerDiv = event.target.closest('.answer-div');
            answerDiv.remove();
            saveSurvey();
        } else if (event.target.matches('.remove-image')) {
            const imgBlock = event.target.closest('.img-block');
            const preview = imgBlock.querySelector('.preview');
            const imageInput = imgBlock.querySelector('.imageInput');
            preview.src = '';
            imageInput.value = '';
            saveSurvey();
        }
    });

    questionsContainer.addEventListener('change', (event) => {
        if (event.target.matches('.imageInput')) {
            const imgBlock = event.target.closest('.img-block');
            const preview = imgBlock.querySelector('.preview');
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    saveSurvey();
                };
                reader.readAsDataURL(file);
            }
        } else if (event.target.matches('.form-select')) {
            const questionBlock = event.target.closest('.question-block');
            const answersContainer = questionBlock.querySelector('.answers-container');
            answersContainer.innerHTML = '';
            if (event.target.value === 'text') {
                const textAnswer = document.createElement('input');
                textAnswer.setAttribute('type', 'text');
                textAnswer.setAttribute('class', 'answer-input');
                textAnswer.setAttribute('placeholder', 'Введите вариант ответа');
                answersContainer.appendChild(textAnswer);
            }
            saveSurvey();
        } else {
            saveSurvey();
        }
    });
});

function addQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    const questionTemplate = document.getElementById('question-template').content;
    const newQuestion = document.importNode(questionTemplate, true);
    questionsContainer.appendChild(newQuestion);
}

function addAnswer(container) {
    const questionBlock = container.closest('.question-block');
    const answerTypeSelector = questionBlock.querySelector('.form-select');
    const selectedAnswerType = answerTypeSelector.value;

    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer-div');

    let newAnswer;
    switch (selectedAnswerType) {
        case 'one':
            newAnswer = document.createElement('input');
            newAnswer.setAttribute('type', 'radio');
            newAnswer.setAttribute('name', 'single-answer');
            newAnswer.setAttribute('class', 'answer-input');
            answerDiv.appendChild(newAnswer);
            const answerLabel = document.createElement('input');
            answerLabel.setAttribute('type', 'text');
            answerLabel.setAttribute('class', 'answer-label');
            answerLabel.setAttribute('placeholder', 'Введите вариант ответа');
            answerDiv.appendChild(answerLabel);
            break;
        case 'many':
            newAnswer = document.createElement('input');
            newAnswer.setAttribute('type', 'checkbox');
            newAnswer.setAttribute('class', 'answer-input');
            answerDiv.appendChild(newAnswer);
            const answerLabelMany = document.createElement('input');
            answerLabelMany.setAttribute('type', 'text');
            answerLabelMany.setAttribute('class', 'answer-label');
            answerLabelMany.setAttribute('placeholder', 'Введите вариант ответа');
            answerDiv.appendChild(answerLabelMany);
            break;
        default:
            alert('Неверный тип ответа.');
            return;
    }

    const removeAnswerButton = document.createElement('button');
    removeAnswerButton.setAttribute('type', 'button');
    removeAnswerButton.setAttribute('class', 'btn btn-outline-danger remove-answer');
    removeAnswerButton.textContent = 'Удалить';

    answerDiv.appendChild(removeAnswerButton);
    container.appendChild(answerDiv);
}


// commit surveys
function cancel_submit() {
    if (confirm("Вы действительно хотите уничтожить свою работу?") === true) {
        window.location.href = "/admin/workshop";
        localStorage.removeItem('surveyData');
    }
}

function review_survey() {
    alert("Создание опроса подтверждено.");
}