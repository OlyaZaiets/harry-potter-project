'use strict';

let allSpellsGlobal = [];

let currentSearch = '';
let currentCategory = 'all';

async function loadSpells() {
    const allSpells = [];
    const initialUrl = 'https://api.potterdb.com/v1/spells';
    const loading = document.querySelector('.snitch-loader');
    const showLoading = () => loading.classList.remove('hidden');
    const hideLoading = () => loading.classList.add('hidden'); 
    
    const currentTime = Date.now();
    
    showLoading();

    try {
        const response = await fetch(initialUrl);
        if (!response.ok) {
            throw new Error (`HTTP error! status: ${response.status}`);
        } 

        const data = await response.json();

        const totalPages = data.meta.pagination.last;
        
        allSpells.push(...data.data);

        if (totalPages <=1) {
            return allSpells;
        }

        const promiseQueue = [];

        for (let i = 2; i <= totalPages; i++) {
            let pageUrl = `https://api.potterdb.com/v1/spells?page[number]=${i}`;
            promiseQueue.push(
                fetch(pageUrl).then(res => {
                    if (!res.ok) {
                        throw new Error (`Error loading page ${i}: ${res.status}`)
                    }
                    return res.json()
                    })
            );
        }

        const remainingData = await Promise.all(promiseQueue);

        remainingData.forEach(page => allSpells.push(...page.data));

        const elapsed = Date.now() - currentTime;
        const remaining = 2000 - elapsed;

        if (remaining > 0) {
            setTimeout(() => {
                hideLoading();
                displaySpellCards(allSpells);
            }, remaining)
        } else {
                hideLoading();
                displaySpellCards(allSpells);
        }

        allSpellsGlobal = allSpells;

        return allSpells;
    } catch(error) {
        console.error(error);
    }
}

function loadOptionForCategory(categoryNames){
    const options = document.getElementById('spell-category');
    if (!options) {
        console.log(`Options with ID 'spell-category' didn't found`);
        return;
    }

    options.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = 'all';
    defaultOption.innerText = 'All categories';
    options.appendChild(defaultOption);
    categoryNames.forEach(categoryName => {
        const option = document.createElement('option');
        option.textContent = categoryName;
        option.value = categoryName;

        options.appendChild(option)

    });
}


async function collection() {
    try{
        const allSpells = await loadSpells();
        if (!allSpells) {
            console.error(`Failed to retrieve spell data.`);
            return;
        }

        const allCategories = allSpells.map(spell => spell.attributes.category);
        const filteredCategories = allCategories.filter(category => category);
        const uniqueCategories = [...new Set(filteredCategories)];
        loadOptionForCategory(uniqueCategories);

        setupCategoryFilter();

        searchListener();

    } catch(error) {
        console.error(error);
    }
}

collection();

function updatedSpells() {
    let filteredSpells = allSpellsGlobal;

    if (currentCategory !== 'all') {
        filteredSpells = filteredSpells.filter(spell => 
            spell.attributes.category?.includes(currentCategory)
        );
    }
    
    if (currentSearch !== '') {
        filteredSpells = filteredSpells.filter(spell => {
            const name = spell.attributes.name?.toLowerCase() || '' ;
            const effect = spell.attributes.effect?.toLowerCase() || '';
            const light = spell.attributes.light?.toLowerCase() || '';
            const incantation = spell.attributes.incantation?.toLowerCase() || '';
            const hand = spell.attributes.hand?.toLowerCase() || '';
            const category = spell.attributes.category?.toLowerCase() || '';

            return name.includes(currentSearch) || effect.includes(currentSearch) 
                || light.includes(currentSearch) || incantation.includes(currentSearch)
                || hand.includes(currentSearch) || category.includes(currentSearch);
        })
    }
    if (!filteredSpells || filteredSpells.length === 0) {
        document.querySelector('.not-found-container').hidden = false;
    } else {
        document.querySelector('.not-found-container').hidden = true;
    }
    displaySpellCards(filteredSpells)
}

function searchListener() {
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', () => {
        currentSearch = searchInput.value.trim().toLowerCase();

        updatedSpells();
    })
}

function setupCategoryFilter() {
    const categorySelect = document.getElementById('spell-category');

    categorySelect.addEventListener('change', () => {
        currentCategory = categorySelect.value;

        updatedSpells();
    })
}

function displaySpellCards(spells) {
    const container = document.querySelector('.spell-cards-container');
    if (!container) {
        console.error(`Container with class 'spell-cards-container' didn't found`);
        return;
    }

    container.innerHTML = '';

    const highlightRegex = currentSearch 
        ? new RegExp(`(${currentSearch})`, 'gi') 
        : null;

    spells.forEach(spell => {
        const spellCard = document.createElement('div');
        spellCard.classList.add('spell-card');

        const highlight = (text) => {
            if (!highlightRegex || !text) return text;
            return text.replace(highlightRegex, `<mark>$1</mark>`);
        };

        const name = document.createElement('h2');
        const nameTextContent = spell.attributes.name ?  spell.attributes.name : `Name: Hermione forgot to write it down.`;
        name.innerHTML = `Name: ${highlight(nameTextContent)}`

        const incantation = document.createElement('h2');
        const incantationTextContent = spell.attributes.incantation ? spell.attributes.incantation
            : `Incantation: Hermione forgot to write it down.`;
        incantation.innerHTML = `Incantation: ${highlight(incantationTextContent)}` 

        const effect = document.createElement('h2');
        const effectTextContent = spell.attributes.effect ? spell.attributes.effect : `Effect: Try it yourself on a mannequin`; 
        effect.innerHTML = `Effect: ${highlight(effectTextContent)}`

        const category = document.createElement('h2');
        const categoryTextContent = spell.attributes.category ? spell.attributes.category : 'Category: All the answers are in the library';
        category.innerHTML = `Category: ${highlight(categoryTextContent)}`

        const light = document.createElement('h2');
        const lightTextContent = spell.attributes.light ? spell.attributes.light : `Light: Try it yourself on a mannequin`;
        light.innerHTML = `Light: ${highlight(lightTextContent)}`
        
        const hand = document.createElement('h2');
        const handTextContent = spell.attributes.hand ? spell.attributes.hand : `Hand: All the answers are in the library`;
        hand.innerHTML = `Hand: ${highlight(handTextContent)}`


        spellCard.appendChild(name);
        spellCard.appendChild(incantation);
        spellCard.appendChild(effect);
        spellCard.appendChild(category);
        spellCard.appendChild(light);
        spellCard.appendChild(hand);

        container.appendChild(spellCard)


        const spells= document.querySelectorAll('.spell-card');
            spells.forEach((spell, index) => {
                setTimeout(() => spell.classList.add('show'), index * 100);
            });
    })
}
