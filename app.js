import http from "http";
import fs from "fs";
import rotas from './routers.js'
import sqlite3 from "sqlite3";
import { sequelize } from "./models.js";



const db = new sqlite3.Database('./tic.db', (erro) => {
    if (erro) {
        console.log("Falha ao conectar ao banco de dados", erro);
        return;
    }
    console.log("Conectado ao banco de dados");
});

fs.writeFile("./mensagem.txt", "Oláaaaa,tic em trilhas no arquibo", "utf-8", (erro) => {
    if (erro) {
        console.log("Falha ao escrever o arquivo", erro);
    }
    console.log("Arquivo foi criado com sucesso");
});

fs.readFile("./mensagem.txt","utf-8", (erro, conteudo) => {
    if (erro) {
        console.log("Falha na leitura do arquivo", erro);
        return;
    }
    console.log(`Conteudo: ${conteudo}`);
    iniciaServidorHttp(conteudo);
});

/*
function iniciaServidorHttp(conteudo) {
    const servidor = http.createServer((req, res) => {
        rotas(req, res, {conteudo});
    });
    
    const porta = 3000;
    const host = 'localhost';
    
    servidor.listen(porta, host, () => {
        console.log(`Servidor executando em http://${host}:${porta}/`);
    });

    
}
*/
async function iniciaServidorHttp(conteudo) {
    await sequelize.sync();

    const servidor = http.createServer((req, res) => {
        rotas(req, res, {conteudo});
    });
    
    const porta = 3000;
    const host = 'localhost';
    
    servidor.listen(porta, host, () => {
        console.log(`Servidor executando em http://${host}:${porta}/`);
    });

    
}
function exemploTradicional () {
    console.log('Expressão');
}
const exemploExpressao = function () {
    console.log('Expressão');
}

