var questionCount = 0; // Question counter for unique radio button names
const testModeSwitch = document.getElementById('test_mode');

document.addEventListener('DOMContentLoaded', () => {
    const addQuestionButton = document.getElementById('add-question');
    const questionsContainer = document.getElementById('questions-container');
    const submitSurveyButton = document.getElementById('submit-survey');

    const timeoutInput = document.getElementById('s-timeout');
    const limitInput = document.getElementById('s-limit');

    loadSurvey(); // Loading the survey when the page loads

    /* Event binding */
    timeoutInput.addEventListener('input', validateIntegerInput);
    limitInput.addEventListener('input', validateIntegerInput);

    timeoutInput.addEventListener('blur', validateOnBlur);
    limitInput.addEventListener('blur', validateOnBlur);

    addQuestionButton.addEventListener('click', () => {
        addQuestion();
        saveSurvey();
    });

    submitSurveyButton.addEventListener('click', () => { submitSurvey(); }); // Send a survey

    testModeSwitch.addEventListener('change', () => {
        //
        toggleTestMode(testModeSwitch.checked);
        saveSurvey();
    });

    document.getElementById('survey-form').addEventListener('blur', function (event) {
        if (event.target.matches('.form__input, .form-check-input')) {
            saveSurvey();
        }
    }, true);

    questionsContainer.addEventListener('click', (event) => {
        // Remove
        if (event.target.matches('.remove-question')) {
            const questionBlock = event.target.closest('.que-n-ans');
            questionsContainer.removeChild(questionBlock);
            saveSurvey();
        // Add answer
        } else if (event.target.matches('.add-answer')) {
            const questionBlock = event.target.closest('.question-block');
            const answersContainer = questionBlock.querySelector('.answers-container');
            const questionIndex = questionBlock.dataset.questionIndex;
            addAnswer(answersContainer, "", testModeSwitch.checked, questionIndex);
            saveSurvey();
        // Remove answer
        } else if (event.target.matches('.remove-answer')) {
            const answerDiv = event.target.closest('.answer-div');
            answerDiv.remove();
            saveSurvey();
        // Remove image
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

/* Checking the correctness of the fields */
function validateIntegerInput(event) {
    const input = event.target;
    const value = input.value;
    if (!/^\d*$/.test(value)) {
        input.classList.add('is-invalid');
    } else {
        input.classList.remove('is-invalid');
    }
}

function validateOnBlur(event) {
    const input = event.target;
    if (input.value === '') {
        input.classList.remove('is-invalid');
    } else if (!/^\d+$/.test(input.value)) {
        input.classList.add('is-invalid');
    } else {
        input.classList.remove('is-invalid');
    }
}

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
    /* Functions for receiving saves */
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

/* Getting data from a page */
function collectSurveyData() {
    const questionsContainer = document.getElementById('questions-container');
    const questions = questionsContainer.querySelectorAll('.que-n-ans');
    const surveyData = [];

    // Проходимся по каждому вопросу
    questions.forEach((question, index) => {
        const questionInput = question.querySelector('.question-input'); // Question input field 
        const multianswerSwitch = question.querySelector('.multianswer-switch input'); // The "Multiple answers" switch
        const answersContainer = question.querySelector('.answers-container'); // Сontainer for answers
        const answers = answersContainer.querySelectorAll('.answer-div'); // All possible answers
        const imageInput = question.querySelector('.imageInput'); // The input field for uploading an image
        const imageSrc = question.querySelector('.preview').src; // Image source
        const trueAnswer = answersContainer.querySelector(`input[name="test-answer-${index}"]:checked`); // True answer

        // Creating an object for the current question
        const questionData = {
            question: questionInput.value, 
            multianswer: multianswerSwitch.checked,
            answers: [], 
            trueAnswerIndex: trueAnswer ? [...answers].indexOf(trueAnswer.closest('.answer-div')) : null, // Save the index of the correct answer or null if the correct answer is not selected
            image: imageSrc || imageInput || '', // Save the image source or an empty string if there is no image
            questionIndex: index 
        };

        // Adding answers
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
        test_mode: mode
    };
}

/* Displaying data on a page */
function renderSurveyData(surveyData) {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';

    surveyData.forEach(questionData => {
        const questionTemplate = document.getElementById('question-template').content;
        const newQuestion = document.importNode(questionTemplate, true);

        const questionInput = newQuestion.querySelector('.question-input');
        const multianswerSwitch = newQuestion.querySelector('.multianswer-switch input');
        const answersContainer = newQuestion.querySelector('.answers-container');
        const preview = newQuestion.querySelector('.preview');

        newQuestion.querySelector('.question-block').dataset.questionIndex = questionData.questionIndex; // Set index

        questionInput.value = questionData.question;
        multianswerSwitch.checked = questionData.multianswer;
        preview.src = questionData.image;

        questionData.answers.forEach((answerText, answerIndex) => {
            addAnswer(answersContainer, answerText, testModeSwitch.checked, questionData.questionIndex, answerIndex === questionData.trueAnswerIndex);
        });

        change_multianswer(newQuestion.querySelector('.multianswer-switch input'));

        questionsContainer.appendChild(newQuestion);
    });
}

function renderSurveyOptions(options) {
    const optionsContainer = document.getElementById('survey-form');

    optionsContainer.querySelector('.s-title').value = options.survey_title;
    optionsContainer.querySelector('.s-description').value = options.description;
    optionsContainer.querySelector('.s-timeout').value = options.timeout;
    optionsContainer.querySelector('.s-limit').value = options.limit;
    optionsContainer.querySelector('.s-switch input').checked = options.test_mode;

    toggleTestMode(options.mode); // Updating the interface when loading options
}

function addQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    const questionTemplate = document.getElementById('question-template').content;
    const newQuestion = document.importNode(questionTemplate, true);

    newQuestion.querySelector('.question-block').dataset.questionIndex = questionCount;
    const multianswerSwitch = newQuestion.querySelector('.question-block .multianswer-switch input');

    questionsContainer.appendChild(newQuestion);
    questionCount++; // Increasing the question counter

    change_multianswer(multianswerSwitch);
}

function addAnswer(container, answerText = '', isTestMode = false, questionIndex, isChecked = false) {
    /**
    * Adds a new response to the response container.
    * If test mode is enabled, adds a text field with a radio button.
    * @param {HTMLElement} container - Container for responses.
    * @param {string} answerText - Response text (empty by default).
    * @param {boolean} isTestMode - Flag indicating whether the test mode is enabled.
    * @param {number} questionIndex - The index of the question for the uniqueness of the radio buttons.
    * @param {boolean} isChecked - Flag indicating whether the radio button should be checked.
    */
    const answerDiv = document.createElement('div');
    answerDiv.setAttribute('class', 'input-group answer-div');

    // Adding a radio button for the test mode
    if (isTestMode) {
        const radioInput = document.createElement('input');
        radioInput.setAttribute('type', 'radio');
        radioInput.setAttribute('name', `test-answer-${questionIndex}`);
        radioInput.setAttribute('class', 'form-check-input mt-0');
        if (isChecked) 
            radioInput.checked = true;

        answerDiv.appendChild(radioInput);
    }

    const answerInput = document.createElement('input');
    answerInput.setAttribute('type', 'text');
    answerInput.setAttribute('class', 'form-control');
    answerInput.setAttribute('placeholder', 'Введите вариант ответа');

    if (answerText) 
        answerInput.value = answerText;

    answerDiv.appendChild(answerInput);

    const removeAnswerButton = document.createElement('i');
    removeAnswerButton.setAttribute('class', 'remove-answer bx bxs-trash');
    answerDiv.appendChild(removeAnswerButton);

    container.appendChild(answerDiv);
}

function toggleTestMode(isTestMode) {
    /**
    * Switches the test mode.
    * If test mode is enabled, adds radio buttons to existing answers and disables the "Multiple Answers" switches.
    * If the test mode is disabled, removes the radio buttons from the existing answers and turns on the "Multiple answers" switches.
    * @param {boolean} isTestMode - Flag indicating whether the test mode is enabled.
    */
    const questionsContainer = document.getElementById('questions-container');
    const questions = questionsContainer.querySelectorAll('.question-block');

    questions.forEach(questionBlock => {
        const answers = questionBlock.querySelectorAll('.answers-container .answer-div');
        const multianswerSwitch = questionBlock.querySelector('.multianswer-switch input');

        answers.forEach(answer => {
            const radioInput = answer.querySelector('.form-check-input');
            if (isTestMode) {
                // If the test mode is enabled and the radio button is missing, add it
                if (!radioInput) {
                    const radioInput = document.createElement('input');
                    const questionIndex = questionBlock.dataset.questionIndex;
                    radioInput.setAttribute('type', 'radio');
                    radioInput.setAttribute('name', `test-answer-${questionIndex}`);
                    radioInput.setAttribute('class', 'form-check-input mt-0');
                    answer.insertBefore(radioInput, answer.firstChild);
                }
            } else {
                // If the test mode is disabled and the radio button is present, delete it
                if (radioInput) {
                    radioInput.remove();
                }
            }
        });
        change_multianswer(multianswerSwitch);
    });
}

/* General funcions */
function change_multianswer(multianswerSwitch) {
    // Disable or enable the "Multiple answers" switch
    const questionBlock = multianswerSwitch.closest('.question-block');
    multianswerSwitch.disabled = testModeSwitch.checked;
    if (testModeSwitch.checked) 
        multianswerSwitch.checked = false;
    

    const radioButtons = questionBlock.querySelectorAll('.form-check-input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.disabled = !testModeSwitch.checked;
    });
}

/* Control functions */
function submitSurvey() {
    if (review_survey()) {
        const surveyData = collectSurveyData();
        const surveyOptions = collectSurveyOptions();
        console.log('Survey submitted:', surveyData);
        console.log('Survey submitted:', surveyOptions);
        alert('Опрос успешно сохранен и отправлен.');
        localStorage.removeItem('surveyData');
        localStorage.removeItem('surveyOptions');
        alert("Создание опроса подтверждено.");
    }
    else {
        alert("Создание опроса отменено.");
    }
}

function cancel_submit() {
    if (confirm("Вы действительно хотите уничтожить свою работу?")) {
        window.location.href = "/admin/workshop";
        localStorage.removeItem('surveyData');
        localStorage.removeItem('surveyOptions');
    }
}

function review_survey() {
    return true;
}
