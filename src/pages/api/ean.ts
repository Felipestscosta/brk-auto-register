import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import mysql from 'mysql2/promise'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  const tipoMetodo = req.method;

  async function MySQL(){
    const connection = await mysql.createPool({
      host: process.env.NEXT_PUBLIC_HOST,
      user: process.env.NEXT_PUBLIC_USER,
      database: process.env.NEXT_PUBLIC_DATABASE,
      password: process.env.NEXT_PUBLIC_PASSWORD
    })
  
    return connection
  }

  if (tipoMetodo === "GET") {
    try {
        const retornoEan = await prisma.ean.findFirst({
            where: {
                data_utilizacao: null
            }
        })


      res.status(200).json({ data: retornoEan});
    } catch (error: any) {
      res.status(500).json({ error: `Houve um problema 😭: ${error.response.data}` });
    }
  }

  // Adiciona Novo EAN / GTIN
  if (tipoMetodo === "POST") {
    const dataEan = req.body;
    
      try {
        const mysql = await MySQL()

        console.log('NUMERO DO EAN IMPORTADO', dataEan)
    
        const query = `INSERT INTO ean (numero) VALUES ('${dataEan.numero}');`
        const [ rows ] = await mysql.execute( query )
        
        await mysql.end()
    
        res.status(200).json(rows);
      } catch (erro: any) {
        console.log(erro)
        res.status(500).json({ erro });
      }
  }
  
  // Marca EAN / GTIN Como Já utilizado
  if (tipoMetodo === "PUT") {
    const { dataEan } = req.body;

    console.log('NÚMERO DO EAN: ', dataEan)

    try {
      await prisma.ean.update({
        where: {
          id: `${dataEan}`,
        },
        data: {
          data_utilizacao: new Date(),
        },
      })

      res.status(201).json({
        message: 'EAN foi marcado com utilizado com sucesso 🚀.'
      });
    } catch (error: any) {
      res.status(500).json({ error: `Houve um problema 😭: ${error}` });
    }
  }
};
