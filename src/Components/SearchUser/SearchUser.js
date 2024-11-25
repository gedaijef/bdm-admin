import style from "./SearchUser.module.css";
import { searchAllClients } from "../../Utils/scriptConexao";
import Introducao from "../Introducao/Introducao";
import React, { useState, useEffect } from "react";

const SearchUser = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);

  const loadClients = () => {
    searchAllClients()
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setUserData(data);
          setResponseMessage("");
        } else {
          setResponseMessage("Nenhum usuário encontrado.");
        }
      })
      .catch((error) => {
        setResponseMessage("Erro ao buscar usuários.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadClients();
  }, []);

  const formatadorTelefone = (tel) => {
    if (!tel) return "Não especificado";
    const formatado = tel.replace(
      /^(\d{2})(\d{2})(\d{5})(\d{4})$/,
      "+$1($2)$3-$4"
    );
    return formatado;
  };

  const formatadorCategorias = (categorias) => {
    if (!categorias) return "Não especificado";
    const espaço = categorias.replace(",", `, \n`);
    const formatado =
      espaço.slice(0, espaço.lastIndexOf(",")) +
      " e" +
      espaço.slice(espaço.lastIndexOf(",") + 1);
    return formatado;
  };

  const formatadorData = (dataISO) => {
    if (!dataISO) return "Não especificado";
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const formatadorCpf = (cpf) => {
    if (!cpf) return "Não especificado";
    const formatado = cpf.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      `$1.$2.$3-$4`
    );
    return formatado;
  };

  return (
    <div>
      <div className={style.content}>
        <Introducao
          color="#ffffff"
          titulo="Listar Usuários"
          texto="Aqui você encontra a lista de todos os usuários cadastrados no BDM e todas as suas informações"
        />
        <div className={style.form}>
          <div className={style.row}></div>
          <div className={style.buttonContainer}>
            {responseMessage && <p>{responseMessage}</p>}
            {userData &&
              userData.map((user, index) => (
                <div key={index} className={style.card}>
                  <div className={style.content_card}>
                    <div className={style.row_info}>
                      <div>
                        <h2 className={style.nome}>{user.name || "Não especificado"}</h2>
                      </div>
                    </div>
                    <div className={style.row_info}>
                      <div className={style.email}>
                        <h3>Email: </h3>
                        <p>{user.email || "Não especificado"}</p>
                      </div>
                      <div className={style.campo}>
                        <h3>CPF: </h3>
                        <p>{formatadorCpf(user.cpf)}</p>
                      </div>
                      <div className={style.campo}>
                        <h3>Telefone: </h3>
                        <p>{formatadorTelefone(user.phone_number)}</p>
                      </div>
                      <div className={style.campo}>
                        <h3>Data de Nascimento: </h3>
                        <p>{formatadorData(user.birth_date)}</p>
                      </div>
                      <div className={style.campo}>
                        <h3>Empresa: </h3>
                        <p>{user.company || "Não especificado"}</p>
                      </div>
                      <div className={style.campo}>
                        <h3>Cargo: </h3>
                        <p>{user.position || "Não especificado"}</p>
                      </div>
                      <div className={style.campo}>
                        <h3>Categorias: </h3>
                        <p>
                          {formatadorCategorias(user.concat_categories) ||
                            "Não especificado"}
                        </p>
                      </div>
                    </div>
                    <div className={style.container_button}></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
