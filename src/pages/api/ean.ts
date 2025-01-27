import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import mysql from 'mysql2/promise'
import { Pool } from 'pg'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  const tipoMetodo = req.method;

  async function DatabaseSQL(){
    // const connectionMysql = await mysql.createPool({
    //   host: process.env.NEXT_PUBLIC_HOST,
    //   user: process.env.NEXT_PUBLIC_USER,
    //   database: process.env.NEXT_PUBLIC_DATABASE,
    //   password: process.env.NEXT_PUBLIC_PASSWORD
    // })
    
    const connectionPostgre = await new Pool({
      host: process.env.NEXT_PUBLIC_PG_HOST,
      user: process.env.NEXT_PUBLIC_PG_USER,
      database: process.env.NEXT_PUBLIC_PG_DATABASE,
      password: process.env.NEXT_PUBLIC_PG_PASSWORD,
      port: Number(process.env.NEXT_PUBLIC_PG_PORT)
    })
  
    return connectionPostgre
  }

  if (tipoMetodo === "GET") {
    const { quantidadeeans } = req.query;
    
    try {
      const database = await DatabaseSQL()

      if(quantidadeeans === 'true'){
        const query = `SELECT count(*) FROM ean LIMIT 1`
        const rows = await database.query(query)
        const resultado = rows.rows[0];
        res.status(200).json(resultado);
      }else{
        const query = `SELECT * FROM ean WHERE data IS NULL ORDER BY id ASC LIMIT 1`
        const rows = await database.query(query)
        const resultado = rows.rows[0];
        res.status(200).json(resultado);
      }

    } catch (error: any) {
      res.status(500).json({ error: `Houve um problema 😭: ${error}` });
    }
  }

  // Adiciona Novo EAN / GTIN
  if (tipoMetodo === "POST") {
    const dataEan = req.body;

    //Concatenas os números EAN's para serem inseridos na Query de Values
    const dadosEansFormatados = dataEan.map(
      (numero:any, chave:any) => {
        return ( (dataEan !== null) && (dataEan.length) === chave+1) ? `(${numero})` :`(${numero}),` 
      }
    )   
    const valoresQuery = dadosEansFormatados.join(' ');
  
    try {
      const database = await DatabaseSQL()

      const query = `INSERT INTO ean (numero) VALUES ${valoresQuery}`
      const rows = await database.query( query )
  
      res.status(200).json(rows);
    } catch (erro: any) {
      console.log(erro)
      res.status(500).json({ erro });
    }
  }
  
  // Marca EAN / GTIN Como Já utilizado
  if (tipoMetodo === "PUT") {
    const { idEan, sku } = req.body;

    try{
      console.log('NÚMERO DO EAN: ', idEan)
      console.log('CÓDIGO DO SKU: ', sku)

      const database = await DatabaseSQL()

      const query = `UPDATE ean SET data = CURRENT_TIMESTAMP, sku = '${sku}' WHERE id = ${idEan}`
      const rows = await database.query( query )
  
      res.status(200).json(rows);

      res.status(201).json({
        message: 'EAN foi marcado com utilizado com sucesso 🚀.'
      });
    } catch (error: any) {
      res.status(500).json({ error: `Houve um problema 😭: ${error}` });
    }
  }
};
