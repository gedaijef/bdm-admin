import style from "./Noticias.module.css";
import React, { useState, useEffect } from "react";
import { listCategories, listNews, listNewsByCategory, listNewsByDate } from "../../Utils/scriptConexao";
import Select from "react-select";
import Introducao from "../Intruducao/Introducao";

const Noticias = () => {
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [categoria, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numLinhas, setNumLinhas] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dadosPesquisa, setDadosPesquisa] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const focusCategoria = () => {
    listCategories().then((resultado) => {
      setCategorias(
        resultado.map((item) => ({ value: item.id, label: item.name }))
      );
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      focusCategoria();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSelectChange = (selectedOption) => {
    setSelectedCategoria(selectedOption);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const clickSearch = () => {
    // Validação antes de realizar a pesquisa
    if (!selectedCategoria && !selectedDate) {
      setErrorMessage("Por favor, selecione uma categoria ou escolha uma data antes de pesquisar.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const selectedCategoryString = selectedCategoria ? selectedCategoria.value : null;
    const data = selectedDate || null;

    // Escolher o endpoint correto dependendo dos filtros preenchidos
    let fetchFunction;

    if (selectedCategoryString && data) {
      fetchFunction = () => listNews(selectedCategoryString, data);
    } else if (selectedCategoryString) {
      fetchFunction = () => listNewsByCategory(selectedCategoryString);
    } else if (data) {
      // Apenas data selecionada, usar `listNewsByDate`
      fetchFunction = () => listNewsByDate(data);
    }

    // Executa a função de busca correspondente
    fetchFunction()
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          throw new Error(result.error);
        }
        setNumLinhas(result);
        setDadosPesquisa({
          categoria: selectedCategoria ? selectedCategoria.label : "Todas",
          data: data ? data : "Não especificada",
        });

        // Limpar inputs após a pesquisa
        setSelectedCategoria(null);
        setSelectedDate("");
      })
      .catch((error) => {
        console.error("Erro na busca:", error);
        setErrorMessage("Ocorreu um erro ao realizar a pesquisa. Tente novamente.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clearFilters = () => {
    setSelectedCategoria(null);
    setSelectedDate("");
    setDadosPesquisa(null);
    setErrorMessage(null);
  };

  const hoje = new Date().toISOString().split("T")[0];

  return (
    <div>
      <Introducao
        titulo={"Notícias"}
        texto={"Confira dados relacionados às notícias publicadas no BDM"}
      />
      <div className={style.container}>
        <Select
          options={categoria}
          onChange={handleSelectChange}
          value={selectedCategoria}
          classNamePrefix="react-select"
          placeholder="Selecione a categoria"
          isMulti={false}
          isClearable={true}
        />
        <input
          type="date"
          max={hoje}
          name="filtro-ordem"
          id="filtro-ordem"
          onChange={handleDateChange}
          value={selectedDate}
        />
        <div className={style.buttonContainer}>
          <button className={style.btn_pesquisar} onClick={clickSearch}>
            {isLoading ? "Carregando..." : "Pesquisar"}
          </button>
        </div>
        {errorMessage && <div className={style.error}>{errorMessage}</div>}
      </div>
      {dadosPesquisa && (
        <div className={style.resultado}>
          <div className={style.card}>
            <div className={style.row_info}>
              <div className={style.conteudoResultado}>
                <h3 className={style.numLinhas}>{numLinhas} Notícias</h3>
                <p>Categoria: {dadosPesquisa.categoria}</p>
                <p>Data Pesquisada: {dadosPesquisa.data}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Noticias;
