class wordList {
    //deleteWord
    callbacks = {};
    constructor() {
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

    setCallback({ funcName, func }) {
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

export default wordList;
