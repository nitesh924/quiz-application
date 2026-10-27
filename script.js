const quizData = [
  {
    question:
      "Which of the following keywords is used to declare a block-scoped variable in JavaScript?",
    options: [
      { text: "var", correct: false },
      { text: "let", correct: true },
      { text: "function", correct: false },
      { text: "define", correct: false },
    ],
  },
  {
    question: "What is the output of `typeof null` in JavaScript?",
    options: [
      { text: "'null'", correct: false },
      { text: "'undefined'", correct: false },
      { text: "'object'", correct: true },
      { text: "'number'", correct: false },
    ],
  },
  {
    question:
      "Which method is used to add one or more elements to the end of an array in JavaScript?",
    options: [
      { text: "push()", correct: true },
      { text: "pop()", correct: false },
      { text: "shift()", correct: false },
      { text: "unshift()", correct: false },
    ],
  },
  {
    question: "What does the `===` operator check in JavaScript?",
    options: [
      { text: "Only value equality", correct: false },
      { text: "Both value and data type equality", correct: true },
      { text: "Only data type equality", correct: false },
      { text: "Memory reference equality", correct: false },
    ],
  },
  {
    question:
      "Which built-in method creates a new array with all elements that pass the test implemented by the provided function?",
    options: [
      { text: "map()", correct: false },
      { text: "forEach()", correct: false },
      { text: "filter()", correct: true },
      { text: "reduce()", correct: false },
    ],
  },
];

const startBtn = document.getElementById("start-quiz");
const questionContainer = document.getElementById("question-container");
const quizStartContainer = document.getElementById("quiz-start-container");
const questionCount = document.getElementById("question-count");

const START = 5;
let seconds = START;
let interval = null;

const timer = document.getElementById("timer");

function updateTimer() {
  timer.textContent = seconds;
  if (seconds === 0) {
    clearInterval(interval)
    interval = null;
    timer.textContent = "Time up!";
    const selected = document.querySelector("input[name=answer]:checked",);
    if(selected && quizData[currentQuestionIndex].options[selected.value].correct) {
      score++
    }
    displayResult()
    return;
  }
  seconds--;
}

function startTimer() {
  clearInterval(interval);
  seconds = START;
  updateTimer();
  interval = setInterval(updateTimer, 1000);
}

startBtn.addEventListener("click", () => {
  quizStartContainer.classList.add("hidden");
  questionContainer.classList.remove("hidden");
  displayQuestion()
  startTimer();
});

const question = document.getElementById("question-text");
const options = document.getElementById("options-list");
const nextBtn = document.getElementById("next-btn");
const finishBtn = document.getElementById("finish-btn");

const defaultClasses = [
  "border-white/10",
  "bg-white/[0.03]",
  "hover:bg-white/[0.08]",
];

function checkSelectedAnswer(selectedRadio, currentQuestion) {
  const allRadios = options.querySelectorAll('input[name="answer"]');

  allRadios.forEach((radio) => {
    radio.disabled = true;
  });

  const selectedIndex = parseInt(selectedRadio.value);
  const selectedAnswer = currentQuestion.options[selectedIndex];
  const selectedLabel = selectedRadio.closest(".quiz-option");

  selectedLabel.classList.remove(...defaultClasses);

  if (selectedAnswer.correct) {
    selectedLabel.classList.add("border-emerald-500/40", "bg-emerald-500/15");
  } else {
    selectedLabel.classList.add("border-rose-500/40", "bg-rose-500/15");

    const correctIndex = currentQuestion.options.findIndex((a) => a.correct);
    const correctLabel = allRadios[correctIndex].closest(".quiz-option");

    correctLabel.classList.remove(...defaultClasses);
    correctLabel.classList.add("border-emerald-500/40", "bg-emerald-500/15");
  }
}

let currentQuestionIndex = 0;

function displayQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  question.textContent = currentQuestion.question;
  questionCount.textContent = `${currentQuestionIndex + 1} of ${quizData.length} Questions`;

  options.innerHTML = "";

  currentQuestion.options.forEach((answer, index) => {
    const choice = document.createElement("div");
    choice.innerHTML = `
          <label class="quiz-option cursor-pointer border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl p-4 flex items-center gap-3 transition duration-200">
            <input type="radio" name="answer" value="${index}" class="w-4 h-4 text-pink-500 bg-gray-900 border-gray-600 focus:ring-pink-500">
            <span class="text-gray-200 text-sm sm:text-base">${answer.text}</span>
          </label>
        `;

    options.appendChild(choice);
    const radio = choice.querySelector('input[name="answer"]');

    radio.addEventListener("change", () => {
      checkSelectedAnswer(radio, currentQuestion);
    });
  });

  if (currentQuestionIndex === quizData.length - 1) {
    nextBtn.classList.add("hidden");
    finishBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    finishBtn.classList.add("hidden");
  }
}
displayQuestion();

function checkAnswer() {
  const selectedAnswerIndex = document.querySelector(
    "input[name=answer]:checked",
  );

  if (!selectedAnswerIndex) {
    alert("Please select an answer first!");
    return false;
  }

  const selectedAnswer = parseInt(selectedAnswerIndex.value);

  if (quizData[currentQuestionIndex].options[selectedAnswer].correct) {
    score++;
  }

  return true;
}

nextBtn.addEventListener("click", () => {
  if (!checkAnswer()) return;

  currentQuestionIndex++;
  displayQuestion();
  startTimer();
});

let score = 0;
const resultContainer = document.getElementById("result-section");
const scoreElement = document.getElementById("score");
const resetBtn = document.getElementById("reset-btn");

finishBtn.addEventListener("click", displayResult);

function displayResult() {
  // if (!checkAnswer()) return;
  clearInterval(interval);
  interval = null
  questionContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  scoreElement.textContent = `${score} / ${quizData.length}`;
}

resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null
  currentQuestionIndex = 0;
  score = 0;
  resultContainer.classList.add("hidden");
  questionContainer.classList.add("hidden");
  quizStartContainer.classList.remove("hidden");
});
