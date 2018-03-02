// Configurações do Express
const express = require('express')
const nossoHumildeServidor = express()

// Define em que porta o servidor irá rodar... 8080, 3000, 3030...
const portaServidor = 3030

// Parser para JSON. Necessário para requisições de header Content/Type application/json
nossoHumildeServidor.use(express.json())
 // Configurações do MongoDB
const MongoClient = require('mongodb').MongoClient;
// Url do mongo
const url = "mongodb://localhost:27017"
// Nome do database... Se você não o tiver criado ainda, o mongo irá criar automaticamente.
const nomeDatabase = "livros"

nossoHumildeServidor.get('/livros', (requisicao, resposta) => {
    try{
        MongoClient.connect(url, (erros, database) => {
            var dbo = database.db(nomeDatabase);         
            let collection = dbo.collection('documents');
            collection.find({}).toArray(function(err, result) {
                if (err) throw err;
                resposta.json({
                    status:"200",
                    mensagem:result
                })
              });  
            database.close();   
        });
    }
    catch(err){
        resposta.json({
            status:"200",
            mensagem:`Ocorreu um erro ao buscar os livros: ${err}`
        })
    }
})

nossoHumildeServidor.post("/livros", (requisicao, resposta) => {
    try{
        // Conecta no db
        MongoClient.connect(url, (erros, database) => {
            // Define a coleção
            const collection = database.collection('documents');
            // Insere os dados... Pode ser tanto insertMany como insertOne
            collection.insertMany(
                requisicao.body, function(err, result) {
                resposta.json({
                    status:"200",
                    mensagem:result
                })
            });   
            database.close();   
        });
    }
    catch(err){
        resposta.json({
            status:"200",
            mensagem:`Ocorreu um erro ao adicionar os livros: ${err}`
        })
    }
})

// Adiciona identação nas respostas de formato JSON
nossoHumildeServidor.set('json spaces', 1)

// Roda o servidor na porta definida
nossoHumildeServidor.listen(portaServidor)

