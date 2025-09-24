'use strict';

const facts = [
  {
    name: 'stag',
    fact: 'Symbolizes courage, strength, and leadership.'
  },
  {
    name: 'otter',
    fact: 'Playful and clever, otters are known for their agility in water and love of companionship.'
  },
  {
    name: 'jack russell terrier',
    fact: 'Loyal, energetic, and fearless, perfect for protecting their loved ones.'
  },
  {
    name: 'tabby cat',
    fact: 'Intelligent and independent, often associated with curiosity and intuition.'
  },
  {
    name: 'swan',
    fact: 'Elegant and graceful, representing purity, beauty, and deep emotional bonds.'
  },
  {
    name: 'doe',
    fact: 'Gentle, nurturing, and protective, often symbolizing love and maternal care.'
  },
  {
    name: 'non-corporeal',
    fact: 'Represents a lost or undefined patronus, reflecting grief or magical challenges.'
  },
  {
    name: 'hare',
    fact: 'Quick, alert, and clever, hares are symbols of agility and resourcefulness.'
  },
  {
    name: 'horse',
    fact: 'Strong and free-spirited, representing freedom, stamina, and loyalty.'
  },
  {
    name: 'wolf',
    fact: 'Fierce, loyal, and protective, often moving in packs and symbolizing family bonds.'
  },
  {
    name: 'persian cat',
    fact: 'Elegant and poised, combining independence with a loving, gentle nature.'
  },
  {
    name: 'phoenix',
    fact: 'Immortal, resilient, and magical; it rises from its ashes, symbolizing hope and renewal.'
  },
  {
    name: 'boar',
    fact: 'Powerful and courageous, boars are relentless and symbolize determination and strength.'
  }
];

loadPatronuses();

async function loadPatronuses() {
  try {
  const response = await fetch('https://hp-api.onrender.com/api/characters');
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  const data = await response.json();
  console.log(data)

  let patronuses = data.filter(pat => pat.patronus && (pat.hogwartsStudent || pat.hogwartsStaff));
  let hogwartsPatronuses = patronuses.filter(p => p.hogwartsStudent || p.hogwartsStaff)
  console.log('real', hogwartsPatronuses);

  displayPatronusName(hogwartsPatronuses);

  } catch(error) {
    console.error('Error fetching patronuses:', error);
  }
}

function displayPatronusName(patronuses) {
  const container = document.querySelector('.patronuses-container');

    if (!container) {
        console.error(`Container with class 'patronuses-container' didn't found`);
        return;
    }

    container.innerHTML = '';

    const positions = [
    [1, 2], [1, 4], [1, 6],
    [2, 3], [2, 5],
    [3, 2], [3, 4], [3, 6],
    [4, 3], [4, 5],
    [5, 2], [5, 4], [5, 6],
  ];

    patronuses.forEach((patronus, index) => {
      if (index >= positions.length) return;
      const patronusContainer = document.createElement('div');
      patronusContainer.classList.add('patronus-container');

        const [row, col] = positions[index];
        patronusContainer.style.gridRow = `${row}/ ${row + 1}`;
        patronusContainer.style.gridColumn = `${col}/ ${col + 1}`;

      const name = document.createElement('h2');
      name.textContent = patronus.patronus;



      patronusContainer.appendChild(name);

      container.appendChild(patronusContainer);

    patronusContainer.addEventListener('click', () => {
          const factObj = facts.find(f => f.name.toLowerCase() === patronus.patronus.toLowerCase());
          if (factObj) {
            alert(`${patronus.patronus.toUpperCase()}: ${factObj.fact}`);
          } else {
            alert(`${patronus.patronus.toUpperCase()}: No fact available`);
          }
        });

    });

}



