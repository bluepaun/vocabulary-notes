import priorityRandom from "./random";

const addBtn = document.querySelector(".addBtn");
const addWordbox = document.querySelector(".add-word");
const addWordForm = document.querySelector(".add-word-form");
const wordListBox = document.querySelector(".word-list");
const playBox = document.querySelector(".play");

let wordList = [];

const toggleAddWordBox = (on) => {
    if (on) {
        addWordbox.style.transform = "translateY(0)";
    } else {
        addWordbox.style.transform = "translateY(100%)";
    }
};

addBtn.addEventListener("click", (event) => {
    console.log(event);
    const curText = event.target.innerText;
    if (curText === "add") {
        event.target.innerText = "cancel";
        toggleAddWordBox(true);
    } else {
        event.target.innerText = "add";
        toggleAddWordBox(false);
    }
});

const printWordList = () => {
    if (wordListBox.classList.contains("hidden")) {
        return;
    }
    const ul = wordListBox.querySelector("ul");
    ul.innerHTML = "";
    wordList.forEach((word, index) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        const button = document.createElement("button");
        span.innerText = word.data;
        button.innerText = "del";
        button.addEventListener("click", deleteWord);
        button.setAttribute("data-index", index);
        li.appendChild(span);
        li.appendChild(button);
        ul.appendChild(li);
    });
};

const saveWordList = () => {
    localStorage.setItem("wordList", JSON.stringify(wordList));
};

const addWordList = (newWord) => {
    wordList.push(newWord);
    saveWordList();
    printWordList();
};

const loadWordList = () => {
    if (localStorage.wordList) {
        wordList = JSON.parse(localStorage.wordList);
    }
    console.log(wordList);
    printWordList();
};

const deleteWord = (event) => {
    const target = event.target;
    const index = target.getAttribute("data-index");
    wordList.splice(index, 1);
    saveWordList();
    printWordList();
};

addWordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputs = addWordForm.querySelectorAll("input");
    console.log(inputs);

    const newWord = {
        priority: 10,
        data: inputs[0].value,
        meaning: inputs[1].value,
        exampleSentence: inputs[2].value,
    };
    inputs.forEach((input) => (input.value = ""));
    console.log(newWord);
    addWordList(newWord);
    toggleAddWordBox(false);
});

loadWordList();

let currentWordIndex = 0;
const priorityStep = 1;

const playBtn = document.querySelector(".playBtn");

playBtn.addEventListener("click", (event) => {
    const target = event.target;
    if (target.innerText === "start") {
        wordListBox.classList.add("hidden");
        playBox.classList.remove("hidden");
        target.innerText = "stop";
        playGame();
    } else {
        playBox.classList.add("hidden");
        wordListBox.classList.remove("hidden");
        target.innerText = "start";
    }
});

const passBtn = playBox.querySelector(".passBtn");
passBtn.addEventListener("click", (event) => {
    wordList[currentWordIndex].priority -= priorityStep;
    if (wordList[currentWordIndex].priority < 1) {
        wordList[currentWordIndex].priority = 1;
    }
    playGame();
});

const checkBtn = playBox.querySelector(".checkBtn");
checkBtn.addEventListener("click", (event) => {
    const target = event.target;
    if (target.innerText === "check") {
        wordList[currentWordIndex].priority += priorityStep;
        target.innerText = "next";
        const mean = playBox.querySelector("span");
        mean.classList.remove("hidden");
    } else {
        target.innerText = "check";
        playGame();
    }
});

const printWord = (word) => {
    const question = playBox.querySelector("h3");
    const sentence = playBox.querySelector("p");
    const mean = playBox.querySelector("span");
    mean.classList.add("hidden");

    question.innerText = word.data;
    sentence.innerText = word.exampleSentence;
    mean.innerHTML = word.meaning;
};

const playGame = () => {
    currentWordIndex = priorityRandom(wordList);
    printWord(wordList[currentWordIndex]);
};
