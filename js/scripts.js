
var normalizedMovies = normalizedMovies.slice(0, 200);
var select = ['Alphabet (A-Z)', 'Alphabet (Z-A)', 'Rating (1-10)', 'Rating (10-1)']
var categories = [];

var elMoviesWrapper = $_('.movies');
var elSearchForm = $_('.search-form');
var elSearchInput = $_('.search-input');
var elSearchButton = $_('.search-button');
var elCategoriesSelect = $_('.catigories-select');
var elSortSelect = $_('.sort-selct');
var elMoviesTemplate = $_('#movie_template').content;


// Create Element Function
var createMoviesElement = function (movie) {
  var elNewMovies = elMoviesTemplate.cloneNode(true);

  elNewMovies.querySelector('.movie__img').src = movie.smallPoster;
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

  var createMoviesBySearch = normalizedMovies.filter(function (movie) {
    var result = movie.title.match(searchRegex);
    
    if (result) {
      newResult.push(movie);
    }
  });

  renderMovies(newResult);
}


var getCategories = function(normalizedMovies) {
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


for (var sort of select) {
  var newOption = document.createElement('option');
  newOption.textContent = sort;
  newOption.value = sort;

  elSortSelect.appendChild(newOption)
}


elCategoriesSelect.addEventListener('change', function () {
  var categoryMovie = [];
  categoryMovie = normalizedMovies.filter(function (movie) {
    if (elCategoriesSelect.value === 'All') {
      return movie;
    };
  
    var film = movie.categories.includes(elCategoriesSelect.value);
    return film;
  });
  
  renderMovies(categoryMovie);
});


var normalizedMoviesCopy = normalizedMovies.slice();
elSortSelect.addEventListener('change', function () {
  if (elSortSelect.value === 'Alphabet (A-Z)') {
    normalizedMoviesCopy.sort(function (a, b) {
      var atitle = a.title, btitle = b.title;
      if (atitle < btitle) {
        return -1;
      };
      return 0;
    });
    renderMovies(normalizedMoviesCopy);
  }

  if (elSortSelect.value === 'Alphabet (Z-A)') {
    normalizedMoviesCopy.sort(function (a, b) {
      var atitle = a.title, btitle = b.title;
      if (atitle > btitle) {
        return -1;
      };
      return 0;
    });
    renderMovies(normalizedMoviesCopy);
  }

  if (elSortSelect.value === 'Rating (1-10)') {
    normalizedMoviesCopy.sort(function (a, b) {
      return a.imdbRating - b.imdbRating;
    });
    renderMovies(normalizedMoviesCopy);
  }

  if (elSortSelect.value === 'Rating (10-1)') {
    normalizedMoviesCopy.sort(function (a, b) {
      return b.imdbRating - a.imdbRating;
    });
    renderMovies(normalizedMoviesCopy);
  }

  return 0;

  renderMovies(normalizedMoviesCopy);
})
elSearchForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
})
elSearchInput.addEventListener('input', searchMovie);
elSearchButton.addEventListener('submit', searchMovie);
elCategoriesSelect.addEventListener('change', categoryMovie)