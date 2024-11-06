import React from 'react';
import style from './Introducao.module.css';

const Introducao = ({ titulo, texto, color }) => {
  const textColor = color ? { color: color } : {};

  return (
    <div className={style.container}>
      <div className={style.content} style={textColor}>
        <h2 className={style.titulo}>
          {titulo}
        </h2>
        <p classnName={style.texto}>
          {texto}
        </p>
      </div>
    </div>
  );
};

export default Introducao;