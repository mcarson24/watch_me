//handling favorites via local storage

var favorites = [];


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

funciton init(){
  var savedFavorites = JSON.parse(localStorage.getItem("favorites"));

  if (savedFavorites !== null){
    favorites = savedFavorites;
  }
  renderFavorites();
}

init();