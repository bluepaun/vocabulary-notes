import test from "./test";

const addBtn = document.querySelector(".addBtn");
const addWordForm = document.querySelector(".add-word-form");
const wordListBox = document.querySelector(".word-list");
const playBox = document.querySelector(".play");

let wordList = [];

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
        priority: 1,
        data: inputs[0].value,
        meaning: inputs[1].value,
        exampleSentence: inputs[2].value,
    };
    inputs.forEach((input) => (input.value = ""));
    console.log(newWord);
    addWordList(newWord);
});

loadWordList();
