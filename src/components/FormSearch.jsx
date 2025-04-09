const FormSearch = ({ 
    query,
    setQuery,
    handleSubmit,
    loading
 }) => {
    return (
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
    );
  };
  
  export default FormSearch;