export async function addUser(name, phone, email, profession, cpf, categorias) {
  const url = new URL("https://bdm-back-end.onrender.com/client/addCliente");
  console.log(name, phone, email, profession, cpf, categorias);

  const body = {
    nome: name,
    telefone: phone,
    profissao: profession,
    email: email,
    cpf: cpf,
    categorias: categorias
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

export async function searchNews(categorias, order) {
  const url = new URL("https://bdm-back-end.onrender.com/client/addCliente");
  
  const body = {
    categorias: categorias
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

export async function deleteCliente(cpf){
  const url = new URL("https://bdm-back-end.onrender.com/client/deleteCliente");
  
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

export async function searchCliente(cpf){
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

let categorias = [];
export async function listCategories() {
  const url = new URL("https://bdm-back-end.onrender.com/categorie/listCategories");

  const response = await fetch(url, { method: "GET" });

  categorias = await response.json();
  return categorias;
}
