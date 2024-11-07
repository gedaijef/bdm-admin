import React from 'react'
import style from './Home.module.css'
import { Link } from "react-router-dom";
import Introducao from "../Introducao/Introducao"

const Home = () => {
  return (
    <div className={style.container}>
        <div className={style.content}>
        <Introducao color="#000000" titulo="BDM | ADMIN" texto={`
            Bem-vindo à área de administração do BDM.
            Selecione a ação que deseja realizar
            `}/>   
        <button>
            <Link className={style.link} to="/adicionar-usuario">
                Adicionar Usuário
            </Link>
        </button>
        <button>
            <Link className={style.link} to="/listar-usuario">
                Listar Usuários
            </Link>
        </button>
        <button>
            <Link className={style.link} to="/deletar-usuario">
                Deletar Usuário
            </Link>
        </button>
        <button>
            <Link className={style.link} to="/noticias">
                Notícias
            </Link>
        </button>
        </div>
    </div>
  )
}

export default Home