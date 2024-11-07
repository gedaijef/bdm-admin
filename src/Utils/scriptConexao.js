export async function addUser(name, phone, email, profession, cpf, categorias,empresa,data_nascimento) {
  // const url = new URL("http://localhost:3001/client/addCliente");
  const url = new URL("https://bdm-back-end.onrender.com/client/addCliente");

  const body = {
    nome: name,
    telefone: phone,
    profissao: profession,
    email: email,
    cpf: cpf,
    categorias: categorias,
    empresa: empresa,
    data_nascimento:data_nascimento
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
}

export async function deleteCliente(phone){
  // const url = new URL("http://localhost:3001/client/deleteCliente");
  const url = new URL("https://bdm-back-end.onrender.com/client/deleteCliente");
  
  const body = {
    phone: phone
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
}

export async function searchCliente(cpf){
  // const url = new URL("http://localhost:3001/client/searchCliente");
  const url = new URL("https://bdm-back-end.onrender.com/client/searchCliente");
  
  const body = {
    cpf: cpf
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
}

export async function searchClienteByPhone(phone){
  // const url = new URL("http://localhost:3001/client/searchClienteByPhone");
  const url = new URL("https://bdm-back-end.onrender.com/client/searchClienteByPhone");
  
  const body = {
    phone: phone
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
}

export async function searchAllClients(){
  // const url = new URL("http://localhost:3001/client/searchCliente");
  const url = new URL("https://bdm-back-end.onrender.com/client/searchCliente");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return response;
}


let categorias = [];
export async function listCategories() {
  // const url = new URL("http://localhost:3001/categorie/listCategories");
  const url = new URL("https://bdm-back-end.onrender.com/categorie/listCategories");

  const response = await fetch(url, { method: "GET" });

  categorias = await response.json();
  return categorias;
}

export async function listNewsByDateRange(data_inicio,data_fim,categoria){
  // const url = new URL("http://localhost:3001/news/SearchNews");
  const url = new URL("https://bdm-back-end.onrender.com/news/SearchNews");

  const body = {data_inicio,data_fim,categoria};

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
}
