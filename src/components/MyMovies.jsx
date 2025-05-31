import axios from "axios";
import { useEffect, useState } from "react";
import "./MyMovies.css";

export default function MyMovies({ onToggleDetails, expandedMovieId, isAuthenticated }) {
  const [wantToWatch, setWantToWatch] = useState([]);
  const [watched, setWatched] = useState([]);

  const fetchLists = async () => {
    try {
      const [wantRes, watchedRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}user-movie-list/wantToWatch`),
        axios.get(`${import.meta.env.VITE_API_URL}user-movie-list/watched`)
      ]);
      setWantToWatch(wantRes.data);
      setWatched(watchedRes.data);
    } catch (err) {
      setWantToWatch([]);
      setWatched([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchLists();
  }, [isAuthenticated]);

  const handleDelete = async (movieId, listType) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}user-movie-list/${movieId}/${listType}`);
      fetchLists(); // Atualiza as listas após deletar
    } catch (err) {
      alert("Erro ao remover filme da lista!");
    }
  };

  const renderMovie = (movie, listType) => (
    <div key={movie.id} className="movie">
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
        />
      )}
      <h3>{movie.title}</h3>
      <p>{movie.release_date}</p>
      <p>Rating: {movie.vote_average} / 10</p>
      <button
        onClick={() => onToggleDetails(movie.id)}
        className="details-button"
      >
        {expandedMovieId === movie.id ? "Hide Details" : "View Details"}
      </button>
      <button
        onClick={() => handleDelete(movie.id, listType)}
        className="delete-button"
        style={{ marginTop: "8px", background: "#e53935", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer" }}
      >
        Remover
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
        </div>
      )}
    </div>
  );

  return (
    <div className="my-movies-page">
      <h2>Want to Watch</h2>
      <div className="movies">{wantToWatch.map(movie => renderMovie(movie, "wantToWatch"))}</div>
      <h2>Watched</h2>
      <div className="movies">{watched.map(movie => renderMovie(movie, "watched"))}</div>
    </div>
  );
}