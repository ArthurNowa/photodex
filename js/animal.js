
import { loadAllAnimals } from "./dataLoader.js";

const params = new URL(window.location.href).searchParams;
const animalId = params.get('id');
console.log(animalId);

const animalTitleContainer = document.querySelector("#animal-name");
const animalDetailsContainer = document.querySelector("#animal-details");
const carouselContainer = document.querySelector("#carousel");

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

  fillPhotoCarousel(currentAnimal);
  displayAnimalDetails(currentAnimal);
}



function fillPhotoCarousel(animal) {
  console.log(`path de la photo : ${animal.photos[0].fichier}`);
  let photoCounter = 0;

  let carouselContent = ``;

  for (const photo of animal.photos) {
    photoCounter++;
    carouselContent = carouselContent + `
      <div class="carousel-item">
        <div style="display: block; width: 100%; height: 100%; text-decoration: none; position: relative;">
          <img src="./${photo.fichier}" onclick="openImageZoom(this.src, this.alt)" alt="${animal.nom}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 15px 25px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;">Lieu de la photo : ${photo.lieu}</div>
          <div style="position: absolute; top: 20px; right: 2%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 15px 25px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;">Photo ${photoCounter} / ${animal.photos.length}</div>
        </div>
      </div>`;
  }

  carouselContainer.innerHTML = `${carouselContent}`;
}
function displayAnimalDetails(animal) {
  document.title = `${animal.nom} - Photodex`;
  
  animalTitleContainer.innerHTML = `${animal.nom}`;
  
  let envergureData = "";
  if (animal.envergure) {
    envergureData = `<p><strong>Envergure :</strong> ${animal.envergure}</p>`;
  }
  let titleBis = "";
  if (animal.nomAlt) {
    titleBis = `<p><strong>Nom alternatif :</strong> ${animal.nomAlt}</p>`;
  }

  animalDetailsContainer.innerHTML = `
    <div class="animal-info">
      ${titleBis}
      <p><strong>Nom Scientifique :</strong> ${animal.nomScientifique}</p>
      <p><strong>Ordre :</strong> ${animal.ordre}</p>
      <p><strong>Taille :</strong> ${animal.taille}</p>
      ${envergureData}
      <p><strong>Description :</strong> ${animal.description}</p>
      <p><strong>Habitat :</strong> ${animal.habitat}</p>
      <p><strong>Répartition Géographique :</strong> ${animal.repartition}</p>
      <p><strong>Régime alimentaire :</strong> ${animal.regime}</p>
    </div>

    <a href="${animal.categorie}.html" class="btn btn-primary">← Retour au Photodex</a>
  `;
}


await loadAnimal();
