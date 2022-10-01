(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _random = _interopRequireDefault(require("./random"));

var _wordsBox = _interopRequireDefault(require("./views/words-box"));

var _addBox = _interopRequireDefault(require("./views/add-box"));

var _notes = _interopRequireDefault(require("./models/notes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const wordsBox = new _wordsBox.default();
const addBox = new _addBox.default();
const notes = new _notes.default();
const playBox = document.querySelector(".play");
addBox.setCallback({
  funcName: "addWord",
  func: newWord => {
    notes.addWord(newWord);
    wordsBox.printWords(notes.words);
  }
});
wordsBox.setCallback({
  funcName: "deleteWord",
  func: index => {
    notes.deleteWord(index);
    wordsBox.printWords(notes.words);
  }
});
notes.setCallback({
  funcName: "loadWordComplete",
  func: words => {
    wordsBox.printWords(words);
  }
});
notes.loadWords(notes.notes[0]);
let currentWordIndex = 0;
const priorityStep = 1;
const playBtn = document.querySelector(".playBtn");
playBtn.addEventListener("click", event => {
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
passBtn.addEventListener("click", event => {
  wordList[currentWordIndex].priority -= priorityStep;

  if (wordList[currentWordIndex].priority < 1) {
    wordList[currentWordIndex].priority = 1;
  }

  playGame();
});
const checkBtn = playBox.querySelector(".checkBtn");
checkBtn.addEventListener("click", event => {
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

const printWord = word => {
  const question = playBox.querySelector("h3");
  const sentence = playBox.querySelector("p");
  const mean = playBox.querySelector("span");
  mean.classList.add("hidden");
  question.innerText = word.data;
  sentence.innerText = word.exampleSentence;
  mean.innerHTML = word.meaning;
};

const playGame = () => {
  currentWordIndex = (0, _random.default)(wordList);
  printWord(wordList[currentWordIndex]);
};

},{"./models/notes":2,"./random":3,"./views/add-box":4,"./views/words-box":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "callbacks", {});

    this.legacyTest();
    this.notes = this.loadNotes();
  }

  legacyTest() {
    const newWord = {
      priority: 10,
      data: "this",
      meaning: "is",
      exampleSentence: "test word"
    };
    const list = [];
    list.push(newWord);
    list.push(newWord);
    list.push(newWord);
    localStorage.setItem("wordList", JSON.stringify(list));
  }

  setCallback(_ref) {
    let {
      funcName,
      func
    } = _ref;
    this.callbacks[funcName] = func;
  }

  loadNotes() {
    if (!localStorage.notes) {
      this.notes = ["default"];
      this.saveNotes();
    }

    this.notes = JSON.parse(localStorage.notes);
    return this.notes;
  }

  loadWords(note) {
    this.curNote = note;

    if (localStorage[note]) {
      this.words = JSON.parse(localStorage[note]);
    } else {
      //for ver 1.0 legacy code
      if (localStorage.wordList) {
        this.words = JSON.parse(localStorage.wordList); // localStorage.removeItem("wordList");
      } else {
        this.words = [];
      }

      this.saveCurWords();
    }

    this.callbacks.loadWordComplete(this.words);
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  saveCurWords() {
    localStorage.setItem(this.curNote, JSON.stringify(this.words));
  }

  addWord(word) {
    this.words.push(word);
    this.saveCurWords();
  }

  deleteWord(index) {
    this.words.splice(index, 1);
    this.saveCurWords();
  }

}

exports.default = _default;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const priorityRandom = list => {
  const cumulativeWeights = [];
  list.forEach((word, idx) => {
    console.log(word, idx);
    cumulativeWeights[idx] = word.priority + (cumulativeWeights[idx - 1] || 0);
  });
  const maxcumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
  const ran = Math.floor(Math.random() * maxcumulativeWeight);

  for (let idx = 0; idx < cumulativeWeights.length; idx += 1) {
    if (cumulativeWeights[idx] >= ran) {
      return idx;
    }
  }
};

var _default = priorityRandom;
exports.default = _default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  //addWord
  constructor() {
    _defineProperty(this, "callbacks", {});

    this.btn = document.querySelector(".addBtn");
    this.btn.myClass = this;
    this.form = document.querySelector(".add-word-form");
    this.form.myClass = this;
    this.box = document.querySelector(".add-word");
    this.box.myClass = this;
    this.btn.addEventListener("click", this.handleClickEvent);
    this.form.addEventListener("submit", this.handleSubmit);
  }

  handleClickEvent(event) {
    const curText = this.myClass.btn.innerText;

    if (curText === "add") {
      event.target.innerText = "cancel";
      this.myClass.toggleBox(true);
    } else {
      event.target.innerText = "add";
      this.myClass.toggleBox(false);
    }
  }

  setCallback(_ref) {
    let {
      funcName,
      func
    } = _ref;
    this.callbacks[funcName] = func;
  }

  handleSubmit(event) {
    event.preventDefault();
    const inputs = this.myClass.box.querySelectorAll("input"); //need to edit view must not have data format

    const newWord = {
      priority: 10,
      data: inputs[0].value,
      meaning: inputs[1].value,
      exampleSentence: inputs[2].value
    };
    inputs.forEach(input => input.value = "");
    this.myClass.callbacks.addWord(newWord);
    this.myClass.btn.innerText = "add";
    this.myClass.toggleBox(false);
  }

  toggleBox(on) {
    if (on) {
      this.box.style.transform = "translateY(0)";
    } else {
      this.box.style.transform = "translateY(100%)";
    }
  }

}

exports.default = _default;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class wordList {
  //deleteWord
  constructor() {
    _defineProperty(this, "callbacks", {});

    this.box = document.querySelector(".word-list");
    this.ul = this.box.querySelector("ul");
  }

  get isShowing() {
    return !this.box.classList.contains("hidden");
  }

  showBox(on) {
    if (on) {
      this.box.classList.remove("hidden");
    } else {
      this.box.classList.remove("hidden");
    }
  }

  setCallback(_ref) {
    let {
      funcName,
      func
    } = _ref;
    this.callbacks[funcName] = func;
  }

  handleDeleteWord(event) {
    const target = event.target;
    const index = target.getAttribute("data-index");
    this.callback(index);
  }

  generateListItem(index, item) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("button");
    span.innerText = item.data;
    button.innerText = "del";
    button.callback = this.callbacks.deleteWord;
    button.addEventListener("click", this.handleDeleteWord);
    button.setAttribute("data-index", index);
    li.appendChild(span);
    li.appendChild(button);
    return li;
  }

  clearWordList() {
    this.ul.innerHTML = "";
  }

  printWords(words) {
    if (!this.isShowing) {
      return;
    }

    this.clearWordList();
    words.forEach((word, index) => {
      const li = this.generateListItem(index, word);
      this.ul.appendChild(li);
    });
  }

}

var _default = wordList;
exports.default = _default;

},{}]},{},[1]);
