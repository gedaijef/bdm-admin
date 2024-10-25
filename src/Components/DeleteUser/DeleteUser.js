import React, { useState } from "react";
import style from "./DeleteUser.module.css";
import { deleteCliente, searchCliente } from "../../Utils/scriptConexao";
import InputMask from "react-input-mask";
import Introducao from "../Intruducao/Introducao";

const DeleteUser = () => {
  const [cpf, setCpf] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const changeCpf = (event) => {
    const numericCpf = event.target.value.replace(/\D/g, "");
    setCpf(numericCpf);
  };

  const formatadorTelefone = (tel) => {
    if (!tel) return "";
    const formatado = tel.replace(
      /^(\d{2})(\d{2})(\d{5})(\d{4})$/,
      "+$1($2)$3-$4"
    );
    return formatado;
  };

  const formatadorCpf = (cpf) => {
    if (!cpf) return "";
    const formatado = cpf.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      `$1.$2.$3-$4`
    );
    return formatado;
  };

  const clickAdd = (event) => {
    setIsLoading(true);
    setResponseMessage("");
    setUserData(null);
    searchCliente(cpf)
      .then((response) => response.json()) // Primeiro `then()` para converter a resposta para JSON
      .then((data) => {
        if (data && data.length > 0) {
          setUserData(data[0]); // Acessando o primeiro item do array
          setResponseMessage("Usuário encontrado");
        } else {
          setResponseMessage("Usuário não encontrado.");
        }
      })
      .catch((error) => {
        setResponseMessage("Erro ao buscar usuário.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteUser = () => {
    setUserData(null);
    setResponseMessage("Usuário deletado com sucesso.");
    deleteCliente(userData.cpf);
  };

  return (
    <div>
      <div className={style.content}>
        <Introducao
          color="#ffffff"
          titulo="Deletar Usuário"
          texto={`
            Pesquise o usuário que você deseja excluir pelo CPF e exclua-o
            `}
        />
        <div className={style.form}>
          <div className={style.row}></div>
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
            <button onClick={clickAdd} className={style.btn_pesquisa}>
              {isLoading ? "Carregando..." : "Pesquisar"}
            </button>
          </div>
          <div className={style.buttonContainer}>
            {responseMessage && <p>{responseMessage}</p>}
            {userData && (
              <div className={style.card}>
                <div className={style.row_info}>
                  <div>
                    <h3>Nome: </h3>
                    <p>{userData.name}</p>
                  </div>
                  <div>
                    <h3>Telefone: </h3>
                    <p>{formatadorTelefone(userData.phone_number)}</p>
                  </div>
                </div>
                <div className={style.row_info}>
                  <div>
                    <h3>Email: </h3>
                    <p>{userData.email}</p>
                  </div>
                  <div>
                    <h3>CPF: </h3>
                    <p>{formatadorCpf(userData.cpf)}</p>
                  </div>
                </div>
                <div className={style.container_button}>
                  {/* <button onClick={deleteUser} className={style.btn_edit}>
                    Editar informações
                  </button> */}
                  <button onClick={deleteUser} className={style.btn_exclude}>
                    Excluir usuário
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
