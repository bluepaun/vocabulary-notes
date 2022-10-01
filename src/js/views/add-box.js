export default class {
    //addWord
    callbacks = {};
    constructor() {
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

    setCallback({ funcName, func }) {
        this.callbacks[funcName] = func;
    }

    handleSubmit(event) {
        event.preventDefault();
        const inputs = this.myClass.box.querySelectorAll("input");
        //need to edit view must not have data format
        const newWord = {
            priority: 10,
            data: inputs[0].value,
            meaning: inputs[1].value,
            exampleSentence: inputs[2].value,
        };
        inputs.forEach((input) => (input.value = ""));

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
