import { loadIndex } from "./dataLoader.js";

const BADGES = [
    { name: "Aucun", goal: 0, image:"images/badges/badge-aucun.png" },
    { name: "Premiers Pas", goal: 10, image:"images/badges/badge-premiers-pas.png" },
    { name: "Un Bon Début", goal: 25, image:"images/badges/badge-bon-debut.png" },
    { name: "Curieux", goal: 50, image:"images/badges/badge-curieux.png" },
    { name: "Explor'Amateur", goal: 100, image:"images/badges/badge-exploramateur.png" },
    { name: "Attrapez-les tous !", goal: 151, image:"images/badges/badge-attrapez-lez-tous.png" },
    { name: "Naturaliste", goal: 200, image:"images/badges/badge-naturaliste.png" },
    { name: "Ca fait beaucoup là, non ?", goal: 500, image:"images/badges/badge-ca-fait-beaucoup.png" },
    { name: "Encyclopédie", goal: 1000, image:"images/badges/badge-encyclopedie.png" },
    { name: "Omniscient", goal: 10000, image:"images/badges/badge-omniscient.png" }
];

const progressBarContainer = document.querySelector("#progress-bar");
const pageFilter = window.location.pathname
    .split('/')
    .pop()
    .replace('.html', '');
let count = 0;

async function countDataEntries() {
    count = 0;
    try {
        const indexData = await loadIndex(progressBarContainer);
        
        for (const category of indexData) {
            if (pageFilter === "index" || category.type === pageFilter)
            {
                count += category.data.length;
            }
        }
        return count;
        
    } catch (error) {
        console.error(error);
    }
}

function getBadgeProgress() {
    let currentBadge = BADGES[0];
    let nextBadge = null;
    const nbGoals = BADGES.length;
    for (let i = 0; i < nbGoals; i++) {
        if (count >= BADGES[i].goal) {
            currentBadge = BADGES[i];
            if (i < nbGoals-1) {
                nextBadge = BADGES[i + 1];
            } else {
                nextBadge = null;
            }
        }
    }

    const previousGoal = currentBadge.goal;
    const nextGoal = nextBadge ? nextBadge.goal : currentBadge.goal;

    const progress = nextBadge
        ? ((count - previousGoal) / (nextGoal - previousGoal)) * 100
        : 100;

    return {
        currentBadge,
        nextBadge,
        progress
    };
}


function displayBadgeProgress() {
    const { currentBadge, nextBadge, progress } = getBadgeProgress();
    const category = [
        { filter: "index", text: "global" },
        { filter: "birds", text: "Oiseaux" },
        { filter: "mammals", text: "Mammifères" },
        { filter: "insects", text: "Insectes" },
        { filter: "reptiles", text: "Reptiles et Amphibiens" }
    ];
    
    let objectivesText = "";
    for (const type of category) {
        if (type.filter === pageFilter) {
            objectivesText = type.text;
        }
    }

    progressBarContainer.innerHTML = `
    <section class="badge-progress-card">
      <h2>Progression Photodex ${objectivesText}</h2>

      <p>${count} espèces rencontrées</p>

      <div class="badge-row">
        <div class="badge current">
          <span>Badge actuel</span>
          <strong style="text-align: center;">${currentBadge.name}</strong>
          <small>${currentBadge.goal} espèces</small>
          <img src="./${currentBadge.image}" alt="${currentBadge.image}" style="position: absolute; height: 100px; width: 100px; translate: 400px -60px;">
        </div>

        <div class="badge next">
          <span>Prochain badge</span>
          <strong style="translate: 250px 0;">${nextBadge ? nextBadge.name : "Tous obtenus"}</strong>
          <small>${nextBadge ? `${nextBadge.goal} espèces` : "Photodex complété"}</small>
          <img src="./${nextBadge.image}" alt="${nextBadge.name}" style="position: absolute; height: 100px; width: 100px; translate: 400px -60px; filter: grayscale(90%); opacity: 0.5;">
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%">${count} / ${nextBadge.goal}</div>
      </div>
    </section>`;
    console.log(`badge path : ${nextBadge.image}`);
}


async function init() {
    await countDataEntries();
    displayBadgeProgress();
}


await init();