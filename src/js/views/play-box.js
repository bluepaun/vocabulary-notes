export default class {
    callbacks = {};
    constructor() {
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

    setCallback({ funcName, func }) {
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
