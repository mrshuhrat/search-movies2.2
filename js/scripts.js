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

var mocieCatigories = [];

var elMoviesWrapper = $_('.movies');
var elSearchInput = $_('.search-input');
var elSearchButton = $_('.search-button');
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

elSearchInput.addEventListener('input', searchMovie);
elSearchButton.addEventListener('click', searchMovie);
