import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Método de requisição enviado, diferente de POST :/" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res
        .status(400)
        .json({ error: "O arquivo da imagem é necessário" });
    }

    const response = await axios.post(
      "https://api.imgur.com/3/image",
      {
        image,
        type: "base64",
      },
      {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
      }
    );
    console.log(response)
    const { link } = response.data.data;
    res.status(200).json({ url: link });
  } catch (error: any) {
    console.error("Erro de envio:", error.response?.data || error.message);
    res.status(500).json({ error: "Houve um problema no upload da imagem" });
  }
};
