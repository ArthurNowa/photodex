
import { loadAllAnimals } from "./dataLoader.js";

const params = new URL(window.location.href).searchParams;
const animalId = params.get('id');
console.log(animalId);

const animalDetailsContainer = document.querySelector("#animal-details");

let currentPhotoIndex = 0;
let currentAnimal = null;

async function loadAnimal() {
  if (!animalId) {
    throw new Error("Aucun animal sélectionné.");
  }

  const animals = await loadAllAnimals(animalDetailsContainer);
  currentAnimal = animals.find(animal => animal.id === animalId);

  if (!currentAnimal) {
    throw new Error("Animal introuvable.");
  }

  displayAnimal(currentAnimal);
}

function displayAnimal(animal) {
  console.log(`path de la photo : ${animal.photos[0].fichier}`)
  document.title = `${animal.nom} - Photodex`;

  animalDetailsContainer.innerHTML = `
    <h1>${animal.nom}</h1>

    <section class="animal-gallery">
      <button id="prev-photo">←</button>
      <img id="main-photo" src="${animal.photos[0].fichier}" alt="${animal.nom}">
      <button id="next-photo">→</button>
    </section>

    <div id="photo-counter"></div>

    <section class="animal-info">
      <p><strong>Catégorie :</strong> ${animal.categorie}</p>
      <p><strong>Taille :</strong> ${animal.taille}</p>
      <p><strong>Régime alimentaire :</strong> ${animal.regime}</p>
      <p><strong>Habitat :</strong> ${animal.habitat}</p>
      <p><strong>Description :</strong> ${animal.description}</p>
    </section>

    <a href="${animal.categorie}.html">← Retour au Photodex</a>
  `;

  updatePhoto();

  document.querySelector("#prev-photo").addEventListener("click", previousPhoto);
  document.querySelector("#next-photo").addEventListener("click", nextPhoto);
}

function updatePhoto() {
  const mainPhoto = document.querySelector("#main-photo");
  const counter = document.querySelector("#photo-counter");

  mainPhoto.src = currentAnimal.photos[currentPhotoIndex];
  mainPhoto.alt = `${currentAnimal.nom} - photo ${currentPhotoIndex + 1}`;

  counter.textContent = `${currentPhotoIndex + 1} / ${currentAnimal.photos.length}`;
}

function previousPhoto() {
  currentPhotoIndex--;

  if (currentPhotoIndex < 0) {
    currentPhotoIndex = currentAnimal.photos.length - 1;
  }

  updatePhoto();
}

function nextPhoto() {
  currentPhotoIndex++;

  if (currentPhotoIndex >= currentAnimal.photos.length) {
    currentPhotoIndex = 0;
  }

  updatePhoto();
}

loadAnimal();
