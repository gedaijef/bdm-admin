import React from "react";
import { Link } from "react-router-dom";
import style from "./Menu.module.css";

const Menu = () => {
  return (
    <div className={style.menu}>
      <div className={style.itemMenu}>
      <Link className={style.link} to="/">
            HOME
      </Link>
      </div>
      <div className={style.dropdown}>
        <span className={style.option}>USUÁRIOS</span>
        <div className={style.dropdownContent}>
          <Link className={style.dropdownItem} to="/adicionar-usuario">
            Adicionar Usuário
          </Link>
          <Link className={style.dropdownItem} to="/deletar-usuario">
            Deletar Usuário
          </Link>
        </div>
      </div>
      <div className={style.itemMenu}>
      <Link className={style.link}  to="/noticias">
            NOTÍCIAS
      </Link>
      </div>
    </div>
  );
};

export default Menu;
