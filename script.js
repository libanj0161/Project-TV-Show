//You can edit ALL of the code here
let allEpisodes = [];
function setup() {
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  populateEpisodeSelector(allEpisodes);

  const search = document.getElementById("search");
  search.addEventListener("input", searchEpisode);
  const selector = document.getElementById("selector");
  selector.addEventListener("change", selectEpisode);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  const mainElem = document.createElement("main");
  mainElem.classList.add("container");

  const count = document.getElementById("count");
  count.textContent = `Displaying ${episodeList.length}/${allEpisodes.length}`;

  episodeList.forEach((episode) => {
    const { name, season, number, image, summary } = episode;
    const paddedSeason = String(season).padStart(2, "0");
    const paddedNumber = String(number).padStart(2, "0");

    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode-card");
    episodeDiv.innerHTML = `
    <h2 class="title">${name} - S${paddedSeason}E${paddedNumber}</h2>
    <img
  class="episode-image"
  src="${image.medium}"
  alt="episode image" />
  ${summary} 
  `;
    mainElem.appendChild(episodeDiv);
    rootElem.appendChild(mainElem);
  });
}
function populateEpisodeSelector(episodeList) {
  const select = document.getElementById("selector");
  select.innerHTML = '<option value="all">All Episodes</option>';

  episodeList.forEach((episode, index) => {
    const { name, season, number } = episode;
    const paddedSeason = String(season).padStart(2, "0");
    const paddedNumber = String(number).padStart(2, "0");

    const option = document.createElement("option");
    option.textContent = `S${paddedSeason}E${paddedNumber} - ${name}`;
    option.value = index;
    select.appendChild(option);
  });
}

function searchEpisode(event) {
  const searchTerm = event.target.value;
  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm),
  );

  makePageForEpisodes(filteredEpisodes);
}

function selectEpisode(event) {
  const episodeValue = event.target.value;
  if (episodeValue === "all") {
    makePageForEpisodes(allEpisodes);
  } else {
    makePageForEpisodes([allEpisodes[episodeValue]]);
  }
}

window.onload = setup;
