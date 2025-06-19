import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import About from "./components/About";
import Team from "./components/Team";
import Login from "./components/Login";
import Register from "./components/Register";
import UserStatus from "./components/UserStatus";
import MyMovies from "./components/MyMovies";
import Home from "./components/Home";
import Trending from "./components/Trending";

function App() {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
  const TMDB_URL = "https://api.themoviedb.org/3";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [wantToWatch, setWantToWatch] = useState([]);
  const [watched, setWatched] = useState([]);
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Movie Search 🔎</h1>
          <div className="header-controls">
            {/* O Navigation fica oculto, pois links agora estão no burger */}
            {/* <Navigation isAuthenticated={isAuthenticated} /> */}
            <UserStatus
              isAuthenticated={isAuthenticated}
              userName={userName}
              setIsAuthenticated={setIsAuthenticated}
              setUserName={setUserName}
            />
          </div>
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  TMDB_API_KEY={TMDB_API_KEY}
                  WATCHMODE_API_KEY={WATCHMODE_API_KEY}
                  TMDB_URL={TMDB_URL}
                  isAuthenticated={isAuthenticated}
                  wantToWatch={wantToWatch}
                  setWantToWatch={setWantToWatch}
                  watched={watched}
                  setWatched={setWatched}
                  expandedMovieId={expandedMovieId}
                  setExpandedMovieId={setExpandedMovieId}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route
              path="/trending"
              element={
                <Trending TMDB_API_KEY={TMDB_API_KEY} TMDB_URL={TMDB_URL} />
              }
            />
            <Route
              path="/login"
              element={
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setUserName={setUserName}
                />
              }
            />
            <Route
              path="/register"
              element={
                <Register
                  setIsAuthenticated={setIsAuthenticated}
                  setUserName={setUserName}
                />
              }
            />
            {isAuthenticated && (
              <Route
                path="/mymovies"
                element={
                  <MyMovies
                    wantToWatch={wantToWatch}
                    watched={watched}
                    onToggleDetails={setExpandedMovieId}
                    expandedMovieId={expandedMovieId}
                    isAuthenticated={isAuthenticated}
                  />
                }
              />
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
