import { loadIndex } from "./dataLoader.js";

const BADGES = [
    { name: "Premiers Pas", goal: 10 },
    { name: "Un Bon Début", goal: 25 },
    { name: "Curieux", goal: 50 },
    { name: "Explor'Amateur", goal: 100 },
    { name: "Attrapez-les tous !", goal: 151 },
    { name: "Naturaliste", goal: 200 },
    { name: "Ca fait beaucoup là, non ?", goal: 500 },
    { name: "Encyclopédie", goal: 1000 }
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
        const indexData = await loadIndex(randomHighlightContainer);
        
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
          <strong>${currentBadge.name}</strong>
          <small>${currentBadge.goal} espèces</small>
        </div>

        <div class="badge next">
          <span>Prochain badge</span>
          <strong>${nextBadge ? nextBadge.name : "Tous obtenus"}</strong>
          <small>${nextBadge ? `${nextBadge.goal} espèces` : "Photodex complété"}</small>
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
    </section>
  `;
}


async function init() {
    await countDataEntries();
    displayBadgeProgress(BADGES);
}


await init();