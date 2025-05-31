import axios from "axios";
import { useState } from "react";

export default function AddToListButton({ isAuthenticated, navigate, movie, refreshLists }) {
  const [showOptions, setShowOptions] = useState(false);

  const handleAddClick = () => setShowOptions((prev) => !prev);

  const handleSignIn = () => navigate("/login");

  const handleAddToList = async (listType) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}user-movie-list`,
        { movieId: movie.id, listType }
      );
      setShowOptions(false);
      if (refreshLists) refreshLists(); // Atualiza listas no MyMovies
    } catch (err) {
      alert("Erro ao adicionar filme à lista!");
    }
  };

  return (
    <div style={{ margin: "8px 0" }}>
      <button className="add-list-btn" onClick={handleAddClick}>
        Add to list
      </button>
      {showOptions && (
        isAuthenticated ? (
          <div className="add-list-options">
            <button className="add-list-option" onClick={() => handleAddToList("wantToWatch")}>
              Want to watch
            </button>
            <button className="add-list-option" onClick={() => handleAddToList("watched")}>
              Watched
            </button>
          </div>
        ) : (
          <div>
            <span
              style={{ textDecoration: "underline", color: "#6200ee", cursor: "pointer" }}
              onClick={handleSignIn}
            >
              Sign In to continue
            </span>
          </div>
        )
      )}
    </div>
  );
}