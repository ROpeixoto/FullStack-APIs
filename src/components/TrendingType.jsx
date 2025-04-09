const TrendingType = ({ title, movies }) => {
  return (
    <>
      <h2>{title}</h2>
      <div className="trending">
        <div className="movies-trending">
          {movies.map((movie) => (
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
  );
};

export default TrendingType;