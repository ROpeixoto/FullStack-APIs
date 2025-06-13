import { useState } from "react";

export default function AddToListButton({ isAuthenticated, navigate, movieId}) {
  const [showOptions, setShowOptions] = useState(false);

  const handleAddClick = () => setShowOptions((prev) => !prev);

  const handleSignIn = () => navigate("/login");

  const handleAddToList = async (listType) => {
    if (!movieId) {
      alert("Informação do filme inválida.");
      return;
    }

    const token = localStorage.getItem('authToken'); 
    if (!token) {
      alert("Você precisa estar logado para adicionar filmes à lista.");
      navigate("/login");
      return;
    }

    console.log("movieId:", movieId, "listType:", listType);

    fetch(`${import.meta.env.VITE_API_URL}user-movie-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        movieId: movieId,
        listType: listType
      })
    })
      .then(res => {
        if (res.status === 401) {
          alert("Sua sessão expirou ou é inválida. Por favor, faça login novamente.");
          localStorage.removeItem('token');
          navigate("/login");
          throw new Error("Unauthorized");
        }
        if (!res.ok) return res.json().then(data => { throw new Error(data.message || "Erro ao adicionar filme à lista."); });
        return res.json();
      })
      
      .catch(err => {
        if (err.message !== "Unauthorized") {
          alert("Erro ao adicionar filme à lista: " + err.message);
        }
      });
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

