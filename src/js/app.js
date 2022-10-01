import priorityRandom from "./random";
import wordsBoxClass from "./views/words-box";
import addBoxClass from "./views/add-box";
import notesClass from "./models/notes";

const wordsBox = new wordsBoxClass();
const addBox = new addBoxClass();
const notes = new notesClass();

const playBox = document.querySelector(".play");

addBox.setCallback({
    funcName: "addWord",
    func: (newWord) => {
        notes.addWord(newWord);
        wordsBox.printWords(notes.words);
    },
});

wordsBox.setCallback({
    funcName: "deleteWord",
    func: (index) => {
        notes.deleteWord(index);
        wordsBox.printWords(notes.words);
    },
});

notes.setCallback({
    funcName: "loadWordComplete",
    func: (words) => {
        wordsBox.printWords(words);
    },
});

notes.loadWords(notes.notes[0]);

let currentWordIndex = 0;
const priorityStep = 1;

const playBtn = document.querySelector(".playBtn");

playBtn.addEventListener("click", (event) => {
    const target = event.target;
    if (target.innerText === "start") {
        wordsBox.classList.add("hidden");
        playBox.classList.remove("hidden");
        target.innerText = "stop";
        playGame();
    } else {
        playBox.classList.add("hidden");
        wordsBox.classList.remove("hidden");
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
        passBtn.disabled = true;
    } else {
        target.innerText = "check";
        playGame();
        passBtn.disabled = false;
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
