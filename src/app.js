const express = require("express");
const cors = require("cors");
const { response } = require("express");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//um GET "comum"
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
//os parâmetros que serão obtidos no corpo da request
 const { title, url, techs } = request.body;

 //os parâmetros do objeto 'repository'
 const repository = {
  id: uuid(),
  title,
  url,
  techs,
  likes:0,
 }

repositories.push(repository);
return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  //para buscar um repositório pelo Id
  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (findRepositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository not found.'});
  }

  //atualizando os valores do repositório agora com o valor dos likes
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryIndex].likes,
  };

  repositories[findRepositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);
//splice para deletar o repositório encontrado pelo Id/posição na array  
  if (findRepositoryIndex >= 0){
    repositories.splice(findRepositoryIndex, 1);
  }
  else
  {
    return response.status(400).json({error: 'Repository not found.'});
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (findRepositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository not found.'});
  }
  //acréscimo +1 para os likes
  repositories[findRepositoryIndex].likes++;

  return response.json(repositories[findRepositoryIndex]);
});

module.exports = app;
