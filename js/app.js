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

import { loadJsonFile, loadIndex } from "./dataLoader.js";

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
    categoryFilter.appendChild(option);
  });


  // filtre "Habitat"
  const habitats = ["prairie", "forêt", "villes", "jardins"];

  habitatFilter.innerHTML = `<option value="all">Tous</option>`;
  habitats.forEach(habitat => {
    const option = document.createElement("option");
    option.value = habitat;
    option.textContent = habitat;
    categoryFilter.appendChild(option);
  });
}

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  // filtre "Taille"
  let minSize = Number(minSizeInput.value);
  let maxSize = Number(maxSizeInput.value);
  sizeLabel.textContent = `${minSize} - ${maxSize} cm`;

  const filteredAnimals = animals.filter(animal => {
    const matchesCategory = animal.categorie === pageFilter;

    const matchesSearch =
      animal.nom.toLowerCase().includes(search) ||
      animal.description.toLowerCase().includes(search) || 
      animal.ordre.toLowerCase().includes(search) ||
      animal.habitat.toLowerCase().includes(search) || 
      (animal.tailleMoyenne >= minSize &&
      animal.tailleMoyenne <= maxSize);
    
    return matchesCategory && matchesSearch;
  });

  displayAnimals(filteredAnimals);
}



async function init() {
  await loadAnimals();

  generateFilters();
  applyFilters(animals);
}

searchInput.addEventListener("input", applyFilters);
//orderFilter.addEventListener("change", applyFilters);
//habitatFilter.addEventListener("change", applyFilters);
//minSizeInput.addEventListener("input", applyFilters);
//maxSizeInput.addEventListener("input", applyFilters);

init();
