const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const res = require('express/lib/response')
const { request, response } = require('express')
const req = require('express/lib/request')
const { json } = require('express/lib/response')
app.use(cors())
app.use(express.json())

//banco de dados em memória
var clientes = []

function buscarCliente(busca) {
  return clientes.filter(cliente => {
    // Verifica se algum campo do cliente corresponde à busca
    for (let campo in cliente) {
      if (cliente[campo].toString().toLowerCase().includes(busca.toLowerCase())) {
        return true;
      }
    }
    return false;
  });
}

app.get('/listar', (request, response) => {
  response.json(clientes)
})

app.get('/ordenar', (request, response) => {
  // let nome = request.params.nome
  clientes.sort(function compare(a, b) {
    if (a.nome < b.nome) return -1
    if (a.nome > b.nome) return 1
    return 0
  })
  response.json(clientes)
})

app.get('/buscar', (request, response) => {
  const busca = request.query.q;

  // Chama a função buscarCliente
  const clientesEncontrados = buscarCliente(busca);

  if (clientesEncontrados.length > 0) {
    // Se encontrou clientes, responde com a lista de clientes encontrados
    response.json(clientesEncontrados);
  } else {
    // Se não encontrou nenhum cliente, responde com uma mensagem adequada
    response.status(404).json({ message: 'Nenhum cliente encontrado com essa busca.' });
  }
});

app.post("/cadastrar", (request, response) => {
  let cliente = request.body
  console.log(cliente)
  clientes.push(cliente) //adiciona o cliente no BD
  response.json({ success: true })
})

app.delete("/excluir/:cpf", (req, res) => {
  let cpf = req.params.cpf //chamando o cpf como parametro

  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i]
    if (cliente.cpf == cpf) {
      //remove o elemento encontrado na posição "i"
      clientes.splice(i, 1)
    }
  }
  res.json({ success: true })
})

app.put("/alterar/", (req, res) => {
  let cliente = req.body
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cpf == cliente.cpf) {
      clientes[i] = cliente
    }
  }
  res.json({ success: true })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})