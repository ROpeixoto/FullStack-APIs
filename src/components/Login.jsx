import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar autenticação real se quiser
    setIsAuthenticated(true);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <div className="auth-links">
          <span
            className="auth-link"
            onClick={() => navigate("/register")}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Create account
          </span>
          {" or "}
          <span
            className="auth-link"
            onClick={() => setIsAuthenticated(true)}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            go on without an account
          </span>
        </div>
      </form>
    </div>
  );
}