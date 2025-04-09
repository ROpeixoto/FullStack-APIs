const Sorting = ({ 
    sortOption,
    setSortOption 
}) => {
    return (
      <div className="sort-container">
        <label>Order by:</label>
        <select
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
    );
  };
  
  export default Sorting;