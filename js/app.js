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

    animals = await Promise.all(animalPromises);

  } catch (error) {
    console.error(error);
  }
}


function displayAnimals(list) {
  var animalThumbnail = "images/placeholder.png";
  animalsContainer.innerHTML = "";

  if (list.length === 0) {
    animalsContainer.innerHTML = "<p>Aucun animal trouvé.</p>";
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
              <p>
                  <u>Description</u> : ${animal.description}<br>
                  <br>
                  <u>Taille</u> : ${animal.taille}
              </p>
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
  console.log(`animals before : ${animals}`);
  console.log(`page filter : ${pageFilter}`);
  animals = animals.filter(animal => {
    console.log(`animal : ${animal}`);
    console.log(`animal categorie : ${animal.categorie}`);
    return animal.categorie === pageFilter;
  });
  console.log(`animals after : ${animals}`);
}

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  // filtre "Taille"
  let minSize = Number(minSizeInput.value);
  let maxSize = Number(maxSizeInput.value);
  sizeLabel.textContent = `${minSize} - ${maxSize} cm`;

  animals = animals.filter(animal => {
    const matchesSize = animal.tailleMoyenne >= minSize &&
        animal.tailleMoyenne <= maxSize

    const matchesSearch =
        animal.categorie === pageFilter.value &&
        animal.nom.toLowerCase().includes(search) ||
        animal.description.toLowerCase().includes(search) ||
        animal.ordre.toLowerCase().includes(search) ||
        animal.habitat.toLowerCase().includes(search);

    console.log(`animal : ${animal} | match : ${matchesSearch} | match size : ${matchesSize}`);

    return matchesSearch || matchesSize;
  });
}



async function init() {
  await loadAnimals();

  applyCategoryFilter();
  //generateFilters();
  applyFilters();
  displayAnimals(animals);
}

searchInput.addEventListener("input", applyFilters);
//orderFilter.addEventListener("change", applyFilters);
//habitatFilter.addEventListener("change", applyFilters);
//minSizeInput.addEventListener("input", applyFilters);
//maxSizeInput.addEventListener("input", applyFilters);

init();
