// // pages/api/get-bling-token.ts
// import axios from 'axios';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const { code } = req.query;
//   const clientId = 'c31b56f93fafffa81d982a9e409980829942169c';
//   const clientSecret = 'baacb0faf14d5c8de72f58605931db6f7262e9edd535e05665edb0a4a568'; 

//   try {
//     const response = await axios({
//       method: "POST",
//       url: "https://www.bling.com.br/Api/v3/oauth/token",
//       data: {
//         grant_type: 'authorization_code',
//         code: code
//       },
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
//       }
//     })

//     //console.log('Retorno da Requisiçãoo::::::::::::::::', response)

//     res.status(200).json(response.data);
//   } catch (err) {
//     const erroResposta = err.response.data.error.type;

//     res.status(500).json({ error: erroResposta });
//   }
// }
