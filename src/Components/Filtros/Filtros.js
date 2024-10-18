import React, { useState, useEffect, useRef } from "react";
import { listCategories } from "../../Utils/scriptConexao";
import Select from 'react-select';
import style from "./Filtros.module.css";

const Filtros = () => {
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [categoria, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const clickSearch = (event) => {
    setIsLoading(true);
    const selectedCategoriesString = selectedCategorias.map(option => option.value).join(",");
    alert(selectedCategoriesString)
  }

  const focusCategoria = () => {
    listCategories().then((resultado) => {
      setCategorias(
        resultado.map((item) => ({ value: item.codigo, label: item.nome }))
      ); // Formata o resultado para o react-select
    });
  };

  // Populando o select das CATEGORIAS assim que a página carrega
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      focusCategoria();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSelectChange = (selectedOptions) => {
    setSelectedCategorias(selectedOptions); 
  };



  return (
    <div className={style.container}>
              <Select
                isMulti
                options={categoria}
                onChange={handleSelectChange} 
                value={selectedCategorias} 
                classNamePrefix="react-select"
                placeholder="Selecione as categorias"
              />
      <select name="filtro-ordem" id="filtro-ordem">
        <option selected={true} hidden={true}>
          Ordenar por
        </option>
        <option value="">Nenhum</option>
        <option value="ASC">Mais recente</option>
        <option value="DESC">Mais antigo</option>
      </select>
      <div className={style.buttonContainer}>
            <button onClick={clickSearch} className={style.btn_avancar}>
              {isLoading ? "Carregando..." : "Pesquisar"}
            </button>

          </div>
    </div>
  );
};

export default Filtros;
