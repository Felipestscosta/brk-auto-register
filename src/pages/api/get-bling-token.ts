// pages/api/get-bling-token.ts
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;

  const url = 'https://www.bling.com.br/Api/v3/oauth/token';
  const clientId = 'c31b56f93fafffa81d982a9e409980829942169c';
  const clientSecret = '38c0cfaa7f40a7c452b6496de75125ad08f17bb3d4d33ed1d98209056120';

  const data = new URLSearchParams();
  data.append('grant_type', 'authorization_code');
  data.append('code', code);

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    }
  };

  try {
    const response = await axios.post(url, data, config);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Erro ao obter token:', error);
    res.status(500).json({ error: 'Erro ao obter token' });
  }
}
