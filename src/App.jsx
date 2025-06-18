import { useState, useEffect } from "react";
import FormSearch from "./components/FormSearch";
import TrendingType from "./components/TrendingType";
import Sorting from "./components/Sorting";
import "./App.css";
import Navigation from "./components/Navigation";
import About from "./components/About";
import Team from "./components/Team";
import Login from "./components/Login";
import Register from "./components/Register";
import UserStatus from "./components/UserStatus";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import AddToListButton from "./components/AddToListButton";
import MyMovies from "./components/MyMovies";

function Home({
  TMDB_API_KEY,
  WATCHMODE_API_KEY,
  TMDB_URL,
  isAuthenticated,
  wantToWatch,
  setWantToWatch,
  watched,
  setWatched,
  expandedMovieId,
  setExpandedMovieId,
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(""); // Para guardar a consulta de busca do usuário
  const [movies, setMovies] = useState([]); // Filmes retornados pela busca
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento

  const [trendingDay, setTrendingDay] = useState([]); // Filmes em alta do dia
  const [trendingWeek, setTrendingWeek] = useState([]); // Filmes em alta da semana

  const [sortOption, setSortOption] = useState("popularity"); // Opção para ordenar os filmes

  const [watchSource, setWatchSource] = useState({}); //para guardar os sources dos filmes

  useEffect(() => {
    const fetchTrendingMoviesDay = async () => {
      const response = await fetch(`${TMDB_URL}/trending/movie/day`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      });
      const data = await response.json();
      setTrendingDay(data.results.slice(0, 4));
    };

    fetchTrendingMoviesDay();
  }, [TMDB_API_KEY, TMDB_URL]);

  useEffect(() => {
    const fetchTrendingMoviesWeek = async () => {
      const response = await fetch(`${TMDB_URL}/trending/movie/week`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      });
      const data = await response.json();
      setTrendingWeek(data.results.slice(0, 4)); 
    };

    fetchTrendingMoviesWeek();
  }, [TMDB_API_KEY, TMDB_URL]);

  const searchMovies = async () => {
    setLoading(true);
    const response = await fetch(
      `${TMDB_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      }
    );
    const moviesData = await response.json();
    setMovies(moviesData.results);
    setLoading(false);
    setExpandedMovieId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchMovies();
  };

  const sortMovies = (movies) => {
    return [...movies].sort((a, b) => {
      switch (sortOption) {
        case "popularity":
          return b.popularity - a.popularity;
        case "release_asc":
          return new Date(a.release_date) - new Date(b.release_date);
        case "release_desc":
          return new Date(b.release_date) - new Date(a.release_date);
        case "rating":
          return b.vote_average - a.vote_average;
        default:
          return 0;
      }
    });
  };

  //  função para perguntar a API WatchMode (onde assistir) usando o id do tmdb
  const fetchWhereToWatch = async (tmdbId) => {
    const response = await fetch(
      `https://api.watchmode.com/v1/title/movie-${tmdbId}/details/?apiKey=${WATCHMODE_API_KEY}&append_to_response=sources`
    );
    const data = await response.json();
    const sources = data.sources || [];   //  se sources n existe, agrega uma lista vazia

    const providers = [];      //  providers será a lista com os nomes unicos
    const seenNames = new Set();    //  usando um set pois tem a função Has que é mais rápida para muitos dados
    for (const s of sources) {      //  percorre por todos os sources retornados pela watchmode
      if (!seenNames.has(s.name)) { //  se o nome ele nao existe no Set que criamos, nos adicionamos ao array providers
        providers.push({       //  adicionando ao providers o nome e o url
          name: s.name,
          url: s.web_url,
        });
        //  adicionando também ao Set o nome que temos, para evitar que haja duplicatas
        seenNames.add(s.name);
      }
      //  a lógica do Set foi feita pq o watchmode estava retornando muitos links duplicados, estava imprimindo muitos links no view more
    }

    return providers;
  };
  //  função para mudar o estado de view do filme
    const toggleMovieDetails = async (movieId) => {

    //função para fazer as buscas unicas dos filmes, e não gastar a quota da api
    if (expandedMovieId !== movieId && !watchSource[movieId]) {
      const providers = await fetchWhereToWatch(movieId);
      setWatchSource((prev) => ({
        ...prev,
        [movieId]: providers,
      }));
    }
    //  aqui onde o filme aparece ou desaparece, operador ternário que executa null
    //  se o id do filme clicado for igual ao do filme expandido
    //  e abre outro filme se o id do filme clicado for diferente do filme expandido
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  return (
    <div className="app">
      <div className="form-container">
        <FormSearch
          query={query}
          setQuery={setQuery}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>

      {movies.length > 0 && (
        <Sorting sortOption={sortOption} setSortOption={setSortOption} />
      )}

      {movies.length === 0 && (
        <>
          <h2>🔥 Trending Today 🔥</h2>
          <div className="movies">
            {trendingDay.map((movie) => (
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
            ))}
          </div>

          <h2>🔥 Trending This Week 🔥</h2>
          <div className="movies">
            {trendingWeek.map((movie) => (
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
            ))}
          </div>
        </>
      )}

      <div className="movies">
        {sortMovies(movies)
          .slice(0, 5)
          .map((movie) => (
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

              <AddToListButton
                movieId={movie.id}
                wantToWatch={wantToWatch}
                setWantToWatch={setWantToWatch}
                watched={watched}
                setWatched={setWatched}
                isAuthenticated={isAuthenticated}
                navigate={navigate}
              />
              <button
                onClick={() => toggleMovieDetails(movie.id)}
                className="details-button"
              >
                {/*Basicamente o label do botão, caso o id clicado seja igual um id do filme
                 mostra um hide details, e caso contrario, mostra um view details*/}
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
                    <strong>Original Language:</strong>{" "}
                    {movie.original_language}
                  </p>
                  {/* Parte dentro do view que contém as informações de onde assistir*/}
                  {watchSource[movie.id] && (
                    <p>
                      <strong>Available on:</strong>{" "}
                      {watchSource[movie.id].map((provider, index) => (
                        <span key={index}>
                          {index > 0 && ", "}
                          <a href={provider.url} className="repo-link">
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
      </div>
    </div>
  );
}

function App() {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
  const TMDB_URL = "https://api.themoviedb.org/3";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [wantToWatch, setWantToWatch] = useState([]);
  const [watched, setWatched] = useState([]);
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  return (
    <Router>
      <div className="app">
        <h1>Movie Search 🔎</h1>
        {isAuthenticated && <Navigation />}
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route
                path="/login"
                element={
                  <Login
                    setIsAuthenticated={setIsAuthenticated}
                    setUserName={setUserName}
                  />
                }
              />
              <Route
                path="/register"
                element={
                  <Register
                    setIsAuthenticated={setIsAuthenticated}
                    setUserName={setUserName}
                  />
                }
              />
              {/* Redireciona qualquer outra rota (inclusive /) para /login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  <Home
                    TMDB_API_KEY={TMDB_API_KEY}
                    WATCHMODE_API_KEY={WATCHMODE_API_KEY}
                    TMDB_URL={TMDB_URL}
                    isAuthenticated={isAuthenticated}
                    wantToWatch={wantToWatch}
                    setWantToWatch={setWantToWatch}
                    watched={watched}
                    setWatched={setWatched}
                    expandedMovieId={expandedMovieId}
                    setExpandedMovieId={setExpandedMovieId}
                  />
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route
                path="/mymovies"
                element={
                  <MyMovies
                    wantToWatch={wantToWatch}
                    watched={watched}
                    onToggleDetails={setExpandedMovieId}
                    expandedMovieId={expandedMovieId}
                    isAuthenticated={isAuthenticated}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
        <UserStatus
          isAuthenticated={isAuthenticated}
          userName={userName}
          setIsAuthenticated={setIsAuthenticated}
          setUserName={setUserName}
        />
      </div>
    </Router>
  );
}

export default App;