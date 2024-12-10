import React from "react";
import style from "./Header.module.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const redirecionamento = () => {
    navigate("/");
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div onClick={redirecionamento} className={style.option}>
          <img
            className={style.img}
            src="https://www.bomdiamercado.com.br/wp-content/themes/bomdiamercado.com.br/assets/images/logo-bdm+picpay-black.svg"
          ></img>
          <h1>| ADMIN</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
