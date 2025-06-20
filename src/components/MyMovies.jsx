import axios from "axios";
import { useEffect, useState } from "react";
import "./MyMovies.css";
import { buscarFilmesDaLista } from "../utils/api";

export default function MyMovies({ onToggleDetails, expandedMovieId, isAuthenticated }) {
  const [wantToWatch, setWantToWatch] = useState([]);
  const [watched, setWatched] = useState([]);
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
  const TMDB_URL = "https://api.themoviedb.org/3";
  const [watchSource, setWatchSource] = useState({});

  const fetchWhereToWatch = async (tmdbId) => {
    try {
      const url = `https://api.watchmode.com/v1/title/movie-${tmdbId}/details/?apiKey=${WATCHMODE_API_KEY}&append_to_response=sources`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.sources || data.sources.length === 0) {
        console.error(`Nenhum source encontrado para o ID: ${tmdbId}`);
        return [];
      }

      const providers = [];
      const seenNames = new Set();

      for (const s of data.sources) {
        if (!seenNames.has(s.name)) {
          providers.push({
            name: s.name,
            url: s.web_url,
          });
          seenNames.add(s.name);
        }
      }

      return providers;
    } catch (err) {
      console.error(`Erro ao buscar provedores para o ID: ${tmdbId}`, err);
      return [];
    }
  };

  const toggleMovieDetails = async (movieId) => {
    if (expandedMovieId !== movieId && !watchSource[movieId]) {
      const providers = await fetchWhereToWatch(movieId);
      setWatchSource((prev) => ({
        ...prev,
        [movieId]: providers,
      }));
    }
    onToggleDetails(expandedMovieId === movieId ? null : movieId);
  };

  const fetchMovieDetails = async (ids) => {
    try {
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
    } catch (err) {
      console.error("Erro ao buscar detalhes dos filmes:", err);
      return [];
    }
  };

  const fetchLists = async () => {
    try {
      const [wantRes, watchedRes] = await Promise.all([
        buscarFilmesDaLista("wantToWatch"),
        buscarFilmesDaLista("watched"),
      ]);
      const wantIds = wantRes.map((item) => item.movieId);
      const watchedIds = watchedRes.map((item) => item.movieId);

      const [wantDetails, watchedDetails] = await Promise.all([
        fetchMovieDetails(wantIds),
        fetchMovieDetails(watchedIds),
      ]);

      setWantToWatch(wantDetails);
      setWatched(watchedDetails);
    } catch (err) {
      console.error("Erro ao buscar listas de filmes:", err);
      setWantToWatch([]);
      setWatched([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchLists();
  }, [isAuthenticated]);

  const handleDelete = async (movieId, listType) => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`${import.meta.env.VITE_API_URL}user-movie-list`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId, listType }),
      });
      fetchLists();
    } catch (err) {
      alert("Erro ao remover filme da lista!");
    }
  };

  const handleMoveToWatched = async (movieId) => {
    try {
      const token = localStorage.getItem("authToken");

      await fetch(`${import.meta.env.VITE_API_URL}user-movie-list`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId, listType: "wantToWatch" }),
      });

      await fetch(`${import.meta.env.VITE_API_URL}user-movie-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId, listType: "watched" }),
      });

      fetchLists();
    } catch (err) {
      alert("Erro ao mover filme para Watched!");
    }
  };

  const renderMovie = (movie, listType) => {
    return (
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
            {watchSource[movie.id] && (
              <p>
                <strong>Available on:</strong>{" "}
                {watchSource[movie.id].map((provider, index) => (
                  <span key={index}>
                    {index > 0 && ", "}
                    <a href={provider.url} target="_blank" rel="noopener noreferrer">
                      {provider.name}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}
        {listType === "wantToWatch" ? (
          <>
            <button
              className="btn watched-btn"
              onClick={() => handleMoveToWatched(movie.id)}
            >
              Mark as Watched
            </button>
            <button
              onClick={() => handleDelete(movie.id, "wantToWatch")}
              className="delete-button"
            >
              Remove
            </button>
          </>
        ) : (
          <button
            onClick={() => handleDelete(movie.id, "watched")}
            className="delete-button"
          >
            Remove
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="my-movies-page">
      <h2>Want to Watch</h2>
      <div className="movies">{wantToWatch.map((movie) => renderMovie(movie, "wantToWatch"))}</div>
      <h2>Watched</h2>
      <div className="movies">{watched.map((movie) => renderMovie(movie, "watched"))}</div>
    </div>
  );
}
