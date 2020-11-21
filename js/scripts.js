var normalizedMovies = movies.map(function (movie, i) {
  return {
    id: i,
    title: movie.Title.toString(),
    year: movie.movie_year,
    categories: movie.Categories.split('|'),
    summary: movie.summary,
    imageUrl: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
    imdbRating: movie.imdb_rating,
    runtime: movie.runtime,
    language: movie.language,
    traillerLink: `https://www.youtube.com/watch?v=${movie.ytid}`
  };
}).slice(0, 300);

var select = ['Alphabet (A-Z)', 'Alphabet (Z-A)', 'Rating (1-10)', 'Rating (10-1)']
var categories = [];

var elMoviesWrapper = $_('.movies');
var elSearchForm = $_('.search-form');
var elSearchInput = $_('.search-input');
var elSearchButton = $_('.search-button');
var elCategoriesSelect = $_('.catigories-select');
var elSortSelect = $_('.sort-selct');
var elMoviesTemplate = $_('#movie_template').content;

var createMoviesElement = function (movie) {
  var elNewMovies = elMoviesTemplate.cloneNode(true);

  elNewMovies.querySelector('.movie__img').src = movie.imageUrl;
  elNewMovies.querySelector('.movie__title').textContent = movie.title;
  elNewMovies.querySelector('.movie__categories').textContent = movie.categories.join(', ');
  elNewMovies.querySelector('.movie__rating').textContent = movie.imdbRating;

  return elNewMovies;
}

var renderMovies = function (normalizedMovies) {

  elMoviesWrapper.innerHTML = '';
  var elMoviesWrapperFragment = document.createDocumentFragment();

  normalizedMovies.forEach(function (movie) {
    elMoviesWrapperFragment.appendChild(createMoviesElement(movie));
  });
  elMoviesWrapper.appendChild(elMoviesWrapperFragment);
};

renderMovies(normalizedMovies);


var searchMovie = function () {

  var searchWord = elSearchInput.value.trim();
  var searchRegex = new RegExp(searchWord, 'gi');
  var newResult = [];

  var createMoviesBySearch = normalizedMovies.filter(function(movie) {
    var result = movie.title.match(searchRegex);
    
    if (result) {
      newResult.push(movie);
    }
  });

  renderMovies(newResult);
}


const getCategories = function(normalizedMovies) {
  categories.push(normalizedMovies[0].categories[0]);

  normalizedMovies.forEach(function(movie) {
    movie.categories.forEach(function(category) {
      if (!(categories.includes(category))) {
        categories.push(category);
      }
    });
  });
  return categories;
};

getCategories(normalizedMovies);


for (var category of categories) {
  var newOption = document.createElement('option');
  newOption.textContent = category;
  newOption.value = category;

  elCategoriesSelect.appendChild(newOption);
}
var newOptionCategories = document.createElement('option');
newOptionCategories.textContent = 'Categories';
newOptionCategories.selected = true;
newOptionCategories.disabled = true;

elCategoriesSelect.appendChild(newOptionCategories);


for (var sort of select) {
  var newOption = document.createElement('option');
  newOption.textContent = sort;
  newOption.value = sort;

  elSortSelect.appendChild(newOption)
}
var newOptionSelect = document.createElement('option');
newOptionSelect.textContent = 'Select'
newOptionSelect.selected = true;
newOptionSelect.disabled = true;

elSortSelect.appendChild(newOptionSelect);

elSearchForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
})
elSearchInput.addEventListener('input', searchMovie);
elSearchButton.addEventListener('submit', searchMovie);
