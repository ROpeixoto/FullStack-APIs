import { useState, useEffect } from "react";
import FormSearch from "./components/FormSearch";
import TrendingType from "./components/TrendingType";
import Sorting from "./components/Sorting";
import "./App.css";
import Navigation from "./components/Navigation";
import About from "./components/About";
import Team from "./components/Team";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home({ TMDB_API_KEY, WATCHMODE_API_KEY, BASE_URL }) {
  const [query, setQuery] = useState(""); // para guardar a consulta de busca do usuário
  const [movies, setMovies] = useState([]); // filmes retornados pela busca
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento
  const [expandedMovieId, setExpandedMovieId] = useState(null); // ID do filme expandido (detalhes visíveis)

  const [trendingDay, setTrendingDay] = useState([]); // Armazena os filmes em alta DIA (trending)
  const [trendingWeek, setTrendingWeek] = useState([]); // Armazena os filmes em alta SEMANA (trending)

  const [sortOption, setSortOption] = useState("popularity"); //opção que o usuário escolhe do Order By, já setado em popularidade(Filmes mais populosos)

  const [watchSource, setWatchSource] = useState({}); //para guardar os sources dos filmes
  // Hook para buscar os filmes em alta assim que o componente for montado (pagina carregar)

  const [dayIndex, setDayIndex] = useState(0);
  const [weekIndex, setWeekIndex] = useState(0);

  const nextDay = () => {
    setDayIndex((prev) => Math.min(prev + 1, trendingDay.length - 5)); // Limita ao máximo possível
  };

  const prevDay = () => {
    setDayIndex((prev) => Math.max(prev - 1, 0)); // Limita ao mínimo
  };

  const nextWeek = () => {
    setWeekIndex((prev) => Math.min(prev + 1, trendingWeek.length - 5)); // Limita ao máximo possível
  };

  const prevWeek = () => {
    setWeekIndex((prev) => Math.max(prev - 1, 0)); // Limita ao mínimo
  };

  useEffect(() => {
    const TrendingMoviesDay = async () => {
      const dayResponse = await fetch(`${BASE_URL}/trending/movie/day`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      });
      const dayData = await dayResponse.json();
      setTrendingDay(dayData.results.slice(0, 10)); // pega os top 10 trending DO DIA
    };

    TrendingMoviesDay(); // Chama a função ao montar o componente
  }, []);

  //Mesma função, porem para puxar os trendings da semanaa
  useEffect(() => {
    const TrendingMoviesWeek = async () => {
      const dayResponse = await fetch(`${BASE_URL}/trending/movie/week`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      });
      const weekData = await dayResponse.json();
      setTrendingWeek(weekData.results.slice(0, 10)); // pega os top 10 trending da SEMANA
    };

    TrendingMoviesWeek(); // Chama a função ao montar o componente
  }, []);

  // Função para buscar filmes com base na consulta que o usuario fizer
  const searchMovies = async () => {
    setLoading(true); // Ativa o estado de carregamento

    // Faz a requisição para a API de busca do Banco de dados tmdb
    const response = await fetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      }
    );
    const moviesData = await response.json(); // converte a resposta em JSON
    setMovies(moviesData.results); // atualiza os filmes buscados
    setLoading(false); // finaliza o carregamento
    setExpandedMovieId(null); // reseta o view expandido (detalhes)
  };

  // Função executada ao enviar o formulário de busca(clicar no botao)
  const handleSubmit = (e) => {
    e.preventDefault();
    searchMovies();
  };
  // // Alterna exibição de detalhes do filme (mostrar/ocultar) no botao de view (Deixa essa assim em espera, para ver se vou usar dnv)
  // const toggleMovieDetails = (movieId) => {
  //   setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  // };

  //função para fazer o sort da lista dos filmes
  const sortMovies = (moviess) => {
    return [...moviess].sort((a, b) => {
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
  //função para perguntar a API WatchMode (onde assistir) usando o id do tmdb
  //função para perguntar a API WatchMode (onde assistir) usando o id do tmdb
  const fetchWhereToWatch = async (tmdbId) => {
    const response = await fetch(
      `https://api.watchmode.com/v1/title/movie-${tmdbId}/details/?apiKey=${WATCHMODE_API_KEY}&append_to_response=sources`
    );
    const data = await response.json();
    //se sources n existe, agrega uma lista vazia
    const sources = data.sources || [];
    //providers será a lista com os nomes unicos
    const providers = [];
    //usando um set pois tem a função Has que é mais rápida para muitos dados
    const seenNames = new Set();
    //percorre por todos os sources retornados pela watchmode
    for (const s of sources) {
      //se o nome ele nao existe no Set que criamos, nos adicionamos ao array providers
      if (!seenNames.has(s.name)) {
        //adicionando ao providers o nome e o url
        providers.push({
          name: s.name,
          url: s.web_url,
        });
        //adicionando também ao Set o nome que temos, para evitar que haja duplicatas
        seenNames.add(s.name);
      }
      //a lógica do Set foi feita pq o watchmode estava retornando muitos links duplicados, estava imprimindo muitos links no view more
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
      {/* Input para colocar a ordem que o usuário deseja para os filmes */}
      {movies.length > 0 && (
        <Sorting sortOption={sortOption} setSortOption={setSortOption} />
      )}

      {/* Se ainda não houve uma busca (lista de filmes está vazia), mostra os trending da semana e do dia */}
      {movies.length === 0 && (
        <>
          <div className="trending-section">
            <h2>🔥 Trending Today 🔥</h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={prevDay}
                disabled={dayIndex === 0}
                style={{
                  color: "white",
                  fontSize: "24px",
                  background: "transparent",
                  border: "none",
                }}
              >
                &larr;
              </button>
              <div
                style={{
                  display: "flex",
                  overflow: "hidden",
                  justifyContent: "center",
                  width: "90%",
                }}
              >
                {trendingDay.slice(dayIndex, dayIndex + 5).map((movie) => (
                  <div
                    key={movie.id}
                    style={{ flex: "0 0 auto", margin: "0 10px" }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      style={{ width: "100%" }}
                    />
                    <h3 style={{ textAlign: "center" }}>{movie.title}</h3>
                  </div>
                ))}
              </div>
              <button
                onClick={nextDay}
                disabled={dayIndex >= trendingDay.length - 5}
                style={{
                  color: "white",
                  fontSize: "24px",
                  background: "transparent",
                  border: "none",
                }}
              >
                &rarr;
              </button>
            </div>
          </div>

          <div className="trending-section">
            <h2>🔥 Trending This Week 🔥</h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={prevWeek}
                disabled={weekIndex === 0}
                style={{
                  color: "white",
                  fontSize: "24px",
                  background: "transparent",
                  border: "none",
                }}
              >
                &larr;
              </button>
              <div
                style={{
                  display: "flex",
                  overflow: "hidden",
                  justifyContent: "center",
                  width: "90%",
                }}
              >
                {trendingWeek.slice(weekIndex, weekIndex + 5).map((movie) => (
                  <div
                    key={movie.id}
                    style={{ flex: "0 0 auto", margin: "0 10px" }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      style={{ width: "100%" }}
                    />
                    <h3 style={{ textAlign: "center" }}>{movie.title}</h3>
                  </div>
                ))}
              </div>
              <button
                onClick={nextWeek}
                disabled={weekIndex >= trendingWeek.length - 5}
                style={{
                  color: "white",
                  fontSize: "24px",
                  background: "transparent",
                  border: "none",
                }}
              >
                &rarr;
              </button>
            </div>
          </div>
        </>
      )}

      {/* Se houver filmes buscados, exibe os 10 primeiros e faz um sort (padrão de popularidade)*/}
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

              {/* Botão Toggle para expandir a visualização do filme*/}
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
                    <strong>Original Language:</strong>{" "}
                    {movie.original_language}
                  </p>
                  <p>
                    <strong>Vote Count:</strong> {movie.vote_count}
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
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; //trazendo a chave do TMDB que esta no arquivo .env
  const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY; // trazendo a chave do watchmode também
  const BASE_URL = "https://api.themoviedb.org/3"; // URL base da API

  return (
    <Router>
      <div className="app">
        <h1>Movie Search 🔎</h1>
        <Navigation />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                TMDB_API_KEY={TMDB_API_KEY}
                WATCHMODE_API_KEY={WATCHMODE_API_KEY}
                BASE_URL={BASE_URL}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
