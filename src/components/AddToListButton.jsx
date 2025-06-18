

import React, { useState } from "react";
import "./AddToListButton.css";

function AddToListButtons({ 
  movieId, 
  wantToWatch, setWantToWatch, 
  watched, setWatched, 
  isAuthenticated, 
  navigate 
}) {
  const [loadingWant, setLoadingWant] = useState(false);
  const [loadingWatched, setLoadingWatched] = useState(false);

  const token = localStorage.getItem("authToken");

  const isInWantToWatch = wantToWatch.includes(movieId);
  const isInWatched = watched.includes(movieId);

  if (!token && isAuthenticated) {
    // Token faltando, forçar logout?
    navigate("/login");
    return null;
  }

  const updateList = async (listType) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!movieId) {
      alert("Informação do filme inválida.");
      return;
    }
    if (!token) {
      alert("Você precisa estar logado para adicionar filmes à lista.");
      navigate("/login");
      return;
    }

    if (listType === "wantToWatch") setLoadingWant(true);
    else if (listType === "watched") setLoadingWatched(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}user-movie-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId,
          listType,
        }),
      });

      if (response.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao atualizar a lista.");
      }

      // Atualizar estados locais conforme o botão clicado
      if (listType === "wantToWatch") {
        // Adiciona na wantToWatch e remove de watched (caso estivesse)
        if (!isInWantToWatch) setWantToWatch([...wantToWatch, movieId]);
        if (isInWatched) setWatched(watched.filter(id => id !== movieId));
      } else if (listType === "watched") {
        // Adiciona na watched e remove de wantToWatch (caso estivesse)
        if (!isInWatched) setWatched([...watched, movieId]);
        if (isInWantToWatch) setWantToWatch(wantToWatch.filter(id => id !== movieId));
      }
      
    } catch (error) {
      alert("Erro: " + error.message);
    } finally {
      if (listType === "wantToWatch") setLoadingWant(false);
      else if (listType === "watched") setLoadingWatched(false);
    }
  };

  return (
    <div className="add-to-list-buttons">
      <button
        className={`btn want-to-watch-btn ${isInWantToWatch ? "in-list" : ""}`}
        onClick={() => updateList("wantToWatch")}
        disabled={loadingWant}
      >
        {loadingWant ? "adding..." : isInWantToWatch ? "✔ Want to Watch" : "+ Want to Watch"}
      </button>

      <button
        className={`btn watched-btn ${isInWatched ? "in-list" : ""}`}
        onClick={() => updateList("watched")}
        disabled={loadingWatched}
      >
        {loadingWatched ? "adding..." : isInWatched ? "✔ Watched" : "+ Watched"}
      </button>
    </div>
  );
}

export default AddToListButtons;
