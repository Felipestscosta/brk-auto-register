import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query;
  const tipoMetodo = req.method;
  const data = req.body;

  if(tipoMetodo === 'POST'){

    try {
      const response = await axios({
        method: "POST",
        url: `https://bling.com.br/Api/v3/estoques`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data:{
          produto: {
            id: data.id
          },
          deposito: {
            id: 14887422922
          },
          operacao: "B",
          quantidade: 1000,
        }
      });
      return res.status(201).json(response.data);
    } catch (error: any) {
      console.log('Erro ao atualizar estoque', error)
      res.status(500).json({ erro: error?.data });
    }
  }

  
}
