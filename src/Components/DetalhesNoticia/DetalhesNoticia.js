import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listSpecificNews } from "../../Utils/scriptConexao";
import style from "./DetalhesNoticia.module.css";
import ReactMarkdown from "react-markdown";

const DetalhesNoticia = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  function formatString(noticia) {

    let noticiaFormatada = noticia;

    noticiaFormatada = noticiaFormatada.replace(/\*(.*?)\*/g, "**$1**\n\n");

    noticiaFormatada = noticiaFormatada.replace(/^\+\+(.*)$/gm, "$1\n\n");

    noticiaFormatada = noticiaFormatada.replace(/^▪(.*)$/gm, "$1\n\n");

    noticiaFormatada = noticiaFormatada.replace(/_(.*?)_/g, "*$1*");
    
    return noticiaFormatada;
  }

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null);

    listSpecificNews(id)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setNoticia(data);
      })
      .catch((error) => {
        console.error("Erro ao carregar notícia:", error);
        setErrorMessage("Erro ao carregar a notícia. Tente novamente.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <p>Carregando...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;
  if (!noticia) return <p>Nenhuma notícia encontrada.</p>;

  let distributedFormatado = noticia.distributed;
  if (noticia.distributed == null) {
    distributedFormatado = 0;
  }

  let contentFormatado = formatString(noticia.content);

  let [ano, mes, dia] = noticia.date.split("T")[0].split("-");
  const data = `${dia}/${mes}/${ano}`;

  return (
    <div className={style.detailContainer}>
      <div className={style.contentContainer}>
        <h3 className={style.content}>
          <ReactMarkdown className={style.content}>
            {formatString(noticia.content)}
          </ReactMarkdown>
        </h3>
      </div>
      <div className={style.cards}>
        <div className={style.card}>
          <div className={style.conteudoResultado}>
            <h5 className={style.legendaResultado}>Vezes enviada:</h5>
            <h3 className={style.info}>{distributedFormatado}</h3>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.conteudoResultado}>
            <h5 className={style.legendaResultado}>Escrita em:</h5>
            <h3 className={style.info}>{data}</h3>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.conteudoResultado}>
            <h5 className={style.legendaResultado}>Escrita às:</h5>
            <h3 className={style.info}>{noticia.time}</h3>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.conteudoResultado}>
            <h5 className={style.legendaResultado}>Categorias:</h5>
            <div className={style.overflow}>
              <h3 className={style.info}>{noticia.categories}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesNoticia;
