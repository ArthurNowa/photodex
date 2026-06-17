const animalsContainer = document.querySelector("#animals-container");
const searchInput = document.querySelector("#search-input");
const categoryFilter = window.location.pathname
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
  animalsContainer.innerHTML = "";

  if (list.length === 0) {
    animalsContainer.innerHTML = "<p>Aucun animal trouvé.</p>";
    return;
  }

  list.forEach(animal => {
    const card = document.createElement("article");
    card.className = "animal-card";

    card.innerHTML = `
      <div class="animal-card">
        <a href="animal.html?id=${animal.id}">
          <img src="${animal.thumbnail}" alt="${animal.nom}">
          <h2>${animal.nom}</h2>
          <p>${animal.categorie}</p>
          <p>${animal.description}</p>
        </a>
      </div>
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

categoryFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

loadAnimals();
generateCategoryFilter();
displayAnimals(animals);


