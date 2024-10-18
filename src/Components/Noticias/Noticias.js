import React from 'react'
import style from './Noticias.module.css'
import Introducao from '../Intruducao/Introducao'
import Filtros from '../Filtros/Filtros'

const Noticias = ({mensagem,hora,data,enviada,imagem}) => {
  return (
    <div className={style.container}>
      <Introducao color="#000000" titulo="Notícias" texto={`
            Veja todas as notícias do BDM
            `}/>   
      <Filtros/>
      <div className={style.noticia}>
        <img src={imagem} alt="imagem da notícia" />
        <div className={style.content}>
          <h3>{mensagem}</h3>
          <p>Data: {data}</p>
          <p>Horário: {hora}</p>
          <p>{enviada}</p>
        </div>
      </div>
    </div>
  )
}

export default Noticias