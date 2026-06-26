

export async function loadJsonFile(jsonPath, container = null) {
    try {
        const response = await fetch(jsonPath);

        if (!response.ok) {
            throw new Error(`Impossible de charger le fichier ${jsonPath}`);
        }

        return await response.json();

    } catch (error) {
        console.error(error);

        if (container) {
            container.innerHTML = `<p>Erreur lors du chargement du fichier ${jsonPath}</p>`;
        }

        return null;
    }
}


export async function loadAllAnimals(container = null) {
    const indexData = await loadIndex(container);

    const animalPromises = [];

    for (const category of indexData) {
        for (const animalFile of category.data) {
            const path = `data/${category.type}/${animalFile.name}`;
            animalPromises.push(loadJsonFile(path, container));
        }
    }

    return await Promise.all(animalPromises);
}


export async function loadIndex(container = null) {
    return await loadJsonFile("data/index.json", container);
}