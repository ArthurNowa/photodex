const lastFoundContainer = document.querySelector("#last-photo");
const randomHighlightContainer = document.querySelector("#random-highlight");


async function loadAnimals() {
    try {
        const indexResponse = await fetch("data/latest-photo.json");

        if (!indexResponse.ok) {
            throw new Error("Impossible de charger index.json");
        }
        
        const lastAnimalData = await indexResponse.json();
        
        let lastPhoto = lastAnimalData.photo;
        lastPhoto = lastPhoto.substring(3, lastPhoto.length); 
        
        lastFoundContainer.innerHTML =`
              <div class="animal-card">
                  <a href="animal.html?id=${lastAnimalData.animalId}">
                      <img src="${lastPhoto}" alt="${lastAnimalData.nom}">
                      <h3>${lastAnimalData.nom}</h3>
                      <p>
                          Photo prise le : ${lastAnimalData.date}<br>
                      </p>
                  </a>
              </div>
            `;
        
    }
    catch (error) {
    console.error(error);
    lastFoundContainer.innerHTML =
        "<p>Erreur lors du chargement du dernier animal photographié.</p>";
    }
}

async function selectRandomAnimal() {
    try {
        const indexResponse = await fetch("data/index.json");

        if (!indexResponse.ok) {
            throw new Error("Impossible de charger index.json");
        }
        
        const indexData = await indexResponse.json();
        const randomCategory = indexData[Math.floor(Math.random() * indexData.length)];

        const randomCategoryData = randomCategory.data;
        // Select a random object
        const randomAnimal = randomCategoryData[Math.floor(Math.random() * randomCategoryData.length)];
        //content.concat(`random Animal = ${randomAnimal}<br>`);
        /* randomHighlightContainer.innerHTML = `<div class="animal-card">
              <a href="animal.html?id=${randomAnimal.id}">
                  <img src="${randomAnimal.photos[0].fichier}" alt="${randomAnimal.nom}">
                  <h3>${randomAnimal.nom}</h3>
                  <p>
                      <u>Description</u> : ${randomAnimal.description}<br>
                      <br>
                      <u>Taille</u> : ${randomAnimal.taille}
                  </p>
              </a>
          </div>`; */
        //content.concat(`random Animal id = ${randomAnimal.id}<br>`);
        var content = `<p>randomAnimal = ${randomAnimal.name}<br>`;
        randomHighlightContainer.innerHTML = content;
        return `data/${randomCategoryData.type}/${randomAnimal.name}`
    } catch (error) {
        console.error(error);
        randomHighlightContainer.innerHTML =
            "<p>Erreur lors du chargement de l'animal aléatoire.</p>";
    }
}


async function displayAnimal (animalPath){
    try {
        const indexResponse = await fetch(animalPath);

        if (!indexResponse.ok) {
            throw new Error("Impossible de charger le fichier d'animal aléatoire.");
        }
        
        const animalData = await indexResponse.json();

        const randomHighlightContainerbis = document.querySelector("#random-highlightbis");
        randomHighlightContainerbis.innerHTML = `<div class="animal-card">
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
            "<p>Erreur lors du chargement de ${animalPath}.</p>";
    }
}



loadAnimals();
let randomAnimal = selectRandomAnimal();
displayAnimal(randomAnimal);