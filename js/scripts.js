var normalizedMovies = normalizedMovies.slice(0, 200);
var bookmarkedMovies = [];

var elSearchForm = $_('.search-form');
var elSearchInput = $_('.search-input', elSearchForm);
var elCategoriesSelect = $_('.catigories-select', elSearchForm);
var elSortSelect = $_('.sort-selct', elSearchForm);

var elMoviesWrapper = $_('.movies');
var elBookmarkedMovies = $_('.bokmarks-wrapper');

var elMoviesTemplate = $_('#movie_template').content;
var elBookmarkedMovieTemplate = $_('#bookmarked-movie-template').content;

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


var renderMovies = function (searchResults, searchRegex) {
  elMoviesWrapper.innerHTML = '';

  var elMoviesWrapperFragment = document.createDocumentFragment();

  searchResults.forEach(function (movie) {
    var elMovie = elMoviesTemplate.cloneNode(true);

    $_('.movie', elMovie).dataset.imdbId = movie.imdbId;
    $_('.movie__img', elMovie).src = movie.smallPoster;

    if (searchRegex.source === '(?:)') {
      $_('.movie__title', elMovie).textContent = movie.title;
    } else {
      $_('.movie__title', elMovie).innerHTML = movie.title.replace(searchRegex, `<mark class="px-0">${movie.title.match(searchRegex)}</mark>`);
    }

    $_('.movie__categories', elMovie).textContent = movie.categories.join(', ');
    $_('.movie__rating', elMovie).textContent = movie.imdbRating;
    $_('.movie__year', elMovie).textContent = movie.year;
    $_('.trailer__link', elMovie).href = movie.trailer;

    elMoviesWrapperFragment.appendChild(elMovie);
  });

  elMoviesWrapper.appendChild(elMoviesWrapperFragment)
};


var sortObjectsAZ = function (array) {
  return array.sort(function (a, b) {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    }
    return 0;
  });
};

var sortObjectsRating = function (array) {
  return array.sort(function (a, b) {
    if (a.imdbRating > b.imdbRating) {
      return -1;
    } else if (a.imdbRating < b.imdbRating) {
      return 1;
    }
    return 0;
  });
}

var sortObjectsYear = function (array) {
  return array.sort(function (a, b) {
    if (a.year > b.year) {
      return -1;
    } else if (a.year < b.year) {
      return 1;
    }
    return 0;
  });
}

var sortSearchResults = function (results, sortType) {
  // TODO - create sorting function that accepts array of objects and sorting property
  if (sortType === 'az') {
    return sortObjectsAZ(results);
  } else if (sortType === 'za') {
    return sortObjectsAZ(results).reverse();
  } else if (sortType === 'rating_desc') {
    return sortObjectsRating(results)
  } else if (sortType === 'rating_asc') {
    return sortObjectsRating(results).reverse();
  } else if (sortType === 'year_desc') {
    return sortObjectsYear(results)
  } else if (sortType === 'year_asc') {
    return sortObjectsYear(results).reverse();
  }
};


var findMovies = function (title, genre) {
  return normalizedMovies.filter((movie) => {
    var doesMatchCategory = genre === 'All' || movie.categories.includes(genre);

    return movie.title.match(title) && movie.imdbRating && doesMatchCategory;
  });
};


// Arrow function
elSearchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  var searchTitle = elSearchInput.value.trim();
  var movieTitleRegex = new RegExp(searchTitle, 'gi');
  var genre = elCategoriesSelect.value;
  var sorting = elSortSelect.value;

  var searchResults = findMovies(movieTitleRegex, genre);
  var test = sortSearchResults(searchResults, sorting);
  console.log(test);

  renderMovies(searchResults, movieTitleRegex);
});

var searchTitle = elSearchInput.value.trim();
var movieTitleRegex = new RegExp(searchTitle, 'gi');
var genre = elCategoriesSelect.value;
var sorting = elSortSelect.value;

var searchResults = findMovies(movieTitleRegex, genre);
var test = sortSearchResults(searchResults, sorting);
console.log(test);
renderMovies(searchResults, movieTitleRegex);

var updateMovieModalContent = function (movie) {
  $_('.modal-title').textContent = movie.title;
  $_('.modal-img').src = movie.smallPoster;
  $_('.movie-modal-genre').textContent = movie.categories;
  $_('.movie-modal-year').textContent = movie.year;
  $_('.movie-modal-language').textContent = movie.language;
  $_('.movie-modal-runtime').textContent = `${movie.runtime} min`;
  $_('.movie-modal-summary').textContent = movie.summary;
}


var showMovieModal = function (eventTarget) {
  var movieImdbId = eventTarget.closest('.movie').dataset.imdbId;

  var foundMovie = normalizedMovies.find(function (movie) {
    return movie.imdbId === movieImdbId;
  });

  updateMovieModalContent(foundMovie)
}


var renderBookmarkedMovies = function () {
  elBookmarkedMovies.innerHTML = '';

  var elBookmarkedMoviesFragment = document.createDocumentFragment();

  bookmarkedMovies.forEach(function (movie) {
    var elBookmarkedMovie = elBookmarkedMovieTemplate.cloneNode(true);
    
    $_('.bookmarked-movie__title', elBookmarkedMovie).textContent = movie.title;
    $_('.js-remove-bookmarked-movie-button', elBookmarkedMovie).dataset.imdbId = movie.imdbId;

    elBookmarkedMoviesFragment.appendChild(elBookmarkedMovie);
  });

  elBookmarkedMovies.appendChild(elBookmarkedMoviesFragment);
};

var bookmarkMovie = function (movie) {

  bookmarkedMovies.push(movie);

  renderBookmarkedMovies();
};

elMoviesWrapper.addEventListener('click', function (evt) {
  if (evt.target.matches('.js-modal-btn')) {
    showMovieModal(evt.target);
  } else if (evt.target.matches('.js-movie-bookmark')) {
  
    var movieImdbId = evt.target.closest('.movie').dataset.imdbId;

    let foundMovie = normalizedMovies.find(function (movie) {
      return movie.imdbId === movieImdbId
    });

    // var isBookmarked = bookmarkedMovies.find(function (movie) {
    //   return movie.imdbId === foundMovie.imdbId;
    // });

    // if (!isBookmarked) {
    //   bookmarkMovie(foundMovie);
    // }

    bookmarkMovie(foundMovie);

  }
});

elBookmarkedMovies.addEventListener('click', (evt) => {
  if (evt.target.matches('.js-remove-bookmarked-movie-button')) {
    var movieImdbId = evt.target.dataset.imdbId;

    // var kinoIndeksi;
    var kinoIndeksi = bookmarkedMovies.findIndex(function (movie) {
      return movie.imdbId === movieImdbId;
    });

    // var kinoIndeksi = bookmarkedMovies.indexOf(kino);

    bookmarkedMovies.splice(kinoIndeksi, 1);

    renderBookmarkedMovies();
  }
});
