import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register({ setIsAuthenticated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar lógica de cadastro real se quiser
    setIsAuthenticated(true);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Create Account</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="submit">Register</button>
        <div className="auth-links">
          <span
            className="auth-link"
            onClick={() => navigate("/")}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Back to login
          </span>
        </div>
      </form>
    </div>
  );
}