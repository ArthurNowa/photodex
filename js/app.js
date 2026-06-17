const animalsContainer = document.querySelector("#animals-container");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const pageFilter = window.location.pathname
    .split('/')
    .pop()
    .replace('.html', '');

export let animals = [];

async function loadAnimals() {
  try {
    const indexResponse = await fetch("data/index.json");

    if (!indexResponse.ok) {
      throw new Error("Impossible de charger index.json");
    }

    const indexData = await indexResponse.json();

    const animalPromises = [];

    for (const category of indexData) {

      const categoryName = category.type;

      for (const animalFile of category.data) {

        const filePath = `data/${categoryName}/${animalFile.name}`;

        animalPromises.push(
          fetch(filePath)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Impossible de charger ${filePath}`);
              }

              return response.json();
            })
            .then(animal => {

              // Sécurité : si la catégorie n'est pas définie dans le json
              if (!animal.categorie) {
                animal.categorie = categoryName;
              }

              return animal;
            })
        );
      }
    }

    animals = await Promise.all(animalPromises);

  } catch (error) {
    console.error(error);
    animalsContainer.innerHTML =
      "<p>Erreur lors du chargement du photodex.</p>";
  }
}


function displayAnimals(list) {
  var animalThumbnail = "images/placeholder.png";
  animalsContainer.innerHTML = "";

  if (list.length === 0) {
    animalsContainer.innerHTML = "<p>Aucun animal trouvé.</p>";
    return;
  }

  list.forEach(animal => {
    const card = document.createElement("article");
    card.className = "animal-card";
    
    if (animal.photos.length > 0) {
        animalThumbnail = animal.photos[0];
    }
      
    card.innerHTML = `
      <a href="animal.html?id=${animal.id}">
          <div class="animal-card">
              <img src="${animalThumbnail}" alt="${animal.nom}">
              <h3>${animal.nom}</h3>
              <p>
                  Description : ${animal.description}<br>
                  Taille : ${animal.taille}
              </p>
          </div>
      </a>
    `;

    animalsContainer.appendChild(card);
  });
}

function generateCategoryFilter() {
  const categories = [...new Set(animals.map(animal => animal.categorie))];

  categoryFilter.innerHTML = `<option value="all">Toutes les catégories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function applyFilters() {
  const selectedCategory = categoryFilter.value;
  const search = searchInput.value.toLowerCase();

  const filteredAnimals = animals.filter(animal => {
    const matchesCategory =
      selectedCategory === "all" || animal.categorie === selectedCategory;

    const matchesSearch =
      animal.nom.toLowerCase().includes(search) ||
      animal.description.toLowerCase().includes(search) ||
      animal.habitat.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  displayAnimals(filteredAnimals);
}



async function init() {
  await loadAnimals();

  generateCategoryFilter();
  displayAnimals(animals);
}

categoryFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

init();
