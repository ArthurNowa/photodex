const animalsContainer = document.querySelector("#animals-container");
const searchInput = document.querySelector("#search-input");

const orderSelect = document.querySelector("#order");
const directionCheckbox = document.querySelector("#direction");

const habitatFilter = document.querySelector("#habitat-filter");

const pageFilter = window.location.pathname
    .split('/')
    .pop()
    .replace('.html', '');

import {loadIndex, loadJsonFile} from "./dataLoader.js";

let animalsFullData = [];
export let animals = [];

const birdSizeLevels = [
  { label: "Mésange", size: 14, image: "images/silhouettes/mesange.png" },
  { label: "Moineau", size: 16, image: "images/silhouettes/moineau.png" },
  { label: "Merle", size: 25, image: "images/silhouettes/merle.png" },
  { label: "Pigeon", size: 35, image: "images/silhouettes/pigeon.png" },
  { label: "Poule", size: 60, image: "images/silhouettes/poule.png" },
  { label: "Héron", size: 90, image: "images/silhouettes/heron.png" },
  { label: "Cigogne", size: 105, image: "images/silhouettes/cigogne.png" },
  { label: "Emeu", size: 170, image: "images/silhouettes/emeu.png" }
];
const mammalSizeLevels = [
  { label: "mulot", size: 14, image: "images/silhouettes/mesange.png" },
  { label: "rat", size: 16, image: "images/silhouettes/moineau.png" },
  { label: "chat", size: 25, image: "images/silhouettes/merle.png" },
  { label: "renard", size: 35, image: "images/silhouettes/pigeon.png" },
  { label: "chèvre", size: 60, image: "images/silhouettes/poule.png" },
  { label: "Cerf", size: 90, image: "images/silhouettes/heron.png" },
  { label: "Cheval", size: 105, image: "images/silhouettes/cigogne.png" },
  { label: "Eléphant", size: 170, image: "images/silhouettes/emeu.png" }
];

const sizeInput = document.querySelector("#size-filter");
const sizeLabel = document.querySelector("#size-label");
const sizeReferencesContainer = document.querySelector("#size-references");

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


function sortAnimals() {
  const order = orderSelect.value;
  animals.sort((animal1, animal2) => {
    if (order === "alpha") {
        return animal1.nom.localeCompare(animal2.nom);
    }
    if (order === "lastseen") {
      const lastPhoto1 = animal1.photos[animal1.photos.length-1].fichier;
      const lastPhoto2 = animal2.photos[animal2.photos.length-1].fichier;
      return lastPhoto1.localeCompare(lastPhoto2);
    }
  });
  displayAnimals(animals);
}

function reverseAnimals() {
  animals.reverse();

  displayAnimals(animals);
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

// ##############################################################################

function createSizeReferences() {
  sizeReferencesContainer.innerHTML = birdSizeLevels
      .map((level, index) => `
      <button
        type="button"
        class="size-reference"
        data-index="${index}"
        aria-label="${level.label}"
      >
        <span class="size-tick"></span>

        <img
          src="${level.image}"
          alt=""
        >

        <span class="size-reference-name">
          ${level.label.replace("Taille d’", "").replace("Taille d’une ", "")}
        </span>
      </button>
    `)
      .join("");

  sizeReferencesContainer
      .querySelectorAll(".size-reference")
      .forEach(reference => {
        reference.addEventListener("click", () => {
          sizeInput.value = reference.dataset.index;
          updateSizeFilter();
        });
      });
}

function updateSizeFilter() {
  const selectedIndex = Number(sizeInput.value);
  const selectedLevel = birdSizeLevels[selectedIndex];

  sizeLabel.textContent = selectedLevel.label;

  document
      .querySelectorAll(".size-reference")
      .forEach((reference, index) => {
        reference.classList.toggle(
            "active",
            index === selectedIndex
        );
      });

  applyFilters();
}

sizeInput.addEventListener("input", updateSizeFilter);



// ###############################################################
// ###############################################################

async function init() {
  await loadAnimals();
  
  createSizeReferences();
  updateSizeFilter();
  
  applyCategoryFilter();
  await applySearchFilter();
  // generateFilters();
  // applyFilters();

  
  sortAnimals();
  
  displayAnimals(animals);
}

searchInput.addEventListener("input", applySearchFilter);
orderSelect.addEventListener("change", sortAnimals);
directionCheckbox.addEventListener("change", reverseAnimals);
//orderFilter.addEventListener("change", applyFilters);
//habitatFilter.addEventListener("change", applyFilters);
//minSizeInput.addEventListener("input", applyFilters);
//maxSizeInput.addEventListener("input", applyFilters);

await init();
