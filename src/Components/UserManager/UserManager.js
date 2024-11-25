import React, { useState, useEffect } from "react";
import style from "./UserManager.module.css";
import { addUser, listCategories } from "../../Utils/scriptConexao";
import InputMask from "react-input-mask";
import Introducao from "../Introducao/Introducao";
import InputLabel from "@mui/material/InputLabel";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { Checkbox } from "@mui/material";

const UserManager = () => {
  const theme = useTheme();
  
  // Categorias do banco
  const [categoria, setCategorias] = useState([]);

  // Dados do formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [profession, setProfession] = useState("");
  const [company, setCompany] = useState("");
  const [birth, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  // Estado para mensagens de resposta e carregamento
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Obtém categorias do banco ao carregar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const resultado = await listCategories();
        setCategorias(
          resultado
            .filter((item) => item.id !== 8 && item.id !== 9) // Filtra categorias com id 8 e 9
            .map((item) => ({ value: item.id, label: item.name }))
        );
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    fetchCategorias();
  }, []);
  

  const handleSelectChange = (event) => {
    setSelectedCategorias(event.target.value);
  };

  const clearFilters = () => {
    setSelectedCategorias([]);
    setPhone('')
    setCompany('')
    setBirthDate('')
    setEmail('')
    setProfession('')
    setName('')
    setCpf('')
  };


  const handleClickAdd = async () => {
    setIsLoading(true);
    setResponseMessage("");

    const categoriasConcatenadas = selectedCategorias.join(",");
    const [dia, mes, ano] = birth.split('/');
    const dataFormatada = `${ano}-${mes}-${dia}`;
    const nameCap = String(profession).charAt(0).toUpperCase() + String(profession).slice(1);
    const professionCap = String(profession).charAt(0).toUpperCase() + String(profession).slice(1);
    const companyCap = String(company).charAt(0).toUpperCase() + String(company).slice(1);
    console.log(professionCap +" // "+ companyCap);
    

    try {
      const response = await addUser(
        name,
        phone,
        email,
        professionCap,
        cpf,
        categoriasConcatenadas,
        companyCap,
        dataFormatada
      );
      const result = await response.json();
      setIsLoading(false);
      if(result.status !== 201){
        setResponseMessage(result.error)
      }else{
      setResponseMessage(result.message)
      clearFilters()
      }
    } catch (error) {
      setIsLoading(false);
      setResponseMessage("Ocorreu um erro. Tente novamente.");
    }
  };

  return (
    <div className={style.content}>
      <Introducao
        color="#ffffff"
        titulo="Adicionar Usuário"
        texto="Preencha os dados do usuário que você deseja adicionar"
      />
      <div className={style.form}>
        <div className={style.row}>
          <TextField
            placeholder="Nome Completo"
            variant="outlined"
            fullWidth
            className={style.inputs}
            margin="normal"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <InputMask
            mask="+99 (99) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                placeholder="Telefone"
                className={style.inputs}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          </InputMask>
        </div>

        <div className={style.row}>
          <TextField
            placeholder="Profissão/Cargo"
            variant="outlined"
            className={style.inputs}
            fullWidth
            margin="normal"
            onChange={(e) => setProfession(e.target.value)}
            value={profession}
          />
          <TextField
            placeholder="Empresa"
            variant="outlined"
            fullWidth
            className={style.inputs}
            margin="normal"
            onChange={(e) => setCompany(e.target.value)}
            value={company}
          />
        </div>

        <div className={style.row}>
          <InputMask
            mask="99/99/9999"
            value={birth}
            onChange={(e) => setBirthDate(e.target.value)}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                className={style.inputs}
                placeholder="Data de Nascimento"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          </InputMask>
          <TextField
            placeholder="E-mail"
            variant="outlined"
            className={style.inputs}
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
          />
        </div>

        <div className={style.row}>
          <InputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                className={style.inputs}
                placeholder="CPF"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          </InputMask>
          <FormControl fullWidth margin="normal">
            <Select
              multiple
              value={selectedCategorias}
              displayEmpty
              className={style.inputs}
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
        </div>

        <div className={style.buttonContainer}>
          <button onClick={handleClickAdd} className={style.btn_avancar}>
            {isLoading ? "Carregando..." : "ADICIONAR USUÁRIO"}
          </button>
          {responseMessage && (
            <p className={style.resposta}>{responseMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManager;
