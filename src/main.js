import { elements } from './dom.js';
import { fetchRandomMovies, fetchTopMovies, shuffleArray, displayTrailer, prevTrailer, nextTrailer } from './fetch.js';

document.addEventListener('DOMContentLoaded', () => {
    const omdbAPI = 'http://www.omdbapi.com/?apikey=e34058a2';

    let favorites = [];

    function clearSearchResults() {
        elements.searchResultsList.innerHTML = '';
    }

    function displaySearchResults(movies) {
        clearSearchResults();
        movies.forEach(movie => {
            const listItem = document.createElement('li');
            const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
            const favoriteButtonText = isFavorite ? 'Remove favorite' : 'Favorite';
            listItem.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <span>${movie.Title}</span>
                <button class="favoriteBtn" data-imdbid="${movie.imdbID}">${favoriteButtonText}</button>
            `;
            const favoriteBtn = listItem.querySelector('.favoriteBtn');
            favoriteBtn.addEventListener('click', event => {
                event.stopPropagation();
                toggleFavorite(movie, listItem, favoriteBtn);
            });
            listItem.addEventListener('click', () => displayMovieInfo(movie));
            elements.searchResultsList.appendChild(listItem);
        });
        elements.searchResultsContainer.style.display = 'block';
        elements.trailerContainer.style.display = 'none';
        elements.topMoviesContainer.style.display = 'none';
    }
    
    function toggleFavorite(movie, listItem, favoriteBtn) {
        const index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);
        const clonedMovie = JSON.parse(JSON.stringify(movie));
        if (index === -1) {
            favorites.push(clonedMovie);
            favoriteBtn.textContent = 'Remove favorite';
        } else {
            favorites.splice(index, 1);
            favoriteBtn.textContent = 'Favorite';
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
    
        const searchResultFavoriteBtn = listItem.querySelector('.favoriteBtn');
        if (searchResultFavoriteBtn) {
            searchResultFavoriteBtn.textContent = favoriteBtn.textContent;
        }
    
        const favoriteButtonInFavorites = document.querySelectorAll(`.favoriteBtn[data-imdbid="${movie.imdbID}"]`);
        favoriteButtonInFavorites.forEach(btn => {
            btn.textContent = favoriteBtn.textContent;
        });
    }

    function renderFavorites() {
        const favoritesList = document.getElementById('favoritesList');
        favoritesList.innerHTML = '';
        favorites.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <span>${movie.Title}</span>
                <button class="favoriteBtn" data-imdbid="${movie.imdbID}">Remove favorite</button>
            `;
            const favoriteBtn = listItem.querySelector('.favoriteBtn');
            favoriteBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                toggleFavorite(movie, listItem, favoriteBtn);
            });
            listItem.addEventListener('click', function() {
                displayMovieInfo(movie);
            });
            favoritesList.appendChild(listItem);
        });
    
        const favoritesContainer = document.getElementById('favoritesContainer');
        const favoriteButtonInSearch = searchResultsList.querySelectorAll('.favoriteBtn');
        if (favorites.length === 0) {
            favoritesContainer.style.display = 'none';
            elements.favoriterButton.textContent = 'Favorites';
            favoriteButtonInSearch.forEach(btn => {
                btn.textContent = 'Favorite';
            });
        } else {
            if (favoritesContainer.style.display === 'block') {
                elements.favoriterButton.textContent = 'Hide Favorites';
            }
        }
    }

    function displayMovieInfo(movie) {
        const imdbID = movie.imdbID;

        fetch(`${omdbAPI}&plot=full&i=${imdbID}`)
            .then(response => response.json())
            .then(data => {
                movieInfoContainer.innerHTML = `
                    <h2>${data.Title} (${data.Year})</h2>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Actors:</strong> ${data.Actors}</p>
                    <p><strong>Plot:</strong> ${data.Plot}</p>
                    <p><strong>Runtime:</strong> ${data.Runtime}</p>
                    <p><strong>Genre:</strong> ${data.Genre}</p>
                    <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
                    <img src="${data.Poster}" alt="${data.Title} Poster">
                `;

                const backButton = document.createElement('button');
                backButton.textContent = 'Hide movie details';
                backButton.addEventListener('click', function() {
                    searchResultsContainer.style.display = 'block';
                    movieInfoContainer.style.display = 'none';
                });
                movieInfoContainer.appendChild(backButton);

                searchResultsContainer.style.display = 'none';
                movieInfoContainer.style.display = 'block';
            })
            .catch(error => console.error('Error fetching movie details:', error));
    }

    let favoritesVisible = false;

    function searchMovies() {
        const searchTerm = elements.searchInput.value.trim();
        if (searchTerm !== '') {
            fetch(`${omdbAPI}&s=${searchTerm}`)
                .then(response => response.json())
                .then(data => {
                    if (data.Search) {
                        displaySearchResults(data.Search);
                    } else {
                        console.log('No movies found');
                    }
                })
                .catch(error => console.error('Error searching movies:', error));
        }
    }

    elements.prevTrailerBtn.addEventListener('click', prevTrailer);
    elements.nextTrailerBtn.addEventListener('click', nextTrailer);
    elements.searchBtn.addEventListener('click', searchMovies);
    elements.favoriterButton.addEventListener('click', () => {
        const favoritesContainer = document.getElementById('favoritesContainer');
        const searchResultsContainer = document.getElementById('searchResultsContainer');
        
        favoritesVisible = !favoritesVisible;
        favoritesContainer.style.display = favoritesVisible ? 'block' : 'none';
        
        elements.favoriterButton.textContent = favoritesVisible ? 'Hide Favorites' : 'Favorites';
    });
    
    fetchRandomMovies();
    fetchTopMovies();
    favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    renderFavorites();
});
