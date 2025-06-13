import axios from "axios";
import { useEffect, useState } from "react";
import "./MyMovies.css";
import { buscarFilmesDaLista } from "../utils/api";

export default function MyMovies({ onToggleDetails, expandedMovieId, isAuthenticated }) {
  const [wantToWatch, setWantToWatch] = useState([]);
  const [watched, setWatched] = useState([]);
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const TMDB_URL = "https://api.themoviedb.org/3";

  // Função para buscar detalhes de vários filmes pelo ID
  const fetchMovieDetails = async (ids) => {
    const promises = ids.map(async (id) => {
      const res = await fetch(`${TMDB_URL}/movie/${id}`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      });
      return res.json();
    });
    return Promise.all(promises);
  };

  const fetchLists = async () => {
    try {
      const [wantRes, watchedRes] = await Promise.all([
        buscarFilmesDaLista("wantToWatch"),
        buscarFilmesDaLista("watched")
      ]);
      // Supondo que wantRes e watchedRes são arrays de objetos com { movieId }
      const wantIds = wantRes.map(item => item.movieId);
      const watchedIds = watchedRes.map(item => item.movieId);

      const [wantDetails, watchedDetails] = await Promise.all([
        fetchMovieDetails(wantIds),
        fetchMovieDetails(watchedIds)
      ]);
      setWantToWatch(wantDetails);
      setWatched(watchedDetails);
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
      const token = localStorage.getItem('authToken');
      await fetch(`${import.meta.env.VITE_API_URL}user-movie-list`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId, listType })
      });
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