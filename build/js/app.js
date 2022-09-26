(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _test = _interopRequireDefault(require("./test"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const addWordList = newWord => {
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

const deleteWord = event => {
  const target = event.target;
  const index = target.getAttribute("data-index");
  wordList.splice(index, 1);
  saveWordList();
  printWordList();
};

addWordForm.addEventListener("submit", event => {
  event.preventDefault();
  const inputs = addWordForm.querySelectorAll("input");
  console.log(inputs);
  const newWord = {
    priority: 1,
    data: inputs[0].value,
    meaning: inputs[1].value,
    exampleSentence: inputs[2].value
  };
  inputs.forEach(input => input.value = "");
  console.log(newWord);
  addWordList(newWord);
});
loadWordList();

},{"./test":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const test = () => {
  console.log("Hello world from imported js");
};

var _default = test;
exports.default = _default;

},{}]},{},[1]);
