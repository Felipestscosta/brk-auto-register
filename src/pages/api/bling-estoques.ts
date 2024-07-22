import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query;
  const { data } = req.body;
  const tipoMetodo = req.method;

  // Adiciona Novo Estoque
  if(tipoMetodo === 'POST'){
    const dataNovoProduto = req.body;

    console.log(dataNovoProduto)

    // try {

    //   // Adiciona estoque
    //   const estoque = data.quantidade;
    //   const idProduto = data.id;

    //   const options = {
    //     method: 'POST',
    //     url: 'https://bling.com.br/Api/v3/estoques',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`
    //     },
    //     data: {
    //       produto: {id: idProduto},
    //       deposito: {id: 14887659608}, // Deposito Padrão
    //       operacao: 'B', // B = Balanço
    //       preco: 0,
    //       custo: 0,
    //       quantidade: parseFloat(estoque),
    //       observacoes: 'Estoque adicionado automaticamente pelo Auto Register'
    //     }
    //   };

    //   try {
    //     await axios.request(options).then(function(res) {
    //       console.log(res)
    //     });        
    //   } catch (error) {
    //     console.log("ERROOOOOO ===============> ", error)
    //   }

    //   res.status(201).json({ produto_cadastrado: idProduto });
    // } catch (error: any) {
    //   console.log(error.response)
    //   res.status(500).json({ erro: error });
    // }
  }

  
}
