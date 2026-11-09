const quizData = {
  JavaScript: [
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
  ],

  HTML: [
    {
      question: "Which tag is used to define a paragraph in HTML?",
      options: [
        { text: "<para>", correct: false },
        { text: "<p>", correct: true },
        { text: "<pg>", correct: false },
        { text: "<paragraph>", correct: false },
      ],
    },
    {
      question: "What does HTML stand for?",
      options: [
        { text: "Hyper Text Markup Language", correct: true },
        { text: "High Text Markup Language", correct: false },
        { text: "Hyperlinks Text Markup Language", correct: false },
        { text: "Home Tool Markup Language", correct: false },
      ],
    },
    {
      question: "What is the purpose of the <br> tag?",
      options: [
        { text: "Start a new paragraph", correct: false },
        { text: "Break line", correct: true },
        { text: "Bold text", correct: false },
        { text: "Create a list", correct: false },
      ],
    },
    {
      question: "What does the <table> tag do in HTML?",
      options: [
        { text: "Creates a frame", correct: false },
        { text: "Creates a table", correct: true },
        { text: "Creates a section", correct: false },
        { text: "Creates a list", correct: false },
      ],
    },
    {
      question: "Which tag creates the largest heading in HTML?",
      options: [
        { text: "<h6>", correct: false },
        { text: "<h1>", correct: true },
        { text: "<header>", correct: false },
        { text: "<head>", correct: false },
      ],
    },
  ],

  CSS: [
    {
      question: "What does CSS stand for?",
      options: [
        { text: "Computer Style Sheets", correct: false },
        { text: "Cascading Style Sheets", correct: true },
        { text: "Creative Style Sheets", correct: false },
        { text: "Control Style Sheets", correct: false },
      ],
    },
    {
      question: "Which property is used to change the background color?",
      options: [
        { text: "color", correct: false },
        { text: "bgcolor", correct: false },
        { text: "background-color", correct: true },
      ],
    },
    {
      question: "Which HTML tag is used to define an internal style sheet?",
      options: [
        { text: "<style>", correct: true },
        { text: "<css>", correct: false },
        { text: "<script>", correct: false },
      ],
    },
    {
      question: "Which CSS property controls the text size?",
      options: [
        { text: "text-size", correct: false },
        { text: "text-color", correct: false },
        { text: "font-size", correct: true },
        { text: "font-style", correct: false },
      ],
    },
    {
      question: "How do you change the text color of an element?",
      options: [
        { text: "color", correct: true },
        { text: "fgcolor", correct: false },
        { text: "text-color", correct: false },
        { text: "font-color", correct: false },
      ],
    },
  ],
};

const startBtn = document.getElementById("start-quiz");
const questionContainer = document.getElementById("question-container");
const quizStartContainer = document.getElementById("quiz-start-container");
const questionCount = document.getElementById("question-count");
const timer = document.getElementById("timer");

const question = document.getElementById("question-text");
const options = document.getElementById("options-list");
const nextBtn = document.getElementById("next-btn");
const finishBtn = document.getElementById("finish-btn");

const resultContainer = document.getElementById("result-section");
const resultTitle = document.getElementById("result-title");
const scoreElement = document.getElementById("score");
const resetBtn = document.getElementById("reset-btn");

// Modal Elements
const modal = document.getElementById("popup-modal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalCross");

// Global State Variables
let selectedCategory = null;
let currentQuestionsArray = [];
let currentQuestionIndex = 0;
let score = 0;

const START = 10;
let seconds = START;
let interval = null;

const defaultClasses = ["border-white/10", "bg-white/[0.03]", "hover:bg-white/[0.08]"];

// 1. Category Selector Buttons Binding
const categoryButtons = document.querySelectorAll("#category-container button");

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => {
      b.classList.remove("bg-pink-600", "border-pink-600");
      b.classList.add("bg-white/5", "border-white/10");
    });

    btn.classList.remove("bg-white/5", "border-white/10");
    btn.classList.add("bg-pink-600", "border-pink-600");

    let catName = btn.innerText.trim();
    if (catName === "HTML") catName = "HTML";
    if (catName === "CSS") catName = "CSS";
    if (catName === "JavaScript") catName = "JavaScript";
    if (catName === "ReactJS") catName = "ReactJS";

    if (quizData[catName]) {
      selectedCategory = catName;
      currentQuestionsArray = quizData[catName];
    }
  });
});

// 2. Timer Functions
function updateTimer() {
  timer.textContent = seconds;
  if (seconds === 0) {
    clearInterval(interval);
    interval = null;
    timer.textContent = "Time up!";
    const selected = document.querySelector("input[name=answer]:checked");
    if (selected && currentQuestionsArray[currentQuestionIndex].options[selected.value].correct) {
      score++;
    }
    displayResult();
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

// 3. Start Quiz Handler
startBtn.addEventListener("click", () => {
  if (!selectedCategory) {
    alert("Please select a category first!");
    return;
  }

  quizStartContainer.classList.add("hidden");
  questionContainer.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  displayQuestion();
  startTimer();
});

// 4. Option Selection Visual Styling
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


// 5. Display Current Question
function displayQuestion() {
  const currentQuestion = currentQuestionsArray[currentQuestionIndex];
  question.textContent = currentQuestion.question;
  questionCount.textContent = `${currentQuestionIndex + 1} of ${currentQuestionsArray.length} Questions`;

  options.innerHTML = "";

  currentQuestion.options.forEach((answer, index) => {
    const choice = document.createElement("div");
    choice.innerHTML = `
      <label class="quiz-option cursor-pointer border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl p-4 flex items-center gap-3 transition duration-200">
        <input type="radio" name="answer" value="${index}" class="w-4 h-4 text-pink-500 bg-gray-900 border-gray-600 focus:ring-pink-500">
        <span class="text-gray-200 text-sm sm:text-base option-text"></span>
      </label>
    `;

    choice.querySelector(".option-text").textContent = answer.text;

    options.appendChild(choice);
    const radio = choice.querySelector('input[name="answer"]');

    radio.addEventListener("change", () => {
      checkSelectedAnswer(radio, currentQuestion);
    });
  });

  if (currentQuestionIndex === currentQuestionsArray.length - 1) {
    nextBtn.classList.add("hidden");
    finishBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    finishBtn.classList.add("hidden");
  }
}

// 6. Check Answer before going Next
function checkAnswer() {
  const selectedAnswerIndex = document.querySelector("input[name=answer]:checked");

  if (!selectedAnswerIndex) {
    alert("Please select an answer first!");
    return false;
  }

  const selectedAnswer = parseInt(selectedAnswerIndex.value);
  if (currentQuestionsArray[currentQuestionIndex].options[selectedAnswer].correct) {
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

finishBtn.addEventListener("click", () => {
  if (checkAnswer()) {
    displayResult();
  }
});

// Result of Quiz
function displayResult() {
  clearInterval(interval);
  interval = null;
  questionContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  resultTitle.textContent = `${selectedCategory} Quiz Results`;
  scoreElement.textContent = `${score} / ${currentQuestionsArray.length}`;
}

resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  currentQuestionIndex = 0;
  score = 0;
  selectedCategory = null;

  categoryButtons.forEach((b) => {
    b.classList.remove("bg-pink-600", "border-pink-600");
    b.classList.add("bg-white/5", "border-white/10");
  });

  resultContainer.classList.add("hidden");
  questionContainer.classList.add("hidden");
  quizStartContainer.classList.remove("hidden");
});

/*============ Modal Operations ===============*/
openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});