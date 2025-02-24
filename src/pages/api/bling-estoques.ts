import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query;
  const tipoMetodo = req.method;
  const data = req.body;

  if(tipoMetodo === 'POST'){
    try {
      await axios.post(
        'https://bling.com.br/Api/v3/estoques',
        {
          "produto": {
            "id": data.id
          },
          "deposito": {
            "id": 14887422922
          },
          "operacao": "B",
          "quantidade": 1000,
        }
        ,
        { headers: {Authorization: `Bearer ${token}`} }
      )

      res.status(201).json('Estoque Adicionado');
    } catch (error: any) {
      res.status(500);
    }
  }

  
}
