document.addEventListener('DOMContentLoaded', () => {
    const addQuestionButton = document.getElementById('add-question');
    const questionsContainer = document.getElementById('questions-container');
    const submitSurveyButton = document.getElementById('submit-survey');
    const testModeSwitch = document.getElementById('test_mode');

    loadSurvey(); // Loading the survey when the page loads

    addQuestionButton.addEventListener('click', () => {
        addQuestion();
        saveSurvey();
    });

    submitSurveyButton.addEventListener('click', () => {
        submitSurvey();
    });

    testModeSwitch.addEventListener('change', () => {
        toggleTestMode(testModeSwitch.checked);
        saveSurvey();
    });

    document.getElementById('survey-form').addEventListener('blur', function (event) {
        if (event.target.matches('.form__input, .form-check-input')) {
            saveSurvey();
        }
    }, true);

    questionsContainer.addEventListener('click', (event) => {
        if (event.target.matches('.remove-question')) {
            const questionBlock = event.target.closest('.que-n-ans');
            questionsContainer.removeChild(questionBlock);
            saveSurvey();
        } else if (event.target.matches('.add-answer')) {
            const questionBlock = event.target.closest('.question-block');
            const answersContainer = questionBlock.querySelector('.answers-container');
            addAnswer(answersContainer, "", testModeSwitch.checked);
            saveSurvey();
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
        } else {
            saveSurvey();
        }
    });
});

function saveSurvey() {
/* Functions for saving, downloading and collecting survey data */
    try {
        const surveyData = collectSurveyData();
        const options = collectSurveyOptions();
        localStorage.setItem('surveyData', JSON.stringify(surveyData));
        localStorage.setItem('surveyOptions', JSON.stringify(options));
    } catch (DOMException) {
        alert("Произошла ошибка при сохранении данных. После перезагрузки страницы некоторые данные могут быть утеряны.");
    }
}

function loadSurvey() {
    const savedSurvey = localStorage.getItem('surveyData');
    const savedOptions = localStorage.getItem('surveyOptions');
    if (savedSurvey) {
        const surveyData = JSON.parse(savedSurvey);
        renderSurveyData(surveyData);
    }
    if (savedOptions) {
        const options = JSON.parse(savedOptions);
        renderSurveyOptions(options);
    }
}

function collectSurveyData() {
    const questionsContainer = document.getElementById('questions-container');
    const questions = questionsContainer.querySelectorAll('.que-n-ans');
    const surveyData = [];

    questions.forEach((question) => {
        const questionInput = question.querySelector('.question-input');
        const multianswerSwitch = question.querySelector('.multianswer-switch input');
        const answersContainer = question.querySelector('.answers-container');
        const answers = answersContainer.querySelectorAll('.answer-div');
        const imageInput = question.querySelector('.imageInput');
        const imageSrc = question.querySelector('.preview').src;

        const questionData = {
            question: questionInput.value,
            multianswer: multianswerSwitch.checked,
            answers: [],
            image: imageSrc || imageInput || ''
        };

        answers.forEach(answer => {
            const answerInput = answer.querySelector('.form-control');
            questionData.answers.push(answerInput.value);
        });

        surveyData.push(questionData);
    });

    return surveyData;
}

function collectSurveyOptions() {
    const optionsContainer = document.getElementById('survey-form');

    const title = optionsContainer.querySelector('.s-title').value;
    const description = optionsContainer.querySelector('.s-description').value;
    const timeout = optionsContainer.querySelector('.s-timeout').value;
    const limit = optionsContainer.querySelector('.s-limit').value;
    const mode = optionsContainer.querySelector('.s-switch input').checked;

    return {
        survey_title: title,
        description: description,
        timeout: timeout,
        limit: limit,
        mode: mode
    };
}

function renderSurveyData(surveyData) {
    const questionsContainer = document.getElementById('questions-container');
    const testModeSwitch = document.getElementById('test_mode');
    questionsContainer.innerHTML = '';

    surveyData.forEach(questionData => {
        const questionTemplate = document.getElementById('question-template').content;
        const newQuestion = document.importNode(questionTemplate, true);

        const questionInput = newQuestion.querySelector('.question-input');
        const multianswerSwitch = newQuestion.querySelector('.multianswer-switch input');
        const answersContainer = newQuestion.querySelector('.answers-container');
        const preview = newQuestion.querySelector('.preview');

        questionInput.value = questionData.question;
        multianswerSwitch.checked = questionData.multianswer;
        preview.src = questionData.image;

        questionData.answers.forEach(answerText => {
            addAnswer(answersContainer, answerText, testModeSwitch.checked);
        });

        questionsContainer.appendChild(newQuestion);
    });
}

function renderSurveyOptions(options) {
    const optionsContainer = document.getElementById('survey-form');

    optionsContainer.querySelector('.s-title').value = options.survey_title;
    optionsContainer.querySelector('.s-description').value = options.description;
    optionsContainer.querySelector('.s-timeout').value = options.timeout;
    optionsContainer.querySelector('.s-limit').value = options.limit;
    optionsContainer.querySelector('.s-switch input').checked = options.mode;
}

function addQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    const questionTemplate = document.getElementById('question-template').content;
    const newQuestion = document.importNode(questionTemplate, true);
    questionsContainer.appendChild(newQuestion);
}

function addAnswer(container, answerText = '', isTestMode = false) {
    /**
    * Adds a new response to the response container.
     * If test mode is enabled, adds a text field with a radio button.
     * @param {HTMLElement} container - Container for responses.
     * @* @param {string} answer Text - The response text (empty by default).
     * @param {boolean} isTestMode - Flag indicating whether the test mode is enabled.
     */
    const answerDiv = document.createElement('div');
    answerDiv.setAttribute('class', 'input-group answer-div');

    if (isTestMode) {
        // Adding a radio button for the test mode
        const radioInput = document.createElement('input');
        radioInput.setAttribute('type', 'radio');
        radioInput.setAttribute('name', 'test-answer');
        radioInput.setAttribute('class', 'form-check-input mt-0');
        answerDiv.appendChild(radioInput);
    }

    const answerInput = document.createElement('input');
    answerInput.setAttribute('type', 'text');
    answerInput.setAttribute('class', 'form-control');
    answerInput.setAttribute('placeholder', 'Введите вариант ответа');
    if (answerText) {
        answerInput.value = answerText;
    }

    answerDiv.appendChild(answerInput);

    const removeAnswerButton = document.createElement('i');
    removeAnswerButton.setAttribute('class', 'remove-answer bx bxs-trash');
    answerDiv.appendChild(removeAnswerButton);

    container.appendChild(answerDiv);
}

function toggleTestMode(isTestMode) {
    /**
    * Switches the test mode.
     * If test mode is enabled, adds radio buttons to existing answers.
     * If test mode is disabled, removes radio buttons from existing answers.
     * @param {boolean} isTestMode - Flag indicating whether the test mode is enabled.
     */
    const questionsContainer = document.getElementById('questions-container');
    const answers = questionsContainer.querySelectorAll('.answers-container .answer-div');

    answers.forEach(answerDiv => {
        if (isTestMode) {
            // Adding a radio button
            const radioInput = document.createElement('input');
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('name', 'test-answer');
            radioInput.setAttribute('class', 'form-check-input mt-0');
            answerDiv.insertBefore(radioInput, answerDiv.firstChild);
        } else {
            // Delete a radio button
            const radioInput = answerDiv.querySelector('input[type="radio"]');
            if (radioInput) {
                radioInput.remove();
            }
        }
    });
}

function submitSurvey() {
    const surveyData = collectSurveyData();
    console.log('Survey submitted:', surveyData);
    alert('Опрос успешно сохранен и отправлен.');
    localStorage.removeItem('surveyData');
}

function cancel_submit() {
    if (confirm("Вы действительно хотите уничтожить свою работу?")) {
        window.location.href = "/admin/workshop";
        localStorage.removeItem('surveyData');
    }
}

function review_survey() {
    alert("Создание опроса подтверждено.");
}
