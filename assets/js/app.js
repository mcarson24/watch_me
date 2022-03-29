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

  // Response returns an array of content. The user will select which movie/show they
  //  want; we will use that to make the next API call to watchMode.
  // Temporarily will use the first item returned.
  const selected = data.results[0]

  // WatchMode Title Details Endpoint
  response = await fetch(`https://api.watchmode.com/v1/title/${selected.id}/details/?apiKey=oW3y8drDCyPOFpr3qmP4s0cWvaBFPPJ9x8SxXi5n&append_to_response=sources`)
  return await response.json()
}

(async () => {
  // Temporary title, will use user input soon.
  const info = await getTitleInformation('The Shawshank Redemption')
  console.log(info)
})()

//takes a show/movie title as parameter and pushes title to local storage array
function saveToFavorites(title){
  var favorites = this.getFromFavorites;

  favorites.push(title);

  localStorage.setItem('favorites', JSON.stringify(favorites));
}


//checks local storage for existing "favorites" and returns array
function getFromFavorites(){
  var favorites;
  
  if(localStorage.getItem('favorites' === null)){
      favorites = [];
  }
  else{
      favorites = JSON.parse(localStorage.getIem('favorites'));
  }
  return favorites;
}