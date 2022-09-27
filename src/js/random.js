const priorityRandom = (list) => {
    const cumulativeWeights = [];
    list.forEach((word, idx) => {
        console.log(word, idx);
        cumulativeWeights[idx] =
            word.priority + (cumulativeWeights[idx - 1] || 0);
    });

    const maxcumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
    const ran = Math.floor(Math.random() * maxcumulativeWeight);

    for (let idx = 0; idx < cumulativeWeights.length; idx += 1) {
        if (cumulativeWeights[idx] >= ran) {
            return idx;
        }
    }
};

export default priorityRandom;
