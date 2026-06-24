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

async function displayRandomAnimal() {
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
        randomHighlightContainer.innerHTML = `<div class="animal-card">
              <a href="animal.html?id=${randomAnimal.id}">
                  <img src="${randomAnimal.photos[0].fichier}" alt="${randomAnimal.nom}">
                  <h3>${randomAnimal.nom}</h3>
                  <p>
                      <u>Description</u> : ${randomAnimal.description}<br>
                      <br>
                      <u>Taille</u> : ${randomAnimal.taille}
                  </p>
              </a>
          </div>`;
    } catch (error) {
        console.error(error);
        randomHighlightContainer.innerHTML =
            "<p>Erreur lors du chargement du photodex.</p>";
    }
}



loadAnimals();
displayRandomAnimal();