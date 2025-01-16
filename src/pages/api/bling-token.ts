import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  async function MySQL(){
    const connection = await mysql.createPool({
      host: process.env.NEXT_PUBLIC_HOST,
      user: process.env.NEXT_PUBLIC_USER,
      database: process.env.NEXT_PUBLIC_DATABASE,
      password: process.env.NEXT_PUBLIC_PASSWORD
    })
  
    return connection
  }

  try {
    const mysql = await MySQL()

    const query = `SELECT access_token AS token from tokens WHERE Sistemas = 'Bling 3'`
    const [ rows ] = await mysql.execute( query )
    
    await mysql.end()

    res.status(200).json(rows);
  } catch (erro: any) {
    res.status(500).json({ error: erro.response.data });
  }
}
