const DATA_FILES = [
  "data/oiseaux.json",
  "data/mammiferes.json",
  "data/reptiles-amphibiens.json",
  "data/insectes.json",
  "data/plantes.json"
];



async function loadAllItems() {
  const responses = await Promise.all(
    DATA_FILES.map(file => fetch(file))
  );

  const jsonFiles = await Promise.all(
    responses.map(response => {
      if (!response.ok) {
        throw new Error("Erreur de chargement d'un fichier JSON");
      }

      return response.json();
    })
  );

  return jsonFiles.flat();
}

export async function loadJsonFile (jsonPath, container) {
    try {
        const dataResponse = await fetch(jsonPath);

        if (!dataResponse.ok) {
            throw new Error(`Impossible de charger le fichier ${jsonPath}`);
        }

        const rawJsonData = await dataResponse.json();
        return rawJsonData;

    } catch (error) {
        console.error(error);
        container.innerHTML =
            `<p>Erreur lors du chargement du fichier ${jsonPath}</p>`;
    }
}

const mainContainer = document.querySelector("main");
export const indexData = loadAllItems("data/index.json", mainContainer);