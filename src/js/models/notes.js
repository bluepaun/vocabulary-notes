export default class {
    callbacks = {};
    priorityStep = 1;
    constructor() {
        // this.legacyTest();
        this.notes = this.loadNotes();
    }

    legacyTest() {
        const newWord = {
            priority: 10,
            data: "this",
            meaning: "is",
            exampleSentence: "test word",
        };
        const list = [];

        list.push(newWord);
        list.push(newWord);
        list.push(newWord);
        localStorage.setItem("wordList", JSON.stringify(list));
    }

    setCallback({ funcName, func }) {
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
                this.words = JSON.parse(localStorage.wordList);
                // localStorage.removeItem("wordList");
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
