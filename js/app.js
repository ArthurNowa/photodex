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
let filteredAnimals = animalsFullData;
export let animals = animalsFullData;

const birdSizeLevels = [
  { label: "Mésange", size: 10, image: "images/silhouettes/mesange.png" },
  { label: "Moineau", size: 14, image: "images/silhouettes/moineau.png" },
  { label: "Merle", size: 18, image: "images/silhouettes/merle.png" },
  { label: "Pigeon", size: 30, image: "images/silhouettes/pigeon.png" },
  { label: "Poule", size: 45, image: "images/silhouettes/poule.png" },
  { label: "Oie", size: 70, image: "images/silhouettes/oie.png" },
  { label: "Cigogne", size: 105, image: "images/silhouettes/cigogne.png" },
  { label: "Émeu", size: 160, image: "images/silhouettes/emeu.png" }
];
const mammalSizeLevels = [
  { label: "Souris", size: 8, image: "images/silhouettes/souris.png" },
  { label: "Hérisson", size: 14, image: "images/silhouettes/herisson.png" },
  { label: "Chat", size: 24, image: "images/silhouettes/chat.png" },
  { label: "Renard", size: 40, image: "images/silhouettes/renard.png" },
  { label: "Labrador", size: 58, image: "images/silhouettes/labrador.png" },
  { label: "Biche", size: 100, image: "images/silhouettes/biche.png" },
  { label: "Cheval", size: 160, image: "images/silhouettes/cheval.png" },
  { label: "Éléphant", size: 300, image: "images/silhouettes/elephant.png" }
];

const insectSizeLevels = [
  { label: "Puceron", size: 3, image: "images/silhouettes/puceron.png" },
  { label: "Fourmi", size: 6, image: "images/silhouettes/fourmi.png" },
  { label: "Coccinelle", size: 10, image: "images/silhouettes/coccinelle.png" },
  { label: "Abeille", size: 18, image: "images/silhouettes/abeille.png" },
  { label: "Sauterelle", size: 35, image: "images/silhouettes/sauterelle.png" },
  { label: "Lucane", size: 70, image: "images/silhouettes/Lucane.png" },
  { label: "Monarque", size: 110, image: "images/silhouettes/Monarque.png" },
  { label: "Scorpion Empereur", size: 180, image: "images/silhouettes/scorpion-empereur.png" }
];

const reptileSizeLevels = [
  { label: "Mésange", size: 14, image: "images/silhouettes/mesange.png" },
  { label: "Moineau", size: 16, image: "images/silhouettes/moineau.png" },
  { label: "Merle", size: 25, image: "images/silhouettes/merle.png" },
  { label: "Pigeon", size: 35, image: "images/silhouettes/pigeon.png" },
  { label: "Poule", size: 60, image: "images/silhouettes/poule.png" },
  { label: "Héron", size: 90, image: "images/silhouettes/heron.png" },
  { label: "Cigogne", size: 105, image: "images/silhouettes/cigogne.png" },
  { label: "Emeu", size: 170, image: "images/silhouettes/emeu.png" }
];

let animalScale = birdSizeLevels;

const sizeInput = document.querySelector("#size-filter");
const sizeLabel = document.querySelector("#size-label");
const sizeCheckbox = document.querySelector("#enable-size-filter");
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
  console.log("passage dans display");
  console.log("taille de la liste :", list.length);
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


function applyCategoryFilter() {
  animalsFullData = animalsFullData.filter(animal => {
    return animal.categorie === pageFilter;
  });
  animals = animalsFullData;
}

async function applySearchFilter() {
  const search = searchInput.value.toLowerCase();
  if (search !== "") {
    animals = filteredAnimals.filter(animal => {
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
    animals = filteredAnimals;
  }
  displayAnimals(animals);
}



// ##############################################################################

function createSizeReferences() {
  switch (pageFilter) {
    case "birds":
      animalScale = birdSizeLevels;
      break;
    case "mammals":
      animalScale = mammalSizeLevels;
      break;
    case "insects":
      animalScale = insectSizeLevels;
      break;
    case "reptiles":
      animalScale = reptileSizeLevels;
      break;
  }
  sizeReferencesContainer.innerHTML = animalScale.map((level, index) => `
      <button type="button" class="size-reference" data-index="${index}" aria-label="${level.label}">
        <img src="${level.image}" alt="">
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
          updateSizeSlider();
        });
      });
}

function enableSizeSlider() {
  const slider = document.querySelector("#size-slider");
  if (sizeCheckbox.checked) {
    slider.style.display = "inline";
  } else {
    slider.style.display = "none";
    filteredAnimals = animalsFullData;
  }
  updateSizeSlider();
}

function updateSizeSlider() {
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

  applySizeFilter();
}

async function applySizeFilter() {
  console.log(sizeCheckbox.checked);
  if (sizeCheckbox.checked) {
    const selectedIndex = Number(sizeInput.value);
    const sizeRef = birdSizeLevels[selectedIndex].size;
    
    const marge = 0.35 * sizeRef;
    console.log(sizeRef, marge);
    filteredAnimals = animalsFullData.filter(animal => {
      const isInRange = animal.tailleMoyenne >= sizeRef - marge &&
          animal.tailleMoyenne <= sizeRef + marge;
      console.log(sizeRef - marge, animal.tailleMoyenne, sizeRef + marge, isInRange);
      return isInRange;
    });
    console.log(filteredAnimals.length);
  }
  await applySearchFilter();
}

sizeCheckbox.addEventListener("change", enableSizeSlider);
sizeInput.addEventListener("input", updateSizeSlider);



// ###############################################################
// ###############################################################

async function init() {
  await loadAnimals();
  
  applyCategoryFilter();
  await applySearchFilter();
  
  createSizeReferences();
  enableSizeSlider();
  updateSizeSlider();
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
