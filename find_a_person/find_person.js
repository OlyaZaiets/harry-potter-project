'use strict';

let allCharacters = [];

let filters = {
    name: null,
    house: null,
    gender: null,
    ancestry: null,
    role: null
}

loadCharacters();

async function loadCharacters() {
    const loading = document.querySelector('.snitch-loader');
    const showLoading = () => loading.classList.remove('hidden');
    const hideLoading = () => {
    loading.classList.add('fade-out'); 
    // після завершення transition прибираємо з DOM
    loading.addEventListener('transitionend', () => {
        loading.classList.add('hidden'); 
    }, { once: true });
};

    showLoading();
    const currentTime = Date.now();

    try {
        const response = await fetch('https://hp-api.onrender.com/api/characters');
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const characters = await response.json();
    
        allCharacters = characters.filter(ch => ch.hogwartsStudent || ch.hogwartsStaff)

        const elapsed = Date.now() - currentTime;
        const remaining = 2000 - elapsed;

        const showCards = () => {
        displayCard(allCharacters);

        searchCharacter();
        setupHouseFilter();
        setupGenderFilter();
        setupAncestryFilter();
        setupBelonging();
        reseatFilter();
        }

        if (remaining > 0) {
            setTimeout(() => {
                hideLoading(); 
                showCards();
            }, remaining); 

        } else {
            hideLoading();
            showCards();
        }

    } catch(error) {
        console.error('Error fetching characters:', error);
        hideLoading();
    }
}

function applyFilters() {
    let filtered = allCharacters;

// loop + opt.

    if (filters.name) filtered = filtered.filter(ch => ch.name.toLowerCase().includes(filters.name) || (ch.alternate_names || []).some(altName => altName.toLowerCase().includes(filters.name)));
    
    if (filters.house) filtered = filtered.filter(ch => ch.house === filters.house);
    if (filters.gender && filters.gender !== 'all') {
            filtered = filtered.filter(ch => ch.gender === filters.gender)
        }
    if (filters.ancestry !== null) {
        filtered = filtered.filter(ch => ch.ancestry === filters.ancestry);
    }
    if (filters.role) {
        if(filters.role === 'student') {
            filtered = filtered.filter(ch => ch.hogwartsStudent);
        } else if (filters.role === 'staff') {
            filtered = filtered.filter(ch => ch.hogwartsStaff);
        }
    }

    if (!filtered || filtered.length === 0) {
        document.querySelector('.not-found-container').hidden = false;
    } else {
        document.querySelector('.not-found-container').hidden = true;
    }

    displayCard(filtered) 
}

function searchCharacter() {
    const searchInput = document.querySelector('.search-input');

    searchInput.addEventListener('input', () => {
        filters.name = searchInput.value.trim().toLowerCase();

        applyFilters();
    })
}

function setupHouseFilter () {
    document.querySelectorAll('.btn-houses').forEach(button => {
        button.addEventListener('click', () => {
            filters.house = button.dataset.house;
        applyFilters();
        });
    });
}

function setupGenderFilter () {
    const genderSelect = document.getElementById('gender-search');

    genderSelect.addEventListener('change', () => {
        filters.gender = genderSelect.value;
        applyFilters();
    });
}

function setupAncestryFilter() {
    const ancestrySelect = document.getElementById('ancestry-search');

    ancestrySelect.addEventListener('change', () => {
        if (ancestrySelect.value === 'unknown') {
            filters.ancestry = '';
        } else {
            filters.ancestry = ancestrySelect.value || null;
        }
        applyFilters();
    });
}

function setupBelonging() {
    const radios = document.querySelectorAll('input[name="role"]');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            filters.role = radio.checked ? radio.id : null;
        applyFilters();
        })
    });
}

function reseatFilter() {
    const reset = document.querySelector('.btn-clean-all');

    reset.addEventListener('click', () => {

        filters = {
            name: null,
            house: null,
            gender: null,
            ancestry: null,
            role: null
    }

    document.querySelector('.search-input').value =  '';
    document.getElementById('gender-search').value = 'all';
    document.getElementById('ancestry-search').value = '';
    document.querySelectorAll('input[name="role"]').forEach(radio => radio.checked = false);

    displayCard(allCharacters);
    })
}

function displayCard(characters) {
    const container = document.getElementById('container-characters-card');
    container.innerHTML = '';

    characters.forEach(character => {
        const card = document.createElement('div');
        card.classList.add('character-card');

            const containerImage = document.createElement('div');
            containerImage.classList.add('container-image');

            const img = document.createElement('img');
            img.src = character.image ? character.image : 'in_process.png';
            img.alt = character.name;
            img.classList.add('character-card-photo');

            containerImage.appendChild(img);

            const characterCharacteristic = document.createElement('div');
            characterCharacteristic.classList.add('character-characteristic-text');


            const name = document.createElement('h3');
            name.textContent = character.name ? `Name: ${character.name}` : `Name: We don't know`;

            let house = document.createElement('h3');
            house.textContent =  character.house ?`House: ${character.house}` : `House: Hard to say`;

            if (character.house === 'Gryffindor') {
                card.classList.add('house-gryffindor');
            } else if (character.house === 'Ravenclaw') {
                card.classList.add('house-ravenclaw');
            } else if (character.house === 'Slytherin') {
                card.classList.add('house-slytherin');
            } else if (character.house === 'Hufflepuff') {
                card.classList.add('house-hufflepuff');
            } else {
                card.classList.add('house-undefined');
            }

            const gender = document.createElement('h3');
            gender.textContent = character.gender ? `Gender: ${character.gender}`: `Gender: Hard to say`;

            const ancestry = document.createElement('h3');
            ancestry.textContent = character.ancestry ? `Ancestry: ${character.ancestry}` : `Ancestry: Hard to say`;

            const specie = document.createElement('h3');
            specie.textContent = character.species ? `Specie: ${character.species}`: `Specie: Hard to say`;

            const yearOfBirth = document.createElement('h3');
            yearOfBirth.textContent = character.yearOfBirth ? `Year of birth: ${character.yearOfBirth}` : `Year of birth: Hard to say`;

            const student = document.createElement('h3');
            student.textContent = character.hogwartsStudent ? `Student: Yes` : `Student: No`;

            const staff = document.createElement('h3');
            staff.textContent = character.hogwartsStaff ? `Staff: Yes` : `Staff: No`;


            // 
            characterCharacteristic.appendChild(name);
            characterCharacteristic.appendChild(yearOfBirth);
            characterCharacteristic.appendChild(house);
            characterCharacteristic.appendChild(gender);
            characterCharacteristic.appendChild(ancestry);
            characterCharacteristic.appendChild(specie);
            characterCharacteristic.appendChild(student);
            characterCharacteristic.appendChild(staff);

            card.appendChild(containerImage)
            card.appendChild(characterCharacteristic);

            container.appendChild(card);

            const cards = document.querySelectorAll('.character-card');
                cards.forEach((card, index) => {
                    setTimeout(() => card.classList.add('show'), index * 100);
            });

    });
}
