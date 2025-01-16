import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query;
  const tipoMetodo = req.method;

  if(tipoMetodo === 'GET'){
    try {
      const response = await axios({
        method: "get",
        url: "https://www.bling.com.br/Api/v3/produtos?pagina=1",
        headers: {
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
      // CRIA PRODUTO
      const resCadastroProduto = await axios.post("https://www.bling.com.br/Api/v3/produtos", dataNovoProduto,{ headers: {Authorization: `Bearer ${token}`} });

      res.status(201).json({ idProduto: resCadastroProduto.data.data.id, variacoes: resCadastroProduto.data.data.variations.saved });
    } catch (error: any) {
      console.log(error.response)
      res.status(500).json({ erro: error });
    }
  }
  
}
