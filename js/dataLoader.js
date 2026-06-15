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
