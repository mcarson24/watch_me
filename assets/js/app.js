const searchForm = document.querySelector('#search')
const searchResults = document.querySelector('#search-results')

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

  var ul = document.createElement("ul");

  for (var i = 0; i < favorites.length; i++) {
    var title = favorites[i];

    var li = document.createElement("li");
    li.textContent = "placeholder";
    li.setAttribute("data-index", i);
    ul.appendChild(li);
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
    response = await fetch(`https://api.watchmode.com/v1/title/${e.target.dataset.imdb_id}/details/?apiKey=oW3y8drDCyPOFpr3qmP4s0cWvaBFPPJ9x8SxXi5n&append_to_response=sources`)
    titleInfo = await response.json()
    
    // Remove search results
    resetSearchResults()
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

funciton init(){
  var savedFavorites = JSON.parse(localStorage.getItem("favorites"));

  if (savedFavorites !== null){
    favorites = savedFavorites;
  }
  renderFavorites();
}

init();
