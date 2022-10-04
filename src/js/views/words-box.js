class wordList {
    callbacks = {};
    notiHighColor = [0xff, 0x00, 0x00];
    notiMidColor = [0x00, 0x00, 0xff];
    notiLowColor = [0x00, 0xff, 0x00];
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
            this.box.classList.add("hidden");
        }
    }

    setCallback({ funcName, func }) {
        this.callbacks[funcName] = func;
    }

    pickHex(color1, color2, weight) {
        const w1 = weight;
        const w2 = 1 - w1;
        const rgb = [
            Math.round(color1[0] * w1 + color2[0] * w2),
            Math.round(color1[1] * w1 + color2[1] * w2),
            Math.round(color1[2] * w1 + color2[2] * w2),
        ];
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

export default wordList;
