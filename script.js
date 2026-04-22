let allEpisodes = [];
let showsCache = {};
let showsData = [];

function setup() {
  showLoadingMessage();

  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((shows) => {
      showsData = shows.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );
      showShowsListing(showsData);
      setupShowSearch();
    })
    .catch(() => {
      showErrorMessage("Oops! Could not load shows.");
    });
}

function showLoadingMessage() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `<p class="loading">Loading, please wait...</p>`;
}

function showErrorMessage(msg) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `<p class="error">${msg}</p>`;
}

function showShowsListing(shows) {
  // Hide episode controls, show show search
  document.getElementById("episode-controls").style.display = "none";
  document.getElementById("show-search-controls").style.display = "flex";
  document.getElementById("back-to-shows").style.display = "none";

  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const grid = document.createElement("div");
  grid.classList.add("shows-grid");

  shows.forEach((show) => {
    const { name, image, summary, genres, status, rating, runtime } = show;

    const card = document.createElement("div");
    card.classList.add("show-card");
    card.innerHTML = `
      <img class="show-image" src="${image?.medium ?? ""}" alt="${name}" />
      <div class="show-info">
        <h2 class="show-name">${name}</h2>
        <p class="show-meta">
          <span>⭐ ${rating?.average ?? "N/A"}</span>
          <span>🕒 ${runtime ?? "N/A"} mins</span>
          <span>📺 ${status}</span>
        </p>
        <p class="show-genres">${genres.join(", ") || "N/A"}</p>
        ${summary ?? ""}
      </div>
    `;

    card.querySelector(".show-name").addEventListener("click", () => {
      loadEpisodesForShow(show.id);
    });

    grid.appendChild(card);
  });

  rootElem.appendChild(grid);
}

function setupShowSearch() {
  const showSearch = document.getElementById("show-search");
  showSearch.value = "";
  showSearch.addEventListener("input", (event) => {
    const term = event.target.value.toLowerCase();
    const filtered = showsData.filter(
      (show) =>
        show.name.toLowerCase().includes(term) ||
        show.summary?.toLowerCase().includes(term) ||
        show.genres.some((g) => g.toLowerCase().includes(term)),
    );
    showShowsListing(filtered);
  });
}

function loadEpisodesForShow(showId) {
  // Show episode controls, hide show search
  document.getElementById("episode-controls").style.display = "flex";
  document.getElementById("show-search-controls").style.display = "none";
  document.getElementById("back-to-shows").style.display = "inline-block";

  if (showsCache[showId]) {
    allEpisodes = showsCache[showId];
    makePageForEpisodes(allEpisodes);
    populateEpisodeSelector(allEpisodes);
    resetEpisodeControls();
    return;
  }

  showLoadingMessage();

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((episodes) => {
      showsCache[showId] = episodes;
      allEpisodes = episodes;
      makePageForEpisodes(allEpisodes);
      populateEpisodeSelector(allEpisodes);
      resetEpisodeControls();
    })
    .catch(() => {
      showErrorMessage("Oops! Could not load episodes.");
    });
}

function resetEpisodeControls() {
  document.getElementById("search").value = "";
  document.getElementById("selector").value = "all";
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
      <img class="episode-image" src="${image?.medium ?? ""}" alt="episode image" />
      ${summary ?? ""}
    `;
    mainElem.appendChild(episodeDiv);
  });

  rootElem.appendChild(mainElem);
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
  const searchTerm = event.target.value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary?.toLowerCase().includes(searchTerm),
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

document.getElementById("search").addEventListener("input", searchEpisode);
document.getElementById("selector").addEventListener("change", selectEpisode);
document.getElementById("back-to-shows").addEventListener("click", () => {
  const term = document.getElementById("show-search").value.toLowerCase();
  const filtered = showsData.filter(
    (show) =>
      show.name.toLowerCase().includes(term) ||
      show.summary?.toLowerCase().includes(term) ||
      show.genres.some((g) => g.toLowerCase().includes(term)),
  );
  showShowsListing(filtered);
  setupShowSearch();
});

window.onload = setup;
