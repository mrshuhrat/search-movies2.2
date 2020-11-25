var normalizedMovies = normalizedMovies.slice(0, 200);

var elSearchForm = $_('.search-form');
var elSearchInput = $_('.search-input', elSearchForm);
var elSearchButton = $_('.search-button', elSearchForm);
var elCategoriesSelect = $_('.catigories-select', elSearchForm);
var elSortSelect = $_('.sort-selct', elSearchForm);
var elMoviesTemplate = $_('#movie_template').content;

var elMoviesWrapper = $_('.movies');


var getCategories = function() {
  var categories = [];

  normalizedMovies.forEach(function(movie) {
    movie.categories.forEach(function(category) {
      if (!(categories.includes(category))) {
        categories.push(category);
      }
    });
  });

  categories.sort();

  var elOptionFragment = document.createDocumentFragment();

  categories.forEach(function (category) {
    var elCategoryOption = createElement('option', '', category)
    elCategoryOption.value = category;

    elOptionFragment.appendChild(elCategoryOption);
  });

  elCategoriesSelect.appendChild(elOptionFragment);
};

getCategories();


var renderMovies = function (searchResult, searchRegex) {
  elMoviesWrapper.innerHTML = '';

  var elMoviesWrapperFragment = document.createDocumentFragment();

  searchResult.forEach(function (movie) {
    var elMovie = elMoviesTemplate.cloneNode(true);

    $_('.movie__img', elMovie).src = movie.smallPoster;

    if (searchRegex.source === '(?:)') {
      $_('.movie__title', elMovie).textContent = movie.title;
    } else {
      $_('.movie__title', elMovie).innerHTML = movie.title.replace(searchRegex, `<mark class="px-0">${movie.title.match(searchRegex)}</mark>`);
    }

    $_('.movie__categories', elMovie).textContent = movie.categories.join(', ');
    $_('.movie__rating', elMovie).textContent = movie.imdbRating;

    elMoviesWrapperFragment.appendChild(elMovie);
  });

  elMoviesWrapper.appendChild(elMoviesWrapperFragment)
};








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
  if (elSortSelect.value === 'az') {
    normalizedMoviesCopy.sort(function (a, b) {
      var atitle = a.title, btitle = b.title;
      if (atitle < btitle) {
        return -1;
      };
      return 0;
    });
    renderMovies(normalizedMoviesCopy);
  }

  if (elSortSelect.value === 'za') {
    normalizedMoviesCopy.sort(function (a, b) {
      var atitle = a.title, btitle = b.title;
      if (atitle > btitle) {
        return -1;
      };
      return 0;
    });
    renderMovies(normalizedMoviesCopy);
  }

  if (elSortSelect.value === 'rating_asc') {
    normalizedMoviesCopy.sort(function (a, b) {
      return a.imdbRating - b.imdbRating;
    });
    renderMovies(normalizedMoviesCopy);
  }

  if (elSortSelect.value === 'rating_desc') {
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
// elCategoriesSelect.addEventListener('change', categoryMovie);