import { useEffect, useState } from "react";
import AddToListButton from "./AddToListButton";
import "./Recommendations.css";

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

const Recommendations = ({
  wantToWatch = [],
  watched = [],
  isAuthenticated,
  TMDB_API_KEY,
  TMDB_URL,
  setWantToWatch,
  setWatched,
  navigate
}) => {
  const [recommended, setRecommended] = useState([]);
  const [genreName, setGenreName] = useState("");
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [watchSource, setWatchSource] = useState({});

  // Junta todos os gêneros das listas do usuário
  async function getAllGenresFromLists(movies, TMDB_URL, TMDB_API_KEY) {
    const genreIds = new Set();
    for (const movie of movies) {
      if (movie.genres && movie.genres.length > 0) {
        movie.genres.forEach(g => genreIds.add(g.id));
      } else if (movie.genre_ids && movie.genre_ids.length > 0) {
        movie.genre_ids.forEach(id => genreIds.add(id));
      } else if (movie.id) {
        // Busca detalhes se não houver gêneros
        const ids = await fetchMovieGenres(movie.id, TMDB_URL, TMDB_API_KEY);
        ids.forEach(id => genreIds.add(id));
      }
    }
    return Array.from(genreIds);
  }

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchRecommendations = async () => {
      const allMovies = [...wantToWatch, ...watched];
      const allGenres = [28]; // Action

      if (allGenres.length === 0) {
        setRecommended([]);
        setGenreName("");
        return;
      }

      // Escolhe um gênero aleatório
      const randomGenreId = allGenres[Math.floor(Math.random() * allGenres.length)];
      setGenreName(GENRE_MAP[randomGenreId] || "Genre");

      // Busca os filmes mais bem avaliados desse gênero
      const res = await fetch(
        `${TMDB_URL}/discover/movie?with_genres=${randomGenreId}&sort_by=vote_average.desc&vote_count.gte=100&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_KEY}`,
            accept: "application/json",
          },
        }
      );
      const data = await res.json();
      setRecommended(data.results.slice(0, 8));
    };

    fetchRecommendations();
  }, [wantToWatch, watched, isAuthenticated, TMDB_API_KEY, TMDB_URL]);

  // Função para buscar onde assistir (igual Home)
  const fetchWhereToWatch = async (tmdbId) => {
    const response = await fetch(
      `https://api.watchmode.com/v1/title/movie-${tmdbId}/details/?apiKey=${import.meta.env.VITE_WATCHMODE_API_KEY}&append_to_response=sources`
    );
    const data = await response.json();
    const sources = data.sources || [];
    const providers = [];
    const seenNames = new Set();
    for (const s of sources) {
      if (!seenNames.has(s.name)) {
        providers.push({ name: s.name, url: s.web_url });
        seenNames.add(s.name);
      }
    }
    return providers;
  };

  const toggleMovieDetails = async (movieId) => {
    if (expandedMovieId !== movieId && !watchSource[movieId]) {
      const providers = await fetchWhereToWatch(movieId);
      setWatchSource((prev) => ({
        ...prev,
        [movieId]: providers,
      }));
    }
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  async function fetchMovieGenres(movieId, TMDB_URL, TMDB_API_KEY) {
    const res = await fetch(
      `${TMDB_URL}/movie/${movieId}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      }
    );
    const data = await res.json();
    // Retorna array de ids dos gêneros
    if (data.genres && data.genres.length > 0) {
      return data.genres.map(g => g.id);
    }
    return [];
  }

  console.log("wantToWatch", wantToWatch);
  console.log("watched", watched);

  return (
    <div className="page-content">
      <h2 style={{ textAlign: "center" }}>
        Recommendations 👀
        {genreName && <span style={{ fontSize: 16, color: "#aaa" }}> ({genreName})</span>}
      </h2>
      <div className="movies">
        {recommended.map((movie) => (
          <div key={movie.id} className="movie">
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            )}
            <h3>{movie.title}</h3>
            <p>{movie.release_date}</p>
            <p>Audience score: {movie.vote_average?.toFixed(1)} / 10</p>
            <div className="center-btn">
              <AddToListButton
                movieId={movie.id}
                wantToWatch={wantToWatch}
                setWantToWatch={setWantToWatch}
                watched={watched}
                setWatched={setWatched}
                isAuthenticated={isAuthenticated}
                navigate={navigate}
              />
            </div>
            <button
              onClick={() => toggleMovieDetails(movie.id)}
              className="details-button"
            >
              {expandedMovieId === movie.id ? "Hide Details" : "View Details"}
            </button>
            {expandedMovieId === movie.id && (
              <div className="movie-details">
                <p>
                  <strong>Overview:</strong> {movie.overview}
                </p>
                <p>
                  <strong>Popularity:</strong> {movie.popularity}
                </p>
                <p>
                  <strong>Original Language:</strong> {movie.original_language}
                </p>
                {movie.genres && movie.genres.length > 0 ? (
                  <p>
                    <strong>Genres:</strong> {movie.genres.map(g => g.name).join(", ")}
                  </p>
                ) : movie.genre_ids && movie.genre_ids.length > 0 ? (
                  <p>
                    <strong>Genres:</strong> {movie.genre_ids.map(id => GENRE_MAP[id] || id).join(", ")}
                  </p>
                ) : null}
                {watchSource[movie.id] && watchSource[movie.id].length > 0 && (
                  <p>
                    <strong>Available on:</strong>{" "}
                    {watchSource[movie.id].map((provider, index) => (
                      <span key={index}>
                        {index > 0 && ", "}
                        <a href={provider.url} className="repo-link" target="_blank" rel="noopener noreferrer">
                          {provider.name}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
        {recommended.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(193, 187, 236, 0.582)" }}>
            No recommendations available. Add movies to your lists to get recommendations!
          </p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;