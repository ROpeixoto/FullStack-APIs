import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export default function Login({ setIsAuthenticated, setUserName }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}users/login`,
        { email, password }
      );
      // --- INÍCIO DA ALTERAÇÃO ---
      // Armazena o token no localStorage para uso futuro
      localStorage.setItem('authToken', response.data.token);
      // --- FIM DA ALTERAÇÃO ---

      setIsAuthenticated(true);
      setUserName(response.data.user.name); // Mantém a atualização do nome do usuário
      navigate("/");
    } catch (error) {
      // Limpa o token em caso de erro de login, caso exista algum antigo
      localStorage.removeItem('authToken');
      alert("Login inválido: " + (error.response?.data?.message || error.message));
    }
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
            onClick={() => {
              // Limpa o token se o usuário decidir continuar sem conta
              localStorage.removeItem('authToken'); 
              setIsAuthenticated(false);   
              setUserName("");            
              navigate("/");              
            }}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            go on without an account
          </span>
        </div>
      </form>
    </div>
  );
}

