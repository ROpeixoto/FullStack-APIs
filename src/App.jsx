import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; //trazendo a chave que esta no arquivo .env
  const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3"; // URL base da API

  const [query, setQuery] = useState(""); // para guardar a consulta de busca do usuário
  const [movies, setMovies] = useState([]); // filmes retornados pela busca
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento
  const [expandedMovieId, setExpandedMovieId] = useState(null); // ID do filme expandido (detalhes visíveis)

  const [trendingDay, setTrendingDay] = useState([]); // Armazena os filmes em alta DIA (trending)
  const [trendingWeek, setTrendingWeek] = useState([]); // Armazena os filmes em alta SEMANA (trending)

  const [sortOption, setSortOption] = useState("popularity"); //opção que o usuário escolhe do Order By, já setado em popularidade(Filmes mais famosos)

  const [watchProviders, setWatchProviders] = useState({});

  // Hook para buscar os filmes em alta assim que o componente for montado (pagina carregar)
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
    const moviesData = await response.json(); // Converte a resposta em JSON
    setMovies(moviesData.results); // Atualiza os filmes buscados
    setLoading(false); // Finaliza o carregamento
    setExpandedMovieId(null); // Reseta o view expandido (detalhes)
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
  const fetchWhereToWatch = async (tmdbId) => {
    //try para verificar se existe algum erro

      const response = await fetch(
        `https://api.watchmode.com/v1/title/movie-${tmdbId}/details/?apiKey=${WATCHMODE_API_KEY}&append_to_response=sources`
      );
      const data = await response.json();

      const sources = data.sources;

      const providers = sources.map((s) => ({
        name: s.name,
        url: s.web_url,
      }));

      return providers;

  };


  const toggleMovieDetails = async (movieId) => {
    if (expandedMovieId !== movieId && !watchProviders[movieId]) {
      const providers = await fetchWhereToWatch(movieId);
      setWatchProviders((prev) => ({
        ...prev,
        [movieId]: providers,
      }));
    }

    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  return (
    <div className="app">
      <h1>Movie Search 🔎</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies..."
            className="search-place"
          />
          <button type="submit" disabled={loading} className="search-button">
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
      {/* Input para colocar a ordem que o usuário deseja para os filmes */}
      {movies.length > 0 && (
        <div className="sort-container">
          <label>Order by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="release_desc">Newest</option>
            <option value="release_asc">Oldest</option>
          </select>
        </div>
      )}

      {/* Se ainda não houve uma busca (lista de filmes está vazia), mostra os trending da semana e do dia */}
      {movies.length === 0 && (
        <>
          <h2>🔥 Trending Today 🔥</h2>
          <div className="trending">
            <div className="movies-trending">
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
                </div>
              ))}
            </div>
          </div>
          <h2>🔥 Trending This Week 🔥</h2>
          <div className="trending">
            <div className="movies-trending">
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
                </div>
              ))}
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
                  {watchProviders[movie.id] && (
                    <p>
                      <strong>Available on:</strong>{" "}
                      {watchProviders[movie.id].map((provider, index) => (
                        <span key={index}>
                          {", "}
                          <a
                            href={provider.url}
                          >
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

export default App;
