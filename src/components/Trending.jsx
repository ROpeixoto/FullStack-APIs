import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Trending({
  TMDB_API_KEY,
  TMDB_URL,
  wantToWatch,
  setWantToWatch,
  watched,
  setWatched,
  isAuthenticated,
}) {
  const navigate = useNavigate();
  const [trendingDay, setTrendingDay] = useState([]);
  const [trendingWeek, setTrendingWeek] = useState([]);

  useEffect(() => {
    const fetchTrendingMovies = async (type) => {
      try {
        const response = await fetch(`${TMDB_URL}/trending/movie/${type}`, {
          headers: {
            Authorization: `Bearer ${TMDB_API_KEY}`,
            accept: "application/json",
          },
        });
        const data = await response.json();
        return data.results.slice(0, 4);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
      }
    };

    fetchTrendingMovies("day").then(setTrendingDay);
    fetchTrendingMovies("week").then(setTrendingWeek);
  }, [TMDB_API_KEY, TMDB_URL]);

  return (
    <div> 
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
            <p>Audience score: {movie.vote_average?.toFixed(1)} / 10</p>
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
            <p>Audience score: {movie.vote_average?.toFixed(1)} / 10</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trending;
