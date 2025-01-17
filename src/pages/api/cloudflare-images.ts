import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const tipoMetodo = req.method;

  if (tipoMetodo === "POST") {
    const formData = req.body;

    console.log("DADO DO ARQUIVO DE UPLOAD: ",formData)

    try {
      const options = {
        method: "POST",
        url: `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_ACCOUNT_ID}/images/v1`,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLOUDFLARE_TOKEN}`,
        },
        data: formData,
      };
      const response = await axios.request(options);
      res.status(200).json(response);

    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erro });
    }
  }
};
