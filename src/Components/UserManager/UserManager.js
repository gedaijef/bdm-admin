import React, { useState, useEffect, useRef } from "react";
import style from "./UserManager.module.css";
import { addUser, listCategories } from "../../Utils/scriptConexao";
import InputMask from "react-input-mask";
import Select from 'react-select';
import Introducao from "../Intruducao/Introducao";
<link rel="stylesheet" href="./UserManager.module.css" />

const UserManager = () => {
  // REFs
  const selectCategoria = useRef(null);

  // Categorias do banco
  const [categoria, setCategorias] = useState([]);

  // Dados API
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  // Estado para mensagens de resposta e carregamento
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Pegando CATEGORIAS do banco
  const focusCategoria = () => {
    listCategories().then((resultado) => {
      setCategorias(
        resultado.map((item) => ({ value: item.id, label: item.name }))
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

  // SETs das variáveis
  const changeName = (event) => {
    setName(event.target.value);
  };

  // Removendo caracteres não numéricos antes de salvar o telefone
  const changePhone = (event) => {
    const numericPhone = event.target.value.replace(/\D/g, "");
    setPhone(numericPhone);
  };

  const changeProfession = (event) => {
    setProfession(event.target.value);
  };

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  // Removendo caracteres não numéricos antes de salvar o CPF
  const changeCpf = (event) => {
    const numericCpf = event.target.value.replace(/\D/g, "");
    setCpf(numericCpf);
  };

  // Manipulando seleções múltiplas
  const handleSelectChange = (selectedOptions) => {
    setSelectedCategorias(selectedOptions); 
  };

  const clickAdd = (event) => {
    setIsLoading(true);
    setResponseMessage("");
  
    // Cria a string com as categorias selecionadas, separadas por vírgula
    const categoriasConcatenadas = selectedCategorias.map(categoria => categoria.value).join(",");
  
    let addUserResponse = addUser(
      name,
      phone,
      email,
      profession,
      cpf,
      categoriasConcatenadas
    );
  
    addUserResponse
      .then((response) => response.json())
      .then((response) => {
        setIsLoading(false);
        if (response.status !== 201) {
          setResponseMessage(response.error);
        } else {
          setResponseMessage(response.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setResponseMessage("Ocorreu um erro. Tente novamente.");
      });
  };

  return (
    <div>
      <div className={style.content}>
      <Introducao color="#ffffff" titulo="Adicionar Usuário" texto={`
            Preencha os dados do usuário que você deseja adicionar
            `}/>
        <div className={style.form}>
          <div className={style.row}>
            <div className={style.campo_form}>
              <label htmlFor="Nome">Nome Completo:</label>
              <input
                onChange={changeName}
                value={name}
                name="Nome"
                placeholder=""
                type="text"
              />
            </div>

            <div className={style.campo_form}>
              <label htmlFor="Telefone">Telefone:</label>
              <InputMask
                mask="+99 (99) 99999-9999"
                onChange={changePhone}
                value={phone}
                placeholder="+xx(xx)xxxxx-xxxx"
              >
                {(inputProps) => <input {...inputProps} type="text" />}
              </InputMask>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.campo_form}>
              <label htmlFor="Profissao">Profissão:</label>
              <input
                onChange={changeProfession}
                value={profession}
                name="Profissao"
                type="text"
              />
            </div>
            <div className={style.campo_form}>
              <label htmlFor="Email">E-mail:</label>
              <input
                onChange={changeEmail}
                value={email}
                name="Email"
                placeholder="seuemail@email.com"
                type="email"
              />
            </div>
          </div>
          <div className={style.row}>
            <div className={style.campo_form}>
              <label htmlFor="CPF">CPF:</label>
              <InputMask
                mask="999.999.999-99"
                onChange={changeCpf}
                value={cpf}
                placeholder="***.***.***-**"
              >
                {(inputProps) => <input {...inputProps} type="text" />}
              </InputMask>
            </div>

            <div className={style.campo_form}>
              <label htmlFor="Categoria">Categoria</label>
              <Select
                isMulti
                options={categoria}
                onChange={handleSelectChange}
                value={selectedCategorias}
                classNamePrefix="reactSelect"
                placeholder="Selecione as categorias"
                className={style.reactSelectControl}
              />
            </div>
          </div>
          <div className={style.buttonContainer}>
            <button onClick={clickAdd} className={style.btn_avancar}>
              {isLoading ? "Carregando..." : "ADICIONAR USUÁRIO"}
            </button>
            
            {responseMessage && (
              <p className={style.resposta}>{responseMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
