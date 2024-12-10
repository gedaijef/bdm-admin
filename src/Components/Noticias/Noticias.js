import style from "./Noticias.module.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  listCategories,
  listNewsByDateRange,
  listNewsDetails,
  listSpecificNews,
} from "../../Utils/scriptConexao";
import Select from "@mui/material/Select";
import Introducao from "../Introducao/Introducao";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { Checkbox } from "@mui/material";
import "dayjs/locale/pt-br";

const Noticias = () => {
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [categoria, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [numLinhas, setNumLinhas] = useState("");
  const [numPessoas, setNumPessoas] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dadosPesquisa, setDadosPesquisa] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showNews, setShowNews] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    listCategories().then((resultado) => {
      setCategorias(
        resultado.map((item) => ({ value: item.id, label: item.name }))
      );
    });
  }, []);

  const handleSelectChange = (event) => {
    setSelectedCategorias(event.target.value);
  };

  const handleStartDateChange = (newDate) => {
    console.log(newDate)
    if (newDate && newDate.isBefore(dayjs())) {
      setStartDate(newDate);
    }
  };

  const handleEndDateChange = (newDate) => {
    console.log(newDate);
    if (newDate && newDate.isBefore(dayjs())) {
      setEndDate(newDate);
    }
  };

  const clickSearch = () => {
    console.log(endDate+" -- "+startDate)

    setIsLoading(true);
    setErrorMessage(null);
    setShowNews(false);

    const selectedCategoryString =
      selectedCategorias.length > 0 ? selectedCategorias.join(",") : null;
    const dataInicio = startDate ? startDate.format("YYYY-MM-DD") : null;
    const dataFim = endDate ? endDate.format("YYYY-MM-DD") : null;

    listNewsByDateRange(dataInicio, dataFim, selectedCategoryString)
      .then((response) => response.json())
      .then((result) => {
        if (result.error) throw new Error(result.error);

        const formatarData = (data) => {
          const [ano, mes, dia] = data.split("-");
          return `${dia}/${mes}/${ano}`;
        };

        result = result.replace(/[^\d,]/g, "").split(",");
        setNumLinhas(result[0] || 0);
        setNumPessoas(result[1] || 0);
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

  const clickNews = () => {
    if (isLoadingNews) return; // Previne cliques enquanto carrega

    if (showNews) {
      setShowNews(false);
      return;
    }

    setIsLoadingNews(true);
    setErrorMessage(null);

    const selectedCategoryString =
      selectedCategorias.length > 0 ? selectedCategorias.join(",") : null;
    const dataInicio = startDate ? startDate.format("YYYY-MM-DD") : null;
    const dataFim = endDate ? endDate.format("YYYY-MM-DD") : null;

    listNewsDetails(dataInicio, dataFim, selectedCategoryString)
      .then((response) => response.json())
      .then((result) => {
        if (result.error) throw new Error(result.error);

        const noticiasFormatadas = result.map((noticia) => {
          let dataFormatada = null;
          let contentFormatado = noticia.content

          if (noticia.date) {
            const [ano, mes, dia] = noticia.date.split("T")[0].split("-");
            dataFormatada = `${dia}/${mes}/${ano}`;
          }

          if (noticia.content.length > 350){
            contentFormatado = noticia.content.substring(0,350)+"..."
          }
          
          return {
            content: contentFormatado,
            distributed: noticia.distributed === null ? 0 : noticia.distributed,
            id: noticia.id ?? null,
            time: noticia.time ?? null,
            date: dataFormatada,
          };
        });


        setDadosPesquisa((prev) => ({
          ...prev,
          noticias: noticiasFormatadas,
        }));
        setShowNews(true);
      })
      .catch((error) => {
        console.error("Erro ao carregar notícias:", error);
        setErrorMessage(
          "Ocorreu um erro ao carregar as notícias. Tente novamente."
        );
      })
      .finally(() => {
        setIsLoadingNews(false);
      });
  };

  const handleViewDetails = (id) => {
    navigate(`/noticias/${id}`);
  };

  const clearFilters = () => {
    setSelectedCategorias([]);
    setStartDate(null);
    setEndDate(null);
    setDadosPesquisa(null);
    setErrorMessage(null);
    setNumLinhas("");
    setNumPessoas("");
    setShowNews(false);    
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
            displayEmpty
            className={style.select}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "5px",
                  border: "1px solid #888888",
                  minWidth: "20px",
                  maxHeight: "300px",
                  "& .MuiMenuItem-root": {
                    transition: 1,
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    fontWeight: 400,
                    "&:hover": {
                      backgroundColor: "#181818",
                      color: "#ffffff",
                      fontWeight: 700,
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#181818",
                      color: "#ffffff",
                      fontWeight: 700,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#444444",
                      color: "#ffffff",
                      fontWeight: 700,
                    },
                  },
                },
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
            }}
            onChange={handleSelectChange}
            input={<OutlinedInput />}
            renderValue={(selected) =>
              selected.length === 0 ? (
                <span style={{ color: "#888888" }}>
                  Selecione uma categoria
                </span>
              ) : (
                selected
                  .map(
                    (value) =>
                      categoria.find((cat) => cat.value === value)?.label
                  )
                  .join(", ")
              )
            }
          >
            <MenuItem disabled value="">
              Selecione uma categoria
            </MenuItem>
            {categoria.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                <Checkbox
                  checked={selectedCategorias.includes(cat.value)}
                  sx={{
                    color: selectedCategorias.includes(cat.value)
                      ? "#181818"
                      : "#888888",
                    "&.Mui-checked": {
                      color: "#ffffff",
                    },
                  }}
                />
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
            format="DD/MM/YYYY"
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="Data de Fim"
            value={endDate}
            onChange={handleEndDateChange}
            minDate={startDate}
            maxDate={dayjs()}
            format="DD/MM/YYYY"
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
          <p>
            <strong>Categorias:</strong> {dadosPesquisa.categoria}
          </p>
          <p>
            <strong>Data Pesquisada:</strong> {dadosPesquisa.data}
          </p>
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
                <h3 className={style.legendaResultado}>Mensagens enviadas</h3>
              </div>
            </div>
          </div>
          <div className={style.mais}>
            {dadosPesquisa?.noticias && showNews && (
              <ul className={style.noticiasLista}>
                {dadosPesquisa.noticias.map((noticia, index) => (
                  <li key={index} className={style.noticiaItem}>
                    <div
                      onClick={() => handleViewDetails(noticia.id)}
                      className={style.contentDetails}
                    >
                      <p className={style.content}>{noticia.content}</p>
                      <div className={style.rightContainer}>
                        <p className={style.id}><strong>ID: </strong>{noticia.id}</p>
                        <p className={style.date}><strong>Enviado: </strong>{noticia.date} {noticia.time}</p>
                        <p className={style.distributed}>
                          <strong>Vezes enviada: </strong>
                          {noticia.distributed}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button className={style.btn_noticias} onClick={clickNews}>
              {isLoadingNews
                ? "Carregando..."
                : showNews
                ? "Ocultar detalhes"
                : "Exibir detalhes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Noticias;
