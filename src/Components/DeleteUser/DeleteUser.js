import React, { useState } from "react";
import InputMask from "react-input-mask";
import TextField from "@mui/material/TextField";
import Introducao from "../Introducao/Introducao";
import style from "./DeleteUser.module.css";
import { deleteCliente, searchClienteByPhone } from "../../Utils/scriptConexao";

const DeleteUser = () => {
  const [phone, setPhone] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const changePhone = (event) => {
    const numericPhone = event.target.value.replace(/\D/g, "");
    setPhone(numericPhone);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("Text");
    const numericPhone = pastedData.replace(/\D/g, ""); // Remove caracteres não numéricos
    setPhone(numericPhone);
  };

  const formatadorTelefone = (tel) => {
    if (!tel) return "";
    return tel.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, "+$1 ($2) $3-$4");
  };

  const formatadorCpf = (cpf) => {
    if (!cpf) return "";
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  const clickAdd = () => {
    setIsLoading(true);
    setResponseMessage("");
    setUserData(null);

    searchClienteByPhone(phone)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setUserData(data[0]);
          setResponseMessage("Usuário encontrado");
        } else {
          setResponseMessage("Usuário não encontrado.");
        }
      })
      .catch(() => {
        setResponseMessage("Erro ao buscar usuário.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteUser = () => {
    deleteCliente(phone)
      .then(() => {
        setResponseMessage("Usuário deletado com sucesso.");
        setUserData(null);
      })
      .catch(() => {
        setResponseMessage("Erro ao deletar usuário.");
      });
  };

  return (
    <div>
      <div className={style.content}>
        <Introducao
          color="#ffffff"
          titulo="Deletar Usuário"
          texto={`Pesquise o número de telefone do usuário que você deseja excluir`}
        />
        <div className={style.form}>
          <div className={style.row}>
            <InputMask
              mask="+99 (99) 99999-9999"
              value={phone}
              onChange={changePhone}
              onPaste={handlePaste} // Trata o evento de colagem
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  placeholder="Telefone"
                  className={style.inputs}
                  variant="outlined"
                />
              )}
            </InputMask>
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
