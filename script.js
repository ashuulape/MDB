const apiKey = '572cb22427bcadfc24b555ab1636de9a';

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

function showPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'flex';
    preloader.style.opacity = '1';
  }
}

function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 300);
  }
}

// On window load, show top rated movies on home screen by default
window.addEventListener('load', () => {
  hidePreloader();
  fetchTopRatedMoviesOnHome();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  sidebar.classList.toggle('active');
});

document.addEventListener('click', event => {
  if (!hamburger.contains(event.target) && !sidebar.contains(event.target)) {
    hamburger.classList.remove('active');
    sidebar.classList.remove('active');
  }
});

document.getElementById('home-link').addEventListener('click', e => {
  e.preventDefault();
  showHome();
});

document.getElementById('movies-link').addEventListener('click', e => {
  e.preventDefault();
  fetchTopMovies();
});

document.getElementById('upcoming-link').addEventListener('click', e => {
  e.preventDefault();
  fetchUpcomingMovies();
});

document.getElementById('tv-shows-link').addEventListener('click', e => {
  e.preventDefault();
  fetchTopTVShows();
});

document.getElementById('about-link').addEventListener('click', e => {
  e.preventDefault();
  showAbout();
});

document.getElementById('searchBtn').addEventListener('click', searchMovies);
document.getElementById('query').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    searchMovies();
  }
});

function showHome() {
  // Show top rated movies as the default home screen
  document.getElementById('sitename').innerHTML = `<h1 onclick="showHome()"> <img id="logo" src="Film-Roll-PNG-Image.png" alt="" width="50px"  >MDb Movie Search</h1>`;
  document.getElementById('home-section').style.display = 'none';
  document.getElementById('about-section').style.display = 'none';
  document.getElementById('movies').style.display = 'flex';
  fetchTopRatedMoviesOnHome();
}

function showMovies() {
  document.getElementById('home-section').style.display = 'none';
  document.getElementById('about-section').style.display = 'none';
  document.getElementById('movies').style.display = 'flex';
}

function showAbout() {
  document.getElementById('sitename').innerHTML = `<h1 onclick="showHome()"> <img id="logo" src="Film-Roll-PNG-Image.png" alt="" width="50px"  >About</h1>`;
  document.getElementById('home-section').style.display = 'none';
  document.getElementById('movies').style.display = 'none';
  document.getElementById('about-section').style.display = 'block';
}

function updateTitle(title) {
  document.querySelector('#sitename h1').textContent = title;
}

function displayMovies(movies, isTVShow = false) {
  const moviesContainer = document.getElementById('movies');
  moviesContainer.innerHTML = '';

  if (!movies.length) {
    moviesContainer.innerHTML = '<p>No results found.</p>';
    return;
  }

  movies.forEach(item => {
    const poster = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : `noimage.png`;

    const backdrop = item.backdrop_path
      ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
      : '';

    const rating = item.vote_average ? item.vote_average / 2 : 0;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '<span style="color: gold;">★</span>';
    }
    if (halfStar) {
      stars += '<span style="color: gold;">☆</span>';  
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += '<span style="color: lightgray;">☆</span>';
    }    
    const title = isTVShow ? item.name : item.title;
    const release = isTVShow ? item.first_air_date : item.release_date;
    // Add language info
    const language = item.original_language ? item.original_language.toUpperCase() : 'N/A';

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    movieEl.innerHTML = `
      ${backdrop ? `<div class="movie-backdrop" style="background-image: url('${backdrop}')"></div>` : ''}
     <div class="info"><img src="${poster}" alt="${title}" />
      <h3 >${title}</h3>
      <p>Release: ${release || 'N/A'}</p>
      <p>Language: ${language}</p>
      <p style="color: white;">Rating: ${stars} (${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'})</p>
      <p style="color: white;">${item.overview ? item.overview.substring(0, 50) + '...' : 'No overview available'}</p>
      
     </div>
    `;
    moviesContainer.appendChild(movieEl);

    movieEl.addEventListener('click', () => {
      showPreloader();
      setTimeout(() => { 
        window.open(`https://piratesharbour69.netlify.app/2ndpage?query=${title}`, '_blank');
      }, 10); 
      hidePreloader();
    });
  });
}

// Helper function to fetch multiple pages and combine results
async function fetchMultiplePages(urlBase, totalPages = 2) {
  let allResults = [];
  for (let page = 1; page <= totalPages; page++) {
    const url = `${urlBase}&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.results) {
      allResults = allResults.concat(data.results);
    }
  }
  return allResults;
}

// Fetch top rated movies for home screen (default)
async function fetchTopRatedMoviesOnHome() {
  showPreloader();
  try {
    const urlBase = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US`;
    // Fetch 5 pages (100 movies)
    const results = await fetchMultiplePages(urlBase, 2);
    document.getElementById('sitename').innerHTML = `<h1 onclick="showHome()"> <img id="logo" src="Film-Roll-PNG-Image.png" alt="" width="50px"  >Movies DataBase</h1>`;

    showMovies();
    displayMovies(results);
  } catch (error) {
    console.error(error);
  } finally {
    hidePreloader();
  }
}

async function fetchTopMovies() {
  showPreloader();
  try {
    const urlBase = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US`;
    // Fetch 5 pages (100 movies)
    const results = await fetchMultiplePages(urlBase, 2);
    document.getElementById('sitename').innerHTML = `<h1 onclick="showHome()"> <img id="logo" src="Film-Roll-PNG-Image.png" alt="" width="50px"  >Latest Movies</h1>`;
    showMovies();
    displayMovies(results);
  } catch (error) {
    console.error(error);
  } finally {
    hidePreloader();
  }
}

async function fetchUpcomingMovies() {
  showPreloader();
  try {
    const urlBase = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US`;
    // Fetch 5 pages (100 movies)
    const results = await fetchMultiplePages(urlBase, 2);
    document.getElementById('sitename').innerHTML=`<h1 onclick="showHome()"> <img id="logo" src="Film-Roll-PNG-Image.png" alt="" width="50px"  >Upcoming Movies</h1>`
    showMovies();
    displayMovies(results);
  } catch (error) {
    console.error(error);
  } finally {
    hidePreloader();
  }
}

async function fetchTopTVShows() {
  showPreloader();
  try {
    const urlBase = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US`;
    // Fetch 5 pages (100 TV shows)
    const results = await fetchMultiplePages(urlBase, 2);
    document.getElementById('sitename').innerHTML=`<h1 onclick="showHome()"> <img id="logo" src="Film-Roll-PNG-Image.png" alt="" width="50px"  >Popular TV Shows</h1>`
    showMovies();
    displayMovies(results, true);
  } catch (error) {
    console.error(error);
  } finally {
    hidePreloader();
  }
}

async function searchMovies() {
  const query = document.getElementById('query').value.trim();
  if (!query) {
    alert('Please enter a movie title');
    return;
  }

  showPreloader();
  try {
    const urlBase = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    // Fetch 5 pages (100 search results)
    const results = await fetchMultiplePages(urlBase, 2);
    document.getElementById('sitename').innerHTML=`<h1 onclick="showHome()"> <img id="logo" src="Film-Roll-PNG-Image.png" alt="" width="50px"  >Results for "${query}"</h1>`
    showMovies();
    displayMovies(results);
  } catch (error) {
    console.error(error);
  } finally {
    hidePreloader();
  }
}
