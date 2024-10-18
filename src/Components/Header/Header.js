import React from "react";
import style from "./Header.module.css";

const Header = () => {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <img
          className={style.img}
          src="https://www.bomdiamercado.com.br/wp-content/themes/bomdiamercado.com.br/assets/images/logo-bdm+picpay-black.svg"
        ></img>
        <h1>| ADMIN</h1>
      </div>
    </div>
  );
};

export default Header;