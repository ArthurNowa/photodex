
const lastFoundContainer = document.querySelector("#last-photo");



async function loadAnimals() {
    try {
        const indexResponse = await fetch("data/index.json");

        if (!indexResponse.ok) {
            throw new Error("Impossible de charger index.json");
        }
        
        const lastAnimalData = await indexResponse.json();
              

        lastFoundContainer.innerHTML =`
              <div class="animal-card">
                  <a href="animal.html?id=${lastAnimalData.animalId}">
                      <img src="${lastAnimalData.photo}" alt="${lastAnimalData.nom}">
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