//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const mainElem = document.createElement("main");
  mainElem.classList.add("container");

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

window.onload = setup;
