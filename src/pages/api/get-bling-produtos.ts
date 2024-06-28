import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query;
  const tipoMetodo = req.method;

  if(tipoMetodo === 'GET'){
    try {
      const response = await axios({
        method: "get",
        url: "https://www.bling.com.br/Api/v3/produtos?pagina=1",
        headers: {
          client_id: "c31b56f93fafffa81d982a9e409980829942169c",
          client_secret: "baacb0faf14d5c8de72f58605931db6f7262e9edd535e05665edb0a4a568",
          Authorization: `Bearer ${token}`,
        },
      });
  
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Erro ao obter token:', error);
      res.status(500).json({ error: 'Erro ao obter token' });
    }
  }
  
  // Cria novo Produto
  if(tipoMetodo === 'POST'){
    const dataNovoProduto = req.body;

    try {
      const resProduto = await axios.post("https://www.bling.com.br/Api/v3/produtos", dataNovoProduto,{ headers: {Authorization: `Bearer ${token}`} });

      // Adciona estoque
      // const estoque = dataNovoProduto.estoque.maximo;
      const idProduto = resProduto.data.id;

      // const resEstoque = await axios.post("https://www.bling.com.br/Api/v3/estoques", { produto: { id: idProduto }, deposito: { id: 14887659608 }, operacao: "B", quantidade: estoque },{ headers: {Authorization: `Bearer ${token}`} });

      res.status(201).json({ produto_cadastrado: idProduto });
    } catch (error) {
      res.status(500).json({ erro: error });
    }
  }

  
}
