const animalsContainer = document.querySelector("#animals-container");
const categoryFilter = document.querySelector("#category-filter");
const searchInput = document.querySelector("#search-input");

let animals = [];

async function loadAnimals() {
  try {
    const response = await fetch("data/index.json");

    if (!response.ok) {
      throw new Error("Impossible de charger index.json");
    }

    animals = await response.json();

    generateCategoryFilter();
    displayAnimals(animals);
  } catch (error) {
    console.error(error);
    animalsContainer.innerHTML = "<p>Erreur lors du chargement du photodex.</p>";
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
      <a href="animal.html?id=${animal.id}">
        <img src="${animal.thumbnail}" alt="${animal.nom}">
        <h2>${animal.nom}</h2>
        <p>${animal.categorie}</p>
        <p>${animal.description}</p>
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

categoryFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

loadAnimals();
