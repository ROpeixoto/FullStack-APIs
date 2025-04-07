import { useState } from 'react'
import './App.css'

function App() {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedMovieId, setExpandedMovieId] = useState(null); // Novo estado

  const searchMovies = async () => {
    setLoading(true);
    const response = await fetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_API_KEY}`,
          'accept': 'application/json'
        }
      }
    );
    const data = await response.json();
    setMovies(data.results);
    setLoading(false);
    setExpandedMovieId(null); // Resetar o filme expandido ao fazer nova busca
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchMovies();
  };

  const toggleMovieDetails = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  return (
    <div className="app">
      <h1>TMDB Movie Search</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      <div className="movies">
        {movies.map(movie => (
          <div key={movie.id} className="movie">
            {movie.poster_path && (
              <img 
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                alt={movie.title}
              />
            )}
            <h3>{movie.title}</h3>
            <p>{movie.release_date}</p>
            <p>Rating: {movie.vote_average}</p>
            
            <button 
              onClick={() => toggleMovieDetails(movie.id)}
              className="details-button"
            >
              {expandedMovieId === movie.id ? 'Hide Details' : 'View Details'}
            </button>
            
            {expandedMovieId === movie.id && (
              <div className="movie-details">
                <p><strong>Overview:</strong> {movie.overview}</p>
                <p><strong>Popularity:</strong> {movie.popularity}</p>
                <p><strong>Original Language:</strong> {movie.original_language}</p>
                <p><strong>Vote Count:</strong> {movie.vote_count}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App