import style from "./Noticias.module.css";
import React, { useState, useEffect } from "react";
import { listCategories, listNewsByDateRange } from "../../Utils/scriptConexao";
import Select from "@mui/material/Select";
import Introducao from "../Introducao/Introducao";
import dayjs from "dayjs";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

const Noticias = () => {
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [categoria, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numLinhas, setNumLinhas] = useState("");
  const [numPessoas, setNumPessoas] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
    focusCategoria();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedCategorias(event.target.value);
  };

  const handleStartDateChange = (newDate) => {
    if (
      newDate &&
      (!endDate || newDate.isBefore(endDate)) &&
      newDate.isBefore(dayjs())
    ) {
      setStartDate(newDate);
    }
  };

  const handleEndDateChange = (newDate) => {
    if (
      newDate &&
      (!startDate || newDate.isAfter(startDate)) &&
      newDate.isBefore(dayjs())
    ) {
      setEndDate(newDate);
    }
  };

  const clickSearch = () => {
    setIsLoading(true);
    setErrorMessage(null);

    // Verifica se há categorias selecionadas. Se não houver, define como null.
    const selectedCategoryString =
      selectedCategorias.length > 0 ? selectedCategorias.join(",") : null;
    const dataInicio = startDate ? startDate.format("YYYY-MM-DD") : null;
    const dataFim = endDate ? endDate.format("YYYY-MM-DD") : null;

    console.log(dataInicio, dataFim, selectedCategoryString);

    listNewsByDateRange(dataInicio, dataFim, selectedCategoryString)
      .then((response) => response.json())
      .then((result) => {
        if (result.error) throw new Error(result.error);

        const formatarData = (data) => {
          const [ano, mes, dia] = data.split("-");
          return `${dia}/${mes}/${ano}`;
        };

        result = result.replace(/[^\d,]/g, "")
        result = result.split(',')
        setNumLinhas(result[0]);
        setNumPessoas(result[1]);
        setDadosPesquisa({
          categoria:
            selectedCategorias.length > 0
              ? selectedCategorias
                  .map(
                    (value) =>
                      categoria.find((cat) => cat.value === value)?.label
                  )
                  .join(", ")
              : "Todas",
          data: dataInicio
            ? dataFim
              ? `De ${formatarData(dataInicio)} a ${formatarData(dataFim)}`
              : `A partir de ${formatarData(dataInicio)}`
            : "Não especificada",
        });
        setStartDate(null);
        setEndDate(null);
      })
      .catch((error) => {
        console.error("Erro na busca:", error);
        setErrorMessage(
          "Ocorreu um erro ao realizar a pesquisa. Tente novamente."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clearFilters = () => {
    setSelectedCategorias([]);
    setStartDate(null);
    setEndDate(null);
    setDadosPesquisa(null);
    setErrorMessage(null);
  };

  return (
    <div>
      <Introducao
        titulo={"Notícias"}
        texto={"Confira dados relacionados às notícias publicadas no BDM"}
      />
      <div className={style.container}>
        <FormControl>
          <Select
            multiple
            value={selectedCategorias}
            onChange={handleSelectChange}
            input={<OutlinedInput />}
            displayEmpty
            renderValue={(selected) =>
              selected.length === 0
                ? "Selecione uma categoria"
                : selected
                    .map(
                      (value) =>
                        categoria.find((cat) => cat.value === value)?.label
                    )
                    .join(", ")
            }
          >
            <MenuItem value="">
              <em>Selecione uma categoria</em>
            </MenuItem>
            {categoria.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Data de Início"
            value={startDate}
            onChange={handleStartDateChange}
            maxDate={dayjs()}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="Data de Fim"
            value={endDate}
            onChange={handleEndDateChange}
            minDate={startDate}
            maxDate={dayjs()}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <div className={style.buttonContainer}>
          <button className={style.btn_pesquisar} onClick={clickSearch}>
            {isLoading ? "Carregando..." : "Pesquisar"}
          </button>
          <button className={style.btn_limpar} onClick={clearFilters}>
            Limpar Filtros
          </button>
        </div>

        {errorMessage && <div className={style.error}>{errorMessage}</div>}
      </div>
      {dadosPesquisa && (
        <div className={style.resultado}>
          <p><strong>Categorias:</strong> {dadosPesquisa.categoria}</p>
          <p><strong>Data Pesquisada:</strong> {dadosPesquisa.data}</p>
          <div className={style.cards}>
            <div className={style.card}>
                <div className={style.conteudoResultado}>
                  <h3 className={style.numLinhas}>{numLinhas}</h3>
                  <h3 className={style.legendaResultado}>Notícias escritas</h3>
                </div>
            </div>
            <div className={style.card}>
                <div className={style.conteudoResultado}>
                  <h3 className={style.numLinhas}>{numPessoas}</h3>
                  <h3 className={style.legendaResultado}>Pessoas receberam</h3>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Noticias;
