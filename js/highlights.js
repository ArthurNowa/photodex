const lastFoundContainer = document.querySelector("#last-photo");
const randomHighlightContainer = document.querySelector("#random-highlight");


import { loadJsonFile, loadIndex } from "./dataLoader.js";


async function displayLastPhoto() {
    try {
        const latestPhotoData = await loadJsonFile("data/latest-photo.json", lastFoundContainer);
        
        let lastPhotoPath = latestPhotoData.photo;
        lastPhotoPath = lastPhotoPath.substring(3, lastPhotoPath.length);


        const lastAnimalData = await loadJsonFile(latestPhotoData.jsonfile, lastFoundContainer);

        console.log("nom du dernier animal photographié : " + lastAnimalData.name);
        
        lastFoundContainer.innerHTML =`
              <div class="animal-card">
                  <a href="animal.html?id=${latestPhotoData.animalId}">
                      <img src="${lastPhotoPath}" alt="${lastAnimalData.nom}">
                      <h3>${lastAnimalData.nom}</h3>
                      <p>
                          Photo prise le : ${latestPhotoData.date}<br>
                          Lieu de la photo : ${lastAnimalData.photos[0].lieu}<br>
                      </p>
                  </a>
              </div>
            `;
        
    } catch (error) {console.error(error);}
}

async function selectRandomAnimal() {
    try {
        const indexData = await loadIndex(randomHighlightContainer);
        
        const randomCategory = indexData[Math.floor(Math.random() * indexData.length)];
        console.log("catégorie aléatoire : " + randomCategory.type);
        
        const randomAnimal = randomCategory.data[Math.floor(Math.random() * randomCategory.data.length)];
        console.log("animal aléatoire : " + randomAnimal.name);
        const randomAnimalPath = `data/${randomCategory.type}/${randomAnimal.name}`;
        console.log("path retourné par selectRandomAnimal : " + randomAnimalPath);
        return randomAnimalPath;
    } catch (error) {
        console.error(error);
        return null;
    }
}


async function displayRandomAnimal (animalPath){
    console.log("path reçu par displayRandomAnimal : " + animalPath);
    try {
        const animalData = await loadJsonFile(animalPath, randomHighlightContainer);
        console.log("Pas d'erreur de chargement de animalData via loadJsonFile");
        console.log("animalData.id : " + animalData.id);

        //const randomHighlightContainerbis = document.querySelector("#random-highlightbis");
        randomHighlightContainer.innerHTML = `<div class="animal-card">
              <a href="animal.html?id=${animalData.id}">
                  <img src="${animalData.photos[0].fichier}" alt="${animalData.nom}">
                  <h3>${animalData.nom}</h3>
                  <p>
                      <u>Description</u> : ${animalData.description}<br>
                      <br>
                      <u>Taille</u> : ${animalData.taille}
                  </p>
              </a>
          </div>`;
        
        
    } catch (error) {
        console.error(error);
        randomHighlightContainer.innerHTML =
            `<p>Erreur lors de l'affichage de ${animalPath}.</p>`;
    }
}


async function initHighlights() {
    await displayLastPhoto();

    const randomAnimalPath = await selectRandomAnimal();

    if (randomAnimalPath) {
        await displayRandomAnimal(randomAnimalPath);
    }
}

initHighlights();