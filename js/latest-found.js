
const lastFoundContainer = document.querySelector("#last-photo");



async function loadAnimals() {
    try {
        const indexResponse = await fetch("data/latest-photo.json");

        if (!indexResponse.ok) {
            throw new Error("Impossible de charger index.json");
        }
        
        const lastAnimalData = await indexResponse.json();
        
        var lastPhoto = lastAnimalData.photo;
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


loadAnimals();