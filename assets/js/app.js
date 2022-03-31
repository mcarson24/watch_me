const searchForm = document.querySelector('#search')
const searchResults = document.querySelector('#search-results')
var favoritesList = document.querySelector("#displayFavorites")
var favoriteBtn = document.querySelector("#favorite-btn")
var titleSpan = document.querySelector("#title");

let titleInfo
var favorites = [];

// TODO: GET Info on TV Show or Movie from IMDB API

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
    var title = favorites[i];
    var li = document.createElement("li");
    li.setAttribute("data-index", i);
    li.textContent = title;

    var button = document.createElement("button");
    button.textContent = "Remove";
    button.classList = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded ml-50";
    li.appendChild(button);
    favoritesList.appendChild(li);
  }

}

favoriteBtn.addEventListener("click", function(){
  var titleText = titleSpan.textContent.trim();

  if(titleText === ""){
    return;
  }
  favorites.push(titleText);
  saveToFavorites();
  renderFavorites();
})


favoritesList.addEventListener("click", function(event) {
    var element = event.target;
    
    if (element.matches("button") === true) {
      var index = element.parentElement.getAttribute("data-index");
      favorites.splice(index, 1);
      
      saveToFavorites();
      renderFavorites();
    }
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

const updateScreen = () => {
  document.querySelector('#title').textContent = titleInfo.title
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
    response = await fetch(`https://api.watchmode.com/v1/title/${e.target.dataset.imdb_id}/details/?apiKey=oW3y8drDCyPOFpr3qmP4s0cWvaBFPPJ9x8SxXi5n&append_to_response=sources`)
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

function init(){
  var savedFavorites = JSON.parse(localStorage.getItem("favorites"));

  if (savedFavorites !== null){
    favorites = savedFavorites;
  }
  
  renderFavorites();
}



init();
