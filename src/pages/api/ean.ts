import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  const tipoMetodo = req.method;

  if (tipoMetodo === "GET") {
    try {
        const retornoEan = await prisma.ean.findFirst({
            where: {
                dataUtilizacao: null
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
      await prisma.ean.create({
        data: {
            numero: dataEan.numero,
        }
      });

      res.status(201).json({
        message: 'Novo EAN criado com sucesso 🚀.'
      });
    } catch (error: any) {
      res.status(500).json({ error: `Houve um problema 😭: ${error}` });
    }
  }
  
  // Marca EAN / GTIN Como Já utilizado
  if (tipoMetodo === "PUT") {
    const dataEan = req.body;

    try {
      await prisma.ean.update({
        where: {
            id: dataEan.toString(),
        },
        data: {
            dataUtilizacao: new Date(),
        }
      });

      res.status(201).json({
        message: 'EAN foi marcado com utilizado com sucesso 🚀.'
      });
    } catch (error: any) {
      res.status(500).json({ error: `Houve um problema 😭: ${error}` });
    }
  }
};
