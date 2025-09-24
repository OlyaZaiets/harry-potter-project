'use strict';

let allCharacters = [];

loadCharacters();


async function loadCharacters() {
    try {
        const response = await fetch('https://hp-api.onrender.com/api/characters');
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const characters = await response.json();

        allCharacters = characters.filter(ch => ch.hogwartsStudent || ch.hogwartsStaff)
               // delete after 
        console.log(allCharacters);

        displayCard(allCharacters);

        setupHouseFilter();
        setupGenderFilter();
        setupAncestryFilter();
        setupBelonging();
    } catch(error) {
        console.error('Error fetching characters:', error);
    }
}


function setupHouseFilter () {
    const houseButtons = document.querySelectorAll('.btn-houses');

    houseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const house = button.textContent.trim();
            console.log('House is:', house)

            const filtered = allCharacters.filter(ch => ch.house === house);
            displayCard(filtered)
        })
    })
}
function setupGenderFilter () {
    const genderSelect = document.getElementById('gender-search');

    genderSelect.addEventListener('change', () => {
        const selectedGender = genderSelect.value;
        // delete after
        console.log('Selected gender:', selectedGender);

        let filtered = allCharacters;

        if (selectedGender !== 'all') {
            filtered = allCharacters.filter(ch => ch.gender === selectedGender)
        }
        displayCard(filtered)
    })
}

function setupAncestryFilter() {
    const ancestrySelect = document.getElementById('ancestry-search');

    ancestrySelect.addEventListener('change', () => {
        const selectedAncestry = ancestrySelect.value;
        // delete after 
        console.log('selectedAncestry', selectedAncestry);

        let filtered = allCharacters;
        filtered = allCharacters.filter(ch => ch.ancestry === selectedAncestry);
        displayCard(filtered);
        
    })
}


function setupBelonging() {
    const radios = document.querySelectorAll('input[name="role"]');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {

            let filtered = allCharacters;

            if (radio.checked) {
                if(radio.id === 'student') {
                    filtered = allCharacters.filter(ch => ch.hogwartsStudent);
                } else if (radio.id === 'staff') {
                    filtered = allCharacters.filter(ch => ch.hogwartsStaff);
                }
            }

            displayCard(filtered);
        })
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
            ancestry.textContent = character.ancestry ? ancestry.textContent = `Ancestry: ${character.ancestry}` : `Ancestry: Hard to say`;


            const specie = document.createElement('h3');
            specie.textContent = character.species ? `Specie: ${character.species}`: `Specie: Hard to say`;

            const yearOfBirth = document.createElement('h3');
            yearOfBirth.textContent = character.yearOfBirth ? `Year of birth: ${character.yearOfBirth}` : `Year of birth: Hard to say`;
        

            const student = document.createElement('h3');
            student.textContent = character.hogwartsStudent ? `Student: Yes` : `Student: No`;
        

            const staff = document.createElement('h3');
            staff.textContent = character.hogwartsStaff ? `Staff: Yes` : `Staff: No`;

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
    });
}




