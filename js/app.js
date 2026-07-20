const animalsContainer = document.querySelector("#animals-container");
const searchInput = document.querySelector("#search-input");
const orderFilter = document.querySelector("#order-filter");
const habitatFilter = document.querySelector("#habitat-filter");
const minSizeInput = document.querySelector("#min-size");
const maxSizeInput = document.querySelector("#max-size");
const sizeLabel = document.querySelector("#size-label");
const pageFilter = window.location.pathname
    .split('/')
    .pop()
    .replace('.html', '');

import {loadIndex, loadJsonFile} from "./dataLoader.js";

let animalsFullData = [];
export let animals = [];

async function loadAnimals() {
  try {
    const indexData = await loadIndex(animalsContainer);

    const animalPromises = [];

    for (const category of indexData) {
      const categoryName = category.type;

      for (const animalFile of category.data) {
        const filePath = `data/${categoryName}/${animalFile.name}`;

        animalPromises.push(
            loadJsonFile(filePath, animalsContainer)
        );
      }
    }

    animalsFullData = await Promise.all(animalPromises);

  } catch (error) {
    console.error(error);
  }
}


function sortAnimals(order = "last seen", reversed = false) {
  animals.sort((animal1, animal2) => {
    if (order === "alpha") {
        return animal1.name > animal2.name;
    }
    if (order === "last seen") {
      return animal1.photos[-1].fichier > animal2.photos[-1].fichier;
    }
  });
  if (reversed) {
    animals.reverse();
  }
}

function displayAnimals(list) {
  var animalThumbnail = "images/placeholder.png";
  animalsContainer.innerHTML = "";

  if (list.length === 0) {
    animalsContainer.innerHTML = `<p style="text-align: center;">Aucun animal trouvé.</p>`;
    return;
  }

  list.forEach(animal => {
    const card = document.createElement("article");
    card.className = "animal-card";
    
    if (animal.photos.length > 0) {
        animalThumbnail = animal.photos[0].fichier;
    }
      
    card.innerHTML = `
      <div class="animal-card">
          <a href="animal.html?id=${animal.id}">
              <img src="${animalThumbnail}" alt="${animal.nom}">
              <h3>${animal.nom}</h3>
              <p><strong>Description</strong> : ${animal.description}</p>
              <p><strong>Taille</strong> : ${animal.taille}</p>
          </a>
      </div>
    `;

    animalsContainer.appendChild(card);
  });
}

function generateFilters() {
  // filtre "Ordre"
  const orders = [...new Set(animals.map(animal => animal.order))];

  orderFilter.innerHTML = `<option value="all">Tous</option>`;

  orders.forEach(order => {
    const option = document.createElement("option");
    option.value = order;
    option.textContent = order;
    orderFilter.appendChild(option);
  });


  // filtre "Habitat"
  const habitats = ["prairie", "forêt", "villes", "jardins"];

  habitatFilter.innerHTML = `<option value="all">Tous</option>`;
  habitats.forEach(habitat => {
    const option = document.createElement("option");
    option.value = habitat;
    option.textContent = habitat;
    habitatFilter.appendChild(option);
  });
}

function applyCategoryFilter() {
  animalsFullData = animalsFullData.filter(animal => {
    return animal.categorie === pageFilter;
  });
  animals = animalsFullData;
}

async function applySearchFilter() {
  const search = searchInput.value.toLowerCase();
  if (search !== "") {
    animals = animalsFullData.filter(animal => {
      const searchWords = search.split(' ');
      const nomAlt = animal.nomAlt ?? "";
      const keywords = animal.keywords ?? "";
      for (let word of searchWords) {
        if (animal.nom.toLowerCase().includes(word) ||
            nomAlt.toLowerCase().includes(word) ||
            keywords.includes(word) ||
            animal.ordre.toLowerCase().includes(word)
        ) {
          return true;
        }
      }
      return false;
    });
  } else {
    animals = animalsFullData;
  }
  displayAnimals(animals);
}


function applyFilters() {
  const search = searchInput.value.toLowerCase();
  // filtre "Taille"
  // let minSize = Number(minSizeInput.value);
  // let maxSize = Number(maxSizeInput.value);
  // sizeLabel.textContent = `${minSize} - ${maxSize} cm`;

  animals = animals.filter(animal => {
    // const matchesSize = animal.tailleMoyenne >= minSize &&
    //    animal.tailleMoyenne <= maxSize
  });
}



async function init() {
  await loadAnimals();

  applyCategoryFilter();
  await applySearchFilter();
  //generateFilters();
  // applyFilters();
  
  sortAnimals();
  
  displayAnimals(animals);
}

searchInput.addEventListener("input", applySearchFilter);
//orderFilter.addEventListener("change", applyFilters);
//habitatFilter.addEventListener("change", applyFilters);
//minSizeInput.addEventListener("input", applyFilters);
//maxSizeInput.addEventListener("input", applyFilters);

await init();
