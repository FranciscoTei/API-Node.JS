import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./tic.db",
});

sequelize.authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch((erro) => {
    console.log("Falha ao conectar ao banco de dados", erro);
  });

export const Produto = sequelize.define("produto", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    preco: { type: Sequelize.DOUBLE, allowNull: false },
});

export async function criaProduto(produto) {
    try {
        const resultado = await Produto.create(produto);
        console.log(`O produto ${resultado.nome} foi criado com sucesso`);
        return resultado;
    } catch (erro) {
        console.log("Falha ao criar o produto", erro);
        throw erro;
    }
};

export async function leProdutos() {
    try{
        const produtos = await Produto.findAll();
        console.log("Produtos encontrados: ", produtos);
    } catch (erro) {
        console.log("Falha ao buscar produtos ", erro);
    }
};
export async function leProdutosPorId(id) {
    try{
        const resultado = await Produto.findByPk(id);
        console.log("Produto consultado com sucesso: ", resultado);
    } catch (erro) {
        console.log("Falha ao buscar produto ", erro);
    }
};
export async function atualizaProdutosPorId(id, dadosproduto) {
    try{
        const resultado = await Produto.update(dadosproduto, {where: { id:id }});
        console.log("Produto atualizado com sucesso: ", resultado);
    } catch (erro) {
        console.log("Falha ao atualizar produto ", erro);
    }
};
export async function deletaProdutosPorId(id) {
    try{
        const resultado = await Produto.destroy({where: { id:id }});
        console.log("Produto deletado com sucesso: ", resultado);
    } catch (erro) {
        console.log("Falha ao deletar produto ", erro);
    }
};