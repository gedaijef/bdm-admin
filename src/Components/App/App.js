import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "../Header/Header";
import Menu from "../Menu/Menu";
import UserManager from "../UserManager/UserManager";
import Noticias from "../Noticias/Noticias"
import Home from "../Home/Home"
import DeleteUser from "../DeleteUser/DeleteUser";
import TradingView from "../TradingView/TradingView";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Menu />
        <Routes>
          <Route path="/adicionar-usuario" element={<UserManager />} />
          <Route path="/deletar-usuario" element={<DeleteUser />} />
          <Route path="/" element={<Home/>} />
          <Route path="/noticias" element={<Noticias/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
