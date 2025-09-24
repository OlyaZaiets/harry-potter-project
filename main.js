'use strict'

async function loadFact() {
    const response = await fetch('facts.json');
    const data = await response.json();
    return data.facts; 
}


function createFactPicker(facts) {
    let remainingFacts = [...facts];
    let lastFact = null;

    return function getRandomFact() {
    if (remainingFacts.length === 0) {
        remainingFacts = [...facts];
    } 
    
    let index;
    let fact;

    do {
        index = Math.floor(Math.random() * remainingFacts.length);
        fact = remainingFacts[index];
    } while (fact === lastFact && remainingFacts.length > 1)

    remainingFacts.splice(index,1);
    lastFact = fact;
    return fact;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const factBtn = document.getElementById('fact-btn');
    const factDisplay = document.getElementById('fact-display');
    const facts = await loadFact();
    const getRandomFact = createFactPicker(facts);

    factDisplay.textContent = getRandomFact();
    factDisplay.style.opacity = 1

    factBtn.addEventListener('click', () => {
        factDisplay.style.opacity = 0;
        setTimeout(() => {
            factDisplay.textContent = getRandomFact();
            factDisplay.style.opacity = 1; 
        }, 200);
    });
});