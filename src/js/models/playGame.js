import priorityRandom from "./random";

export default class {
    callbacks = {};
    constructor() {}

    play(words) {
        console.log(words);
        const index = priorityRandom(words);
        this.currentWordIndex = index;
        return words[index];
    }
}
