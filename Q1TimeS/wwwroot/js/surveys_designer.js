let questionCount = 0; // Question counter for unique radio button names
const testModeSwitch = document.getElementById('test_mode');

document.addEventListener('DOMContentLoaded', () => {
    const addQuestionButton = document.getElementById('add-question');
    const questionsContainer = document.getElementById('questions-container');
    const submitSurveyButton = document.getElementById('submit-survey');

    const timeoutInput = document.getElementById('s-cutofftime');
    const limitInput = document.getElementById('s-limit');

    // Load the survey when the page loads
    loadSurvey();

    // Bind events for input validation and survey actions
    timeoutInput.addEventListener('input', validateIntegerInput);
    limitInput.addEventListener('input', validateIntegerInput);
    timeoutInput.addEventListener('blur', validateOnBlur);
    limitInput.addEventListener('blur', validateOnBlur);

    addQuestionButton.addEventListener('click', () => {
        addQuestion();
        saveSurvey();
    });

    submitSurveyButton.addEventListener('click', submitSurvey);

    testModeSwitch.addEventListener('change', () => {
        toggleTestMode(testModeSwitch.checked);
        saveSurvey();
    });

    // Save survey data when form inputs lose focus
    document.getElementById('survey-form').addEventListener('blur', (event) => {
        if (event.target.matches('.form__input, .form-check-input')) {
            saveSurvey();
        }
    }, true);

    // Event delegation for question and answer actions
    questionsContainer.addEventListener('click', (event) => {
        if (event.target.matches('.remove-question')) {
            const questionBlock = event.target.closest('.que-n-ans');
            questionsContainer.removeChild(questionBlock);
            saveSurvey();
        } else if (event.target.matches('.add-answer')) {
            const questionBlock = event.target.closest('.question-block');
            const answersContainer = questionBlock.querySelector('.answers-container');
            const questionIndex = questionBlock.dataset.questionIndex;
            addAnswer(answersContainer, "", testModeSwitch.checked, questionIndex);
            saveSurvey();
        } else if (event.target.matches('.remove-answer')) {
            const answerDiv = event.target.closest('.answer-div');
            answerDiv.remove();
            saveSurvey();
        }
    });
});

/* Work with survey payload */
function collectSurveyData() {
    /**
     * Collects survey data from the page.
     * @returns {Array} The survey data.
    */
    const questionsContainer = document.getElementById('questions-container');
    const questions = questionsContainer.querySelectorAll('.que-n-ans');
    const surveyData = [];

    questions.forEach((question, index) => {
        const questionInput = question.querySelector('.question-input');
        const multianswerSwitch = question.querySelector('.multianswer-switch input');
        const answersContainer = question.querySelector('.answers-container');
        const answers = answersContainer.querySelectorAll('.answer-div');
        const trueAnswer = answersContainer.querySelector(`input[name="test-answer-${index}"]:checked`);

        const questionData = {
            //questionId: generateUniqueId(),
            questionText: questionInput.value,
            multianswer: multianswerSwitch.checked,
            answers: [],
            trueAnswerIndex: trueAnswer ? [...answers].indexOf(trueAnswer.closest('.answer-div')) : null,
            questionIndex: index
        };

        answers.forEach(answer => {
            const answerInput = answer.querySelector('.form-control');
            questionData.answers.push({
                answerText: answerInput.value
                //questionId: questionData.questionId
            });
        });

        surveyData.push(questionData);
    });

    return surveyData;
}

function collectSurveyOptions() {
    /**
     * Collects survey options from the page.
     * @returns {Object} The survey options.
    */
    const optionsContainer = document.getElementById('survey-form');
    return {
        survey_title: optionsContainer.querySelector('.s-title').value,
        description: optionsContainer.querySelector('.s-description').value,
        cutofftime: optionsContainer.querySelector('.s-cutofftime').value,
        limit: optionsContainer.querySelector('.s-limit').value,
        test_mode: optionsContainer.querySelector('.s-switch input').checked
    };
}

function renderSurveyData(surveyData) {
    /**
     * Renders survey data on the page.
     * @param {Array} surveyData - The survey data.
    */
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';

    surveyData.forEach(questionData => {
        const questionTemplate = document.getElementById('question-template').content;
        const newQuestion = document.importNode(questionTemplate, true);

        const questionInput = newQuestion.querySelector('.question-input');
        const multianswerSwitch = newQuestion.querySelector('.multianswer-switch input');
        const answersContainer = newQuestion.querySelector('.answers-container');

        newQuestion.querySelector('.question-block').dataset.questionIndex = questionData.questionIndex;

        questionInput.value = questionData.questionText != null ? questionData.questionText : "";
        multianswerSwitch.checked = questionData.multianswer;

        questionData.answers.forEach((obj, answerIndex) => {
            addAnswer(answersContainer, obj.answerText, testModeSwitch.checked, questionData.questionIndex, answerIndex === questionData.trueAnswerIndex);
        });

        changeMultiAnswer(newQuestion.querySelector('.multianswer-switch input'));

        questionsContainer.appendChild(newQuestion);
    });
}

function renderSurveyOptions(options) {
    /**
     * Renders survey options on the page.
     * @param {Object} options - The survey options.
    */
    const optionsContainer = document.getElementById('survey-form');
    optionsContainer.querySelector('.s-title').value = options.survey_title;
    optionsContainer.querySelector('.s-description').value = options.description;
    optionsContainer.querySelector('.s-cutofftime').value = options.cutofftime;
    optionsContainer.querySelector('.s-limit').value = options.limit;
    optionsContainer.querySelector('.s-switch input').checked = options.test_mode;

    toggleTestMode(options.test_mode);
}

function addQuestion() {
    /**
     * Adds a new question to the survey.
     */
    const questionsContainer = document.getElementById('questions-container');
    const questionTemplate = document.getElementById('question-template').content;
    const newQuestion = document.importNode(questionTemplate, true);

    newQuestion.querySelector('.question-block').dataset.questionIndex = questionCount;
    const multianswerSwitch = newQuestion.querySelector('.question-block .multianswer-switch input');

    questionsContainer.appendChild(newQuestion);
    questionCount++;

    changeMultiAnswer(multianswerSwitch);
}

function addAnswer(container, answerText = '', isTestMode = false, questionIndex, isChecked = false) {
    /**
     * Adds a new answer to a question.
     * @param {HTMLElement} container - The container for the answers.
     * @param {string} [answerText=''] - The text of the answer.
     * @param {boolean} [isTestMode=false] - Whether the test mode is enabled.
     * @param {number} questionIndex - The index of the question.
     * @param {boolean} [isChecked=false] - Whether the answer should be marked as correct.
    */
    const answerDiv = document.createElement('div');
    answerDiv.setAttribute('class', 'input-group answer-div');

    if (isTestMode) {
        const radioInput = document.createElement('input');
        radioInput.setAttribute('type', 'radio');
        radioInput.setAttribute('name', `test-answer-${questionIndex}`);
        radioInput.setAttribute('class', 'form-check-input mt-0');
        if (isChecked) radioInput.checked = true;
        answerDiv.appendChild(radioInput);
    }

    const answerInput = document.createElement('input');
    answerInput.setAttribute('type', 'text');
    answerInput.setAttribute('class', 'form-control');
    answerInput.setAttribute('placeholder', 'Ответ');
    if (answerText) answerInput.value = answerText;
    answerDiv.appendChild(answerInput);

    const removeAnswerButton = document.createElement('i');
    removeAnswerButton.setAttribute('class', 'remove-answer bx bx-x');
    answerDiv.appendChild(removeAnswerButton);

    container.appendChild(answerDiv);
}

function toggleTestMode(isTestMode) {
    /**
     * Toggles the test mode.
     * @param {boolean} isTestMode - Whether the test mode is enabled.
    */
    const questionsContainer = document.getElementById('questions-container');
    const questions = questionsContainer.querySelectorAll('.question-block');

    questions.forEach(questionBlock => {
        const answers = questionBlock.querySelectorAll('.answers-container .answer-div');
        const multianswerSwitch = questionBlock.querySelector('.multianswer-switch input');

        answers.forEach(answer => {
            const radioInput = answer.querySelector('.form-check-input');
            if (isTestMode) {
                if (!radioInput) {
                    const newRadioInput = document.createElement('input');
                    const questionIndex = questionBlock.dataset.questionIndex;
                    newRadioInput.setAttribute('type', 'radio');
                    newRadioInput.setAttribute('name', `test-answer-${questionIndex}`);
                    newRadioInput.setAttribute('class', 'form-check-input mt-0');
                    answer.insertBefore(newRadioInput, answer.firstChild);
                }
            } else {
                if (radioInput) radioInput.remove();
            }
        });
        changeMultiAnswer(multianswerSwitch);
    });
}

function changeMultiAnswer(multianswerSwitch) {
    /**
     * Disables or enables the "Multiple answers" switch.
     * @param {HTMLElement} multianswerSwitch - The "Multiple answers" switch element.
    */
    const questionBlock = multianswerSwitch.closest('.question-block');
    multianswerSwitch.disabled = testModeSwitch.checked;
    if (testModeSwitch.checked) multianswerSwitch.checked = false;

    const radioButtons = questionBlock.querySelectorAll('.form-check-input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.disabled = !testModeSwitch.checked;
    });
}

/* Control functions */
function submitSurvey() {
    /* Submits the survey. */
    const alertContainer = document.getElementById('alert-container');
    const alertMessage = document.getElementById('alert-message');
    goUp();

    if (validateSurvey()) {
        const surveyData = collectSurveyData();
        const surveyOptions = collectSurveyOptions();
        const token = getTokenFromCookie();

        alertContainer.classList.add('d-none');

        const surveyModel = {
            Title: surveyOptions.survey_title,
            Description: surveyOptions.description,
            CutOffTime: parseInt(surveyOptions.cutofftime),
            Limit: parseInt(surveyOptions.limit),
            IsQuizMode: surveyOptions.test_mode,
            Questions: surveyData.map(question => ({
                QuestionText: question.questionText,
                MultiAnswer: question.multiAnswer,
                TrueAnswerIndex: question.trueAnswerIndex,
                Answers: question.answers.map(answer => ({
                    AnswerText: answer.answerText,
                    QuestionId: answer.questionId
                }))
            }))
        };


        // POST
        fetch('https://localhost:5000/admin/compositesurvey', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(surveyModel)
        })
        .then(response => {
            if (response.ok) {
                // If the server returns a redirect, redirect the browser to the new URL
                if (response.redirected) {
                    localStorage.removeItem('surveyData');
                    localStorage.removeItem('surveyOptions');

                    // Display the success message
                    alert("Опрос успешно создан)");
                    window.location.href = response.url;
                } else {
                    return response.json();
                }
            } else {
                throw new Error("Произошла ошибка при отправке опроса.");
            }
        })
        .catch(() => {
            // Display the error message
            alertContainer.classList.remove('d-none');
            alertContainer.classList.remove('alert-success');
            alertContainer.classList.add('alert-danger');
            alertMessage.innerHTML = "Произошла ошибка при отправке опроса.";
        });
    } else {
        // Display the error message
        alertMessage.innerHTML = "Форма заполнена неправильно";
        alertContainer.classList.remove('d-none');
    }
}

function cancelSubmit() {
    /*Cancels the survey submission.*/
    if (confirm("Вы действительно хотите уничтожить свою работу?")) {
        window.location.href = "/admin/workshop";
        localStorage.removeItem('surveyData');
        localStorage.removeItem('surveyOptions');
    }
}

function saveSurvey() {
    /*Saves survey data to local storage.*/
    try {
        const surveyData = collectSurveyData();
        const options = collectSurveyOptions();
        localStorage.setItem('surveyData', JSON.stringify(surveyData));
        localStorage.setItem('surveyOptions', JSON.stringify(options));
    } catch (DOMException) {
        alert("Произошла ошибка при сохранении данных. Некоторые данные могут быть утеряны после перезагрузки страницы.");
    }
}

function loadSurvey() {
    /*Loads survey data from local storage and renders it.*/
    const savedOptions = localStorage.getItem('surveyOptions');
    const savedSurvey = localStorage.getItem('surveyData');
    if (savedOptions) {
        const options = JSON.parse(savedOptions);
        renderSurveyOptions(options);
    }
    if (savedSurvey) {
        const surveyData = JSON.parse(savedSurvey);
        renderSurveyData(surveyData);
    }
}   

/* Validations */
function validateSurvey() {
    /**
     * Reviews the survey before submission.
     * @returns {boolean} Always returns true for now.
    */
    let isValid = true;

    // Validate survey options
    const surveyTitle = document.querySelector('.s-title').value.trim();
    let cutofftime = document.querySelector('.s-cutofftime').value.trim();
    let limit = document.querySelector('.s-limit').value.trim();
    const isTestMode = testModeSwitch.checked;

    if (cutofftime === '') cutofftime = '3600';
    if (limit === '') limit = '10';

    if (surveyTitle === '') isValid = false;
    if (!/^\d+$/.test(cutofftime)) isValid = false;
    if (!/^\d+$/.test(limit)) isValid = false;

    // Validate questions
    const questions = document.querySelectorAll('.que-n-ans');

    if (questions.length < 1 || questions.length > 20) isValid = false;

    questions.forEach((question, questionIndex) => {
        const questionText = question.querySelector('.question-input').value.trim();
        const answers = question.querySelectorAll('.answers-container .answer-div');
        const trueAnswer = question.querySelector(`input[name="test-answer-${questionIndex}"]:checked`);

        if (questionText === '') isValid = false;
        if (answers.length < 2 || answers.length > 10) isValid = false;

        let hasAnswer = false;
        answers.forEach(answer => {
            const answerText = answer.querySelector('.form-control').value.trim();
            if (answerText !== '') hasAnswer = true;
        });

        if (!hasAnswer) isValid = false;
        if (isTestMode && !trueAnswer) isValid = false;

    });

    return isValid;
}

function validateIntegerInput(event) {
    /**
     * Validates integer input fields to ensure they contain only digits.
     * @param {Event} event - The input event.
    */
    const input = event.target;
    const value = input.value;
    if (!/^\d*$/.test(value)) {
        input.classList.add('is-invalid');
    } else {
        input.classList.remove('is-invalid');
    }
}

function validateOnBlur(event) {
    /**
     * Validates input fields on blur event.
     * @param {Event} event - The blur event.
    */
    const input = event.target;
    if (input.value === '') input.classList.remove('is-invalid');
    else if (!/^\d+$/.test(input.value)) input.classList.add('is-invalid');
    else input.classList.remove('is-invalid');
}