import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export default function Register({ setIsAuthenticated, setUserName }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}users/register`,
        { name, email, password }
      );
      setIsAuthenticated(true);
      setUserName(name); // já tem o nome aqui
      navigate("/");
    } catch (error) {
      alert("Erro ao cadastrar: " + (error.response?.data?.message || error.message));
    }
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