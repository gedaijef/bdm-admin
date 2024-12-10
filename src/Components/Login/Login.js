import React, { useState, useEffect } from "react";
import style from "./Login.module.css";
import { login } from "../../Utils/scriptConexao";
import TextField from "@mui/material/TextField";

const LoginOverlay = () => {
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    
    const userLoggedIn = localStorage.getItem("userLoggedIn");
    if (userLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await login(password);
      const result = await response.json();

      if (response.status === 202) {
        setIsLoggedIn(true);
        localStorage.setItem("userLoggedIn", "true"); // Armazena o estado de login no localStorage
      } else {
        setResponseMessage(result.error || result.message);
      }
    } catch (error) {
      setResponseMessage("Ocorreu um erro. Tente novamente.");
    }
  };

  if (isLoggedIn) {
    return null; // Oculta o componente de login se o usuário estiver logado
  }

  return (
    <div id="loginOverlay" className={style.loginOverlay}>
      <div className={style.loginContainer}>
        <div className={style.login}>
          <div>
            <h2 className={style.titulo}>Senha</h2>
            <p className={style.legenda}>
              Insira a senha para logar dentro do BDM - ADMIN
            </p>
          </div>
          <form className={style.form} onSubmit={handleLogin}>
            <TextField
              placeholder="Senha"
              variant="outlined"
              className={style.inputs}
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
            />
            <button type="submit" className={style.button}>
              Entrar
            </button>
          </form>
        </div>
        {responseMessage && <p className={style.error}>{responseMessage}</p>}
      </div>
    </div>
  );
};

export default LoginOverlay;
