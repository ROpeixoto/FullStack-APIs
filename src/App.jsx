import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; //trazendo a chave que esta no arquivo .env
  const BASE_URL = "https://api.themoviedb.org/3"; // URL base da API

  const [query, setQuery] = useState(""); // para guardar a consulta de busca do usuário
  const [movies, setMovies] = useState([]); // filmes retornados pela busca
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento
  const [expandedMovieId, setExpandedMovieId] = useState(null); // ID do filme expandido (detalhes visíveis)

  const [trendingDay, setTrendingDay] = useState([]); // Armazena os filmes em alta (trending)
  const [trendingWeek, setTrendingWeek] = useState([]); // Armazena os filmes em alta (trending)

  // Hook para buscar os filmes em alta assim que o componente for montado (pagina carregar)
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const dayResponse = await fetch(`${BASE_URL}/trending/movie/day`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      });
      const dayData = await dayResponse.json();
      setTrendingDay(dayData.results.slice(0, 20)); // pega os top 20 trending DO DIA
    };
    


    fetchTrendingMovies(); // Chama a função ao montar o componente
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
    const data = await response.json(); // Converte a resposta em JSON
    setMovies(data.results); // Atualiza os filmes buscados
    setLoading(false); // Finaliza o carregamento
    setExpandedMovieId(null); // Reseta o view expandido (detalhes)
  };

  // Função executada ao enviar o formulário de busca(clicar no botao)
  const handleSubmit = (e) => {
    e.preventDefault();
    searchMovies();
  };
  // Alterna exibição de detalhes do filme (mostrar/ocultar) no botao de view
  const toggleMovieDetails = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };
//testando
  return (
    <div className="app">
      <h1>TMDB Movie Search 🔎</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit} className = "form">
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

      {/* Se ainda não houve uma busca (lista de filmes está vazia), mostra os trending */}
      {movies.length === 0 && (
        <>

          <h2>🔥 Trending Today 🔥</h2>
          <div className="trending">
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
              </div>
            ))}
          </div>
          </div>



        </>
      )}
            {/* Se houver filmes buscados, exibe os 3 primeiros */}
      <div className="movies">
        {movies.slice(0, 30).map((movie) => (
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
                <p>
                  <strong>Vote Count:</strong> {movie.vote_count}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
