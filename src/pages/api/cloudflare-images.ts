import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const tipoMetodo = req.method;

  if (tipoMetodo === "POST") {

    try {
      const options = {
        method: "POST",
        url: `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_ACCOUNT_ID}/images/v1`,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLOUDFLARE_TOKEN}`,
          "Content-Type": req.headers["content-type"]
        },
        data: req,
      };
      const response = await axios.request(options);
      res.status(200).json(response.data);

    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erro });
    }
  }
};
