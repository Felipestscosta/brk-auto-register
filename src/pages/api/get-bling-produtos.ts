// pages/api/get-bling-token.ts
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query;
  const tipoMetodo = req.method;

  if(tipoMetodo === 'GET'){
    try {
      const response = await axios({
        method: "get",
        url: "https://www.bling.com.br/Api/v3/produtos?pagina=1",
        headers: {
          client_id: "c31b56f93fafffa81d982a9e409980829942169c",
          client_secret:
            "38c0cfaa7f40a7c452b6496de75125ad08f17bb3d4d33ed1d98209056120",
          Authorization: `Bearer ${token}`,
        },
      });
      
  
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Erro ao obter token:', error);
      res.status(500).json({ error: 'Erro ao obter token' });
    }
  }
  
  if(tipoMetodo === 'POST'){
    const dataNovoProduto = req.body;

    try {
      const response = await axios({
        method: "POST",
        url: "https://www.bling.com.br/Api/v3/produtos",
        headers: {
          client_id: "c31b56f93fafffa81d982a9e409980829942169c",
          client_secret: "38c0cfaa7f40a7c452b6496de75125ad08f17bb3d4d33ed1d98209056120",
          Authorization: `Bearer ${token}`,
        },
        data: {
          "id": 123456789,
          "nome": "Produto 1",
          "codigo": "CODE_123",
          "preco": 1,
          "tipo": "P",
          "situacao": "A",
          "formato": "S",
          "descricaoCurta": "Descrição curta",
          "dataValidade": "2020-01-01",
          "unidade": "UN",
          "pesoLiquido": 1,
          "pesoBruto": 1,
          "volumes": 1,
          "itensPorCaixa": 1,
          "gtin": "1234567890123",
          "gtinEmbalagem": "1234567890123",
          "tipoProducao": "P",
          "condicao": 0,
          "freteGratis": false,
          "marca": "Marca",
          "descricaoComplementar": "Descrição complementar",
          "linkExterno": "https://www.google.com",
          "observacoes": "Observações",
          "descricaoEmbalagemDiscreta": "Produto teste",
          "categoria": {
            "id": 123456789
          },
          "estoque": {
            "minimo": 1,
            "maximo": 100,
            "crossdocking": 1,
            "localizacao": "14A"
          },
          "actionEstoque": "",
          "dimensoes": {
            "largura": 1,
            "altura": 1,
            "profundidade": 1,
            "unidadeMedida": 1
          },
          "tributacao": {
            "origem": 0,
            "nFCI": "",
            "ncm": "",
            "cest": "",
            "codigoListaServicos": "",
            "spedTipoItem": "",
            "codigoItem": "",
            "percentualTributos": 0,
            "valorBaseStRetencao": 0,
            "valorStRetencao": 0,
            "valorICMSSubstituto": 0,
            "codigoExcecaoTipi": "",
            "classeEnquadramentoIpi": "",
            "valorIpiFixo": 0,
            "codigoSeloIpi": "",
            "valorPisFixo": 0,
            "valorCofinsFixo": 0,
            "codigoANP": "",
            "descricaoANP": "",
            "percentualGLP": 0,
            "percentualGasNacional": 0,
            "percentualGasImportado": 0,
            "valorPartida": 0,
            "tipoArmamento": 0,
            "descricaoCompletaArmamento": "",
            "dadosAdicionais": "",
            "grupoProduto": {
              "id": 123456789
            }
          },
          "midia": {
            "video": {
              "url": "https://www.youtube.com/watch?v=1"
            },
            "imagens": {
              "externas": [
                {
                  "link": "https://shutterstock.com/lalala123"
                }
              ]
            }
          },
          "linhaProduto": {
            "id": 1
          },
          "estrutura": {
            "tipoEstoque": "F",
            "lancamentoEstoque": "A",
            "componentes": [
              {
                "produto": {
                  "id": 1
                },
                "quantidade": 2.1
              }
            ]
          },
          "camposCustomizados": [
            {
              "idCampoCustomizado": 123456789,
              "idVinculo": "Utilize para atualizar o valor existente. Ex: 123456789",
              "valor": "256GB",
              "item": "Opção A"
            }
          ],
          "variacoes": [
            {
              "id": 123456789,
              "nome": "Produto 1",
              "codigo": "CODE_123",
              "preco": 1,
              "tipo": "P",
              "situacao": "A",
              "formato": "S",
              "descricaoCurta": "Descrição curta",
              "dataValidade": "2020-01-01",
              "unidade": "UN",
              "pesoLiquido": 1,
              "pesoBruto": 1,
              "volumes": 1,
              "itensPorCaixa": 1,
              "gtin": "1234567890123",
              "gtinEmbalagem": "1234567890123",
              "tipoProducao": "P",
              "condicao": 0,
              "freteGratis": false,
              "marca": "Marca",
              "descricaoComplementar": "Descrição complementar",
              "linkExterno": "https://www.google.com",
              "observacoes": "Observações",
              "descricaoEmbalagemDiscreta": "Produto teste",
              "categoria": {
                "id": 123456789
              },
              "estoque": {
                "minimo": 1,
                "maximo": 100,
                "crossdocking": 1,
                "localizacao": "14A"
              },
              "actionEstoque": "",
              "dimensoes": {
                "largura": 1,
                "altura": 1,
                "profundidade": 1,
                "unidadeMedida": 1
              },
              "tributacao": {
                "origem": 0,
                "nFCI": "",
                "ncm": "",
                "cest": "",
                "codigoListaServicos": "",
                "spedTipoItem": "",
                "codigoItem": "",
                "percentualTributos": 0,
                "valorBaseStRetencao": 0,
                "valorStRetencao": 0,
                "valorICMSSubstituto": 0,
                "codigoExcecaoTipi": "",
                "classeEnquadramentoIpi": "",
                "valorIpiFixo": 0,
                "codigoSeloIpi": "",
                "valorPisFixo": 0,
                "valorCofinsFixo": 0,
                "codigoANP": "",
                "descricaoANP": "",
                "percentualGLP": 0,
                "percentualGasNacional": 0,
                "percentualGasImportado": 0,
                "valorPartida": 0,
                "tipoArmamento": 0,
                "descricaoCompletaArmamento": "",
                "dadosAdicionais": "",
                "grupoProduto": {
                  "id": 123456789
                }
              },
              "midia": {
                "video": {
                  "url": "https://www.youtube.com/watch?v=1"
                },
                "imagens": {
                  "externas": [
                    {
                      "link": "https://shutterstock.com/lalala123"
                    }
                  ]
                }
              },
              "linhaProduto": {
                "id": 1
              },
              "estrutura": {
                "tipoEstoque": "F",
                "lancamentoEstoque": "A",
                "componentes": [
                  {
                    "produto": {
                      "id": 1
                    },
                    "quantidade": 2.1
                  }
                ]
              },
              "camposCustomizados": [
                {
                  "idCampoCustomizado": 123456789,
                  "idVinculo": "Utilize para atualizar o valor existente. Ex: 123456789",
                  "valor": "256GB",
                  "item": "Opção A"
                }
              ],
              "variacao": {
                "nome": "Tamanho:G;Cor:Verde",
                "ordem": 1,
                "produtoPai": {
                  "cloneInfo": true
                }
              }
            }
          ]
        }
      });
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Erro ao obter token:', error);
      res.status(500).json({ error: 'Erro ao obter token' });
    }
  }

  
}
