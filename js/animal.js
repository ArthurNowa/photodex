
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
  
  let carouselContent = ``;
  
  for (const photo of animal.photos) {
    carouselContent = carouselContent + `
      <div class=carousel-item">
        <div style="display: block; width: 100%; height: 100%; text-decoration: none; position: relative;">
          <img src="./${photo.fichier}" onclick="openImageZoom(this.src, this.alt)" alt="${animal.nom}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 15px 25px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;">Lieu de la photo : ${photo.lieu}</div>
        </div>
      </div>`;
  }

  animalDetailsContainer.innerHTML = `
    <section class="carousel-section">
        <div class="container">
            <h1>${animal.nom}</h1>
            <div class="carousel-container">
                <div class="carousel" id="carousel">
                   
                 ${carouselContent}
                
                <button class="carousel-btn prev" onclick="prevSlide()">❮</button>
                <button class="carousel-btn next" onclick="nextSlide()">❯</button>
            </div>
        </div>
    </section>
    <script src="js/carrousel.js"></script>

    <div id="photo-counter"></div>

    <section class="animal-info">
      <p><strong>Catégorie :</strong> ${animal.categorie}</p>
      <p><strong>Taille :</strong> ${animal.taille}</p>
      <p><strong>Régime alimentaire :</strong> ${animal.regime}</p>
      <p><strong>Habitat :</strong> ${animal.habitat}</p>
      <p><strong>Description :</strong> ${animal.description}</p>
    </section>

    <a href="${animal.categorie}.html" class="btn btn-primary">← Retour au Photodex</a>
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
