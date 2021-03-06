const searchForm = document.querySelector('#search')
const searchResults = document.querySelector('#search-results')
var favoritesList = document.querySelector("#displayFavorites")
var favoriteBtn = document.querySelector("#favorite-btn")
var titleSpan = document.querySelector("#title");

let titleInfo
var favorites = [];

// const watchModeKey = '9CXzPOxljYCpAhYv6DZM68hUPQ9ThHrdANojKj9w'
const watchModeKey = 'SBJT7QLtp0gG5jF0WDpFJZ5CoSlBJYwJ5SdRXOeI'

const getTitleInformation = async title => {
  if (!title) return
  // IMDb API 'SeachTitle' endpoint
  let response = await fetch(`https://imdb-api.com/en/API/SearchTitle/k_vd8o64bn/${title.trim()}`)
  let data = await response.json()
  // No data is found matching query
  if (!data.results.length) {
    console.log('No matches found')
    return
    // TODO: Display message on page. 'No matches found with that title.'
  }
  displaySearchResults(data)
}

function saveToFavorites(){
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function renderFavorites() {
  favoritesList.innerHTML = "";
  for (var i = 0; i < favorites.length; i++) {
    var li = document.createElement("li");
    li.setAttribute("data-index", i);
    li.dataset.id = favorites[i].id
    li.textContent = favorites[i].title;
    li.classList = 'm-2'

    var button = document.createElement("button")
    button.classList = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 h-12 border border-blue-700 rounded ml-50";
  
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" style="fill: #FFF;" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
    `

    li.appendChild(button);
    favoritesList.appendChild(li);
  }

}

favoriteBtn.addEventListener("click", function(){
  if (!titleInfo.title) return

  favorites.push({
    id: titleInfo.id,
    title: titleInfo.title
  });

  saveToFavorites();
  renderFavorites();
})


favoritesList.addEventListener("click", function (event) {
    var element = event.target;

    if (element.matches('ul') || element.matches('li')) return

    var index = element.parentElement.getAttribute("data-index");
    favorites.splice(index, 1);
    
    saveToFavorites();
    renderFavorites();
})

const reduceSources = () => {
  let sources = []
  let sourceNames = [] 

  titleInfo.sources.map(source => {
    if (!sourceNames.includes(source.name)) {
      sourceNames.push(source.name)
      sources.push(source)
    }
  })
  titleInfo.sources = sources
}

const updateScreen = async () => {
  document.querySelector('#title').textContent = titleInfo.title
  document.querySelector('#favorite-btn').classList.remove('hidden')
  const streamingServices = document.querySelector('#streaming_services')
  const availableServices = ['google_play', 'amazon', 'disneyplus', 'hulu', 'netflix', 'hbo_max']
  // Remove previous search's steaming services
  const services = document.getElementsByClassName('service')
  for (const service of services) {
    service.classList.add('hidden')
    service.setAttribute('href', '#')
  }
  let hasAtLeastOneStreamer = false
  titleInfo.sources.forEach(source => {
    const formatted_source_name = source.name.toLowerCase().replace(' ', '_').replace('+', 'plus')

    if (availableServices.includes(formatted_source_name)) {
      hasAtLeastOneStreamer = true
      const image = document.querySelector(`#${formatted_source_name}`)
      image.classList.remove('hidden')
      image.setAttribute('href', source.web_url)
    }
  })

  if (document.querySelector('#message')) streamingServices.removeChild(document.querySelector('#message'))

  if (!hasAtLeastOneStreamer) {
    const message = document.createElement('p')    
    message.textContent = `${titleInfo.title} is not currently available on any of the services we support.`
    message.setAttribute('id', 'message')
    document.querySelector('#streaming_services').append(message)
  }
}

const displaySearchResults = data => {
  searchResults.classList.remove('hidden')
  searchResults.innerHTML = ''

  data.results.forEach(result => {
    const li = document.createElement('li')
    li.classList = 'even:bg-slate-200 px-2 py-4 font-bold hover:cursor-pointer'
    li.textContent = result.title
    li.dataset.imdb_id = result.id
    searchResults.appendChild(li)
  })

  searchResults.addEventListener('click', async e => {
    if (!e.target.matches('li')) return

    // WatchMode Title Details Endpoint
    response = await fetch(`https://api.watchmode.com/v1/title/${e.target.dataset.imdb_id}/details/?apiKey=${watchModeKey}&append_to_response=sources`)
    titleInfo = await response.json()
    reduceSources()
    
    // Remove search results
    resetSearchResults()
    updateScreen()
  })
}

const resetSearchResults = () => {
  searchResults.classList.add('hidden')
  searchResults.parentElement.children[0].children[0].value = ''
}

searchForm.addEventListener('submit', e => {
  e.preventDefault()
  getTitleInformation(e.target.children[0].value)
})

favoritesList.addEventListener('click', async e => {
  if (!e.target.matches('li')) return 
  // WatchMode Title Details Endpoint
  response = await fetch(`https://api.watchmode.com/v1/title/${e.target.dataset.id}/details/?apiKey=${watchModeKey}&append_to_response=sources`)
  titleInfo = await response.json()
  reduceSources()
  
  // Remove search results
  resetSearchResults()
  updateScreen()
})

function init(){
  var savedFavorites = JSON.parse(localStorage.getItem("favorites"));

  if (savedFavorites !== null){
    favorites = savedFavorites;
  }
  renderFavorites();
}

init();
