// views
import wordsBoxClass from "./views/words-box";
import addBoxClass from "./views/add-box";
import playBoxClass from "./views/play-box";
// models
import notesClass from "./models/notes";
import playGameClass from "./models/playGame";

const wordsBox = new wordsBoxClass();
const addBox = new addBoxClass();
const notes = new notesClass();
const playBox = new playBoxClass();
const playGame = new playGameClass();

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

playBox.setCallback({
    funcName: "playCallback",
    func: (play) => {
        if (play) {
            wordsBox.showBox(false);
            playBox.printWord(playGame.play(notes.words));
        } else {
            wordsBox.showBox(true);
            wordsBox.printWords(notes.words);
        }
    },
});

playBox.setCallback({
    funcName: "passCallback",
    func: () => {
        notes.decreasePriority(playGame.currentWordIndex);
        playBox.printWord(playGame.play(notes.words));
    },
});

playBox.setCallback({
    funcName: "checkCallback",
    func: (check) => {
        if (check) {
            notes.increasePriority(playGame.currentWordIndex);
        } else {
            playBox.printWord(playGame.play(notes.words));
        }
    },
});

notes.loadWords(notes.notes[0]);
