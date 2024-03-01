
export { fetchRandomMovies, fetchTopMovies, shuffleArray, displayTrailer, prevTrailer, nextTrailer };

import { elements } from './dom.js';

const moviesAPI = 'https://santosnr6.github.io/Data/movies.json';
let currentTrailerIndex = 0;
let trailers = [];

function fetchRandomMovies() {
    fetch(moviesAPI)
        .then(response => response.json())
        .then(data => {
            trailers = shuffleArray(data).slice(0, 5);
            displayTrailer();
        })
        .catch(error => console.error('Error fetching random movies:', error));
}

function fetchTopMovies() {
    fetch(moviesAPI)
        .then(response => response.json())
        .then(data => {
            const topMovies = data.slice(0, 20);
            topMovies.forEach(movie => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<img src="${movie.poster}" alt="${movie.title}"><span>${movie.title}</span>`;
                elements.topMoviesList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching top movies:', error));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayTrailer() {
    const currentTrailer = trailers[currentTrailerIndex];
    elements.trailerVideo.innerHTML = `<iframe width="560" height="315" src="${currentTrailer.trailer_link}" frameborder="0" allowfullscreen></iframe>`;
}

function prevTrailer() {
    currentTrailerIndex = (currentTrailerIndex === 0) ? trailers.length - 1 : currentTrailerIndex - 1;
    displayTrailer();
}

function nextTrailer() {
    currentTrailerIndex = (currentTrailerIndex === trailers.length - 1) ? 0 : currentTrailerIndex + 1;
    displayTrailer();
}
