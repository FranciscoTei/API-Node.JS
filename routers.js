import fs from 'fs'
import { criaProduto } from './models';

export default function rotas(req, res, dado) {
    res.setHeader('Content-Type', 'application/json', 'utf-8');

    if(req.method === 'GET' && req.url === '/') {
        const { conteudo } = dado;

        res.statusCode = 200;        
        const resposta = {
            mensagem: conteudo
        }
        res.end(JSON.stringify(resposta));
        return;
        
    }
    
    if(req.method === 'POST' && req.url === '/produtos') {
        const corpo = [];

        req.on('data', (parte) => {
            corpo.push(parte);
        });

        req.on('end', async () => {
            const produto = JSON.parse(corpo);

            res.statusCode = 400;
            
            if(!produto?.nome) {
                const resposta = {
                    erro: {
                        mensagem: "O atributo 'nome' não foi encontrado, porém é obrigatório para a criação do produto."
                    }
                };

                res.end(JSON.stringify(resposta));
    
                return;
            }
            if(!produto?.preco) {
                const resposta = {
                    erro: {
                        mensagem: "O atributo 'preco' não foi encontrado, porém é obrigatório para a criação do produto."
                    }
                };

                res.end(JSON.stringify(resposta));
    
                return;
            }
            try {
              const resposta = await criaProduto(produto);
              res.statusCode = 200;

              res.end(JSON.stringify(resposta));

              return;
            } catch (erro) {
              console.log('Falha ao criar produto', erro);

              res.statusCode = 500

              const resposta = {
                  erro: {
                      mensagem: `Falha ao criar produto ${produto.nome}`
                  }
              };

              res.end(JSON.stringify(resposta));

              return;
            }
        });

        req.on("erro", (erro) => {
            console.log("Falha ao processar requisição", erro);

            res.statusCode = 400;

            const resposta = {
                erro: {
                    mensagem: "Falha ao processar a requisição",
                },
            };

            res.end(JSON.stringify(resposta));

            return;
        });

        return;
    }

    if (req.method === "PATCH" && req.url.split('/')[1] === "/produtos" && isNaN(req.url.split('/')[2])) {
      const corpo = [];

      req.on("data", (parte) => {
        corpo.push(parte);
      });

      req.on("end", () => {
        const produto = JSON.parse(corpo);

        res.statusCode = 400;

        if (!produto?.nome) {
          const resposta = {
            erro: {
              mensagem:
                "O atributo 'nome' não foi encontrado, porém é obrigatório para a criação do produto.",
            },
          };

          res.end(JSON.stringify(resposta));

          return;
        }

        if (!produto?.conteudo) {
          const resposta = {
            erro: {
              mensagem:
                "O atributo 'conteudo' não foi encontrado, porém é obrigatório para a atualização do produto.",
            },
          };

          res.end(JSON.stringify(resposta));

          return;
        }

        fs.access(`${produto.nome}.txt`, fs.constants.W_OK, (erro) => {
            if(erro) {
                console.log('Falha ao acessar o produto', erro);

                res.statusCode = erro.code === "ENOENT" ? 404 : 403;

                const resposta = {
                    erro: {
                        mensagem: `Falha ao acessar produto ${produto.nome}`
                    }
                    
                };
                res.end(JSON.stringify(resposta));

                return;
            }
            
            fs.appendFile(`${produto.nome}.txt`, `\n${produto.conteudo}`, "utf-8", (erro) => {
                if (erro) {
                    console.log("Falha ao atualizar produto", erro);

                    res.statusCode = 500;

                    const resposta = {
                        erro: {
                        mensagem: `Falha ao atualizar produto ${produto.nome}`,
                        },
                    };

                    res.end(JSON.stringify(resposta));

                    return;
                }

                res.statusCode = 200;

                const resposta = {
                mensagem: `Produto ${produto.nome} atualizado com sucesso`,
                };

                res.end(JSON.stringify(resposta));

                return;
            }
            );

        });


      });

      req.on("erro", (erro) => {
        console.log("Falha ao processar requisição", erro);

        res.statusCode = 400;

        const resposta = {
          erro: {
            mensagem: "Falha ao processar a requisição",
          },
        };

        res.end(JSON.stringify(resposta));

        return;
      });

      return;
    }

    if (req.method === "DELETE" && req.url === "/produtos") {
      const corpo = [];

      req.on("data", (parte) => {
        corpo.push(parte);
      });

      req.on("end", () => {
        const produto = JSON.parse(corpo);

        res.statusCode = 400;

        if (!produto?.nome) {
          const resposta = {
            erro: {
              mensagem:
                "O atributo 'nome' não foi encontrado, porém é obrigatório para a remoção do produto.",
            },
          };

          res.end(JSON.stringify(resposta));

          return;
        }

        fs.access(`${produto.nome}.txt`, fs.constants.W_OK, (erro) => {
          if (erro) {
            console.log("Falha ao remover o produto", erro);

            res.statusCode = erro.code === "ENOENT" ? 404 : 403;

            const resposta = {
              erro: {
                mensagem: `Falha ao remover o produto ${produto.nome}`,
              },
            };
            res.end(JSON.stringify(resposta));

            return;
          }

          fs.rm(`${produto.nome}.txt`, (erro) => {
              if (erro) {
                console.log("Falha ao remover produto", erro);

                res.statusCode = 500;

                const resposta = {
                  erro: {
                    mensagem: `Falha ao remover produto ${produto.nome}`,
                  },
                };

                res.end(JSON.stringify(resposta));

                return;
              }

              res.statusCode = 200;

              const resposta = {
                mensagem: `Produto ${produto.nome} removido com sucesso`,
              };

              res.end(JSON.stringify(resposta));

              return;
            }
          );
        });
      });

      req.on("erro", (erro) => {
        console.log("Falha ao processar requisição", erro);

        res.statusCode = 400;

        const resposta = {
          erro: {
            mensagem: "Falha ao processar a requisição",
          },
        };

        res.end(JSON.stringify(resposta));

        return;
      });

      return;
    }

    res.statusCode = 404;

    const resposta = {
        erro: {
            mensagem: 'Rota não encontrada!',
            url: req.url
        }
    };

    res.end(JSON.stringify(resposta)); 
    
}