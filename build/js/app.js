(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _wordsBox = _interopRequireDefault(require("./views/words-box"));

var _addBox = _interopRequireDefault(require("./views/add-box"));

var _playBox = _interopRequireDefault(require("./views/play-box"));

var _notes = _interopRequireDefault(require("./models/notes"));

var _playGame = _interopRequireDefault(require("./models/playGame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// views
// models
const wordsBox = new _wordsBox.default();
const addBox = new _addBox.default();
const notes = new _notes.default();
const playBox = new _playBox.default();
const playGame = new _playGame.default();
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
playBox.setCallback({
  funcName: "playCallback",
  func: play => {
    if (play) {
      wordsBox.showBox(false);
      playBox.printWord(playGame.play(notes.words));
    } else {
      wordsBox.showBox(true);
      wordsBox.printWords(notes.words);
    }
  }
});
playBox.setCallback({
  funcName: "passCallback",
  func: () => {
    notes.decreasePriority(playGame.currentWordIndex);
    playBox.printWord(playGame.play(notes.words));
  }
});
playBox.setCallback({
  funcName: "checkCallback",
  func: check => {
    if (check) {
      notes.increasePriority(playGame.currentWordIndex);
    } else {
      playBox.printWord(playGame.play(notes.words));
    }
  }
});
notes.loadWords(notes.notes[0]);

},{"./models/notes":2,"./models/playGame":3,"./views/add-box":5,"./views/play-box":6,"./views/words-box":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "callbacks", {});

    _defineProperty(this, "priorityStep", 1);

    // this.legacyTest();
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

  increasePriority(index) {
    this.words[index].priority += this.priorityStep;
    this.saveCurWords();
  }

  decreasePriority(index) {
    this.words[index].priority -= this.priorityStep;

    if (this.words[index].priority < 1) {
      this.words[index].priority = 1;
    }

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

var _random = _interopRequireDefault(require("./random"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "callbacks", {});
  }

  play(words) {
    const index = (0, _random.default)(words);
    this.currentWordIndex = index;
    return words[index];
  }

}

exports.default = _default;

},{"./random":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const priorityRandom = list => {
  const cumulativeWeights = [];
  list.forEach((word, idx) => {
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "callbacks", {});

    this.btn = document.querySelector(".playBtn");
    this.btn.myClass = this;
    this.box = document.querySelector(".play");
    this.box.myClass = this;
    this.passBtn = this.box.querySelector(".passBtn");
    this.passBtn.myClass = this;
    this.checkBtn = this.box.querySelector(".checkBtn");
    this.checkBtn.myClass = this;
    this.question = this.box.querySelector("h3");
    this.example = this.box.querySelector("p");
    this.mean = this.box.querySelector("span");
    this.btn.addEventListener("click", this.handlePlay);
    this.passBtn.addEventListener("click", this.handlePass);
    this.checkBtn.addEventListener("click", this.handleCheck);
  }

  showBox(on) {
    if (on) {
      this.box.classList.remove("hidden");
    } else {
      this.box.classList.add("hidden");
    }
  }

  setCallback(_ref) {
    let {
      funcName,
      func
    } = _ref;
    this.callbacks[funcName] = func;
  }

  handlePlay(event) {
    if (this.innerText === "start") {
      this.myClass.showBox(true);
      this.innerText = "stop";
      this.myClass.callbacks.playCallback(true);
    } else {
      this.myClass.showBox(false);
      this.innerText = "start";
      this.myClass.callbacks.playCallback(false);
    }
  }

  handlePass(event) {
    this.myClass.callbacks.passCallback();
  }

  handleCheck(event) {
    if (this.innerText === "check") {
      this.innerText = "next";
      this.myClass.passBtn.disabled = true;
      this.myClass.mean.classList.remove("hidden");
      this.myClass.callbacks.checkCallback(true);
    } else {
      this.innerText = "check";
      this.myClass.passBtn.disabled = false;
      this.myClass.callbacks.checkCallback(false);
    }
  }

  printWord(word) {
    this.mean.classList.add("hidden");
    this.question.innerText = word.data;
    this.example.innerText = word.exampleSentence;
    this.mean.innerText = word.meaning;
  }

}

exports.default = _default;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class wordList {
  constructor() {
    _defineProperty(this, "callbacks", {});

    _defineProperty(this, "notiHighColor", [0xff, 0x00, 0x00]);

    _defineProperty(this, "notiMidColor", [0x00, 0x00, 0xff]);

    _defineProperty(this, "notiLowColor", [0x00, 0xff, 0x00]);

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
      this.box.classList.add("hidden");
    }
  }

  setCallback(_ref) {
    let {
      funcName,
      func
    } = _ref;
    this.callbacks[funcName] = func;
  }

  pickHex(color1, color2, weight) {
    const w1 = weight;
    const w2 = 1 - w1;
    const rgb = [Math.round(color1[0] * w1 + color2[0] * w2), Math.round(color1[1] * w1 + color2[1] * w2), Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
  }

  handleDeleteWord(event) {
    const target = event.target;
    const index = target.getAttribute("data-index");
    this.callback(index);
  }

  generateListItem(index, item) {
    const li = document.createElement("li");
    const noti = document.createElement("div");
    const span = document.createElement("span");
    const button = document.createElement("button");
    span.innerText = item.data;
    let weight = item.priority / 20;

    if (weight > 1) {
      weight = 1;
    }

    let rgb;

    if (weight > 0.5) {
      weight -= 0.5;
      weight /= 0.5;
      rgb = this.pickHex(this.notiHighColor, this.notiMidColor, weight);
    } else {
      weight /= 0.5;
      rgb = this.pickHex(this.notiMidColor, this.notiLowColor, weight);
    }

    noti.style.backgroundColor = `rgba(${rgb.join()},1)`;
    button.innerText = "del";
    button.callback = this.callbacks.deleteWord;
    button.addEventListener("click", this.handleDeleteWord);
    button.setAttribute("data-index", index);
    li.appendChild(span);
    li.appendChild(noti);
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
