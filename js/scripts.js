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


var findMovies = function (title, minRating, genre) {
  return normalizedMovies.filter((movie) => {
    var doesMatchCategory = genre === 'All' || movie.categories.includes(genre);

    return movie.title.match(title) && movie.imdbRating >= minRating && doesMatchCategory;
  });
};


// Arrow function
elSearchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  var searchTitle = elSearchInput.value.trim();
  var movieTitleRegex = new RegExp(searchTitle, 'gi');
  // var minimumRating = Number(elSearchRatingInput.value);
  var genre = elCategoriesSelect.value;
  var sorting = elSortSelect.value;

  var searchResults = findMovies(movieTitleRegex, /* minimumRating, */ genre);
  var test = sortSearchResults(searchResults, sorting);

  renderMovies(searchResults, movieTitleRegex);
});
