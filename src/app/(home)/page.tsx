"use client";
import { Barn, BaseballCap, CircleNotch, Empty, FileArrowDown, FishSimple, Hoodie, ListPlus, MicrosoftExcelLogo, Motorcycle, Tree, TShirt, UploadSimple } from "@phosphor-icons/react";
import { SubmitHandler, useForm } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";

import { writeFileXLSX, utils, readFile } from "xlsx";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Cloudflare from 'cloudflare'
// import ean from "@/pages/api/ean";

type esquemaDeDadosFormulario = {
  codigo: string;
  titulo: string;
  estoque: string;
  preco: string;
  imagens: any;

  tamanho_masculino: string;
  tamanho_feminino: string;
  tamanho_infantil: string;

  cor_branco: string;
  cor_preto: string;
  cor_azul: string;

  metatitle: string;
  metadescription: string;
  metakeywords: string;
};

const relacaoDeTamanhos = [
  {
    masculino: {
      tamanhos: [
        {
          nome: "PP",
          sigla_camisa: "PP",
        },
        {
          nome: "P",
          sigla_camisa: "P",
        },
        {
          nome: "M",
          sigla_camisa: "M",
        },
        {
          nome: "G",
          sigla_camisa: "G",
        },
        {
          nome: "GG",
          sigla_camisa: "GG",
        },
        {
          nome: "G1",
          sigla_camisa: "G1",
        },
        {
          nome: "G2",
          sigla_camisa: "G2",
        }
      ],
    },
    feminino: {
      tamanhos: [
        {
          nome: "PP",
          sigla_camisa: "BLPP",
        },
        {
          nome: "P",
          sigla_camisa: "BLP",
        },
        {
          nome: "M",
          sigla_camisa: "BLM",
        },
        {
          nome: "G",
          sigla_camisa: "BLG",
        },
        {
          nome: "GG",
          sigla_camisa: "BLGG",
        },
        {
          nome: "G1",
          sigla_camisa: "BLG1",
        },
        {
          nome: "G2",
          sigla_camisa: "BLG2",
        },
      ],
    },
    infantil: {
      tamanhos: [
        {
          nome: "PP",
          sigla_camisa: "IPP",
        },
        {
          nome: "P",
          sigla_camisa: "IP",
        },
        {
          nome: "M",
          sigla_camisa: "IM",
        },
        {
          nome: "G",
          sigla_camisa: "IG",
        },
        {
          nome: "GG",
          sigla_camisa: "IGG",
        },
        {
          nome: "G1",
          sigla_camisa: "IG1",
        },
        {
          nome: "G2",
          sigla_camisa: "IG2",
        },
      ],
    },
  },
];

const relacaoDeCores = [
  {
    branco: {
      tamanhos: [
        {
          cor_nome: "Branco",
          tamanho: "P",
        },
        {
          cor_nome: "Branco",
          tamanho: "M",
        },
        {
          cor_nome: "Branco",
          tamanho: "G",
        },
        {
          cor_nome: "Branco",
          tamanho: "GG",
        },
        {
          cor_nome: "Branco",
          tamanho: "G1",
        },
        {
          cor_nome: "Branco",
          tamanho: "G2",
        },
      ],
    },
    preto: {
      tamanhos: [
        {
          cor_nome: "Preto",
          tamanho: "P",
        },
        {
          cor_nome: "Preto",
          tamanho: "M",
        },
        {
          cor_nome: "Preto",
          tamanho: "G",
        },
        {
          cor_nome: "Preto",
          tamanho: "GG",
        },
        {
          cor_nome: "Preto",
          tamanho: "G1",
        },
        {
          cor_nome: "Preto",
          tamanho: "G2",
        },
      ],
    },
    azul: {
      tamanhos: [
        {
          cor_nome: "Azul",
          tamanho: "P",
        },
        {
          cor_nome: "Azul",
          tamanho: "M",
        },
        {
          cor_nome: "Azul",
          tamanho: "G",
        },
        {
          cor_nome: "Azul",
          tamanho: "GG",
        },
        {
          cor_nome: "Azul",
          tamanho: "G1",
        },
        {
          cor_nome: "Azul",
          tamanho: "G2",
        },
      ],
    },
  },
];

const precos = {
  camisetaAlgodao: 119.9,
  camisa: 159.9,
  camiseta: 99.9,
  bone: 129.9,
  cortaVento: 229.9,
};

const client = new Cloudflare({
  apiEmail: process.env.NEXT_PUBLIC_EMAIL,
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

export default function Home() {
  const [files, setFiles] = useState<any[]>([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });
  const [informacoesSeo, setInformacoesSeo] = useState(["", "", ""]);
  const [tipoDeProduto, setTipoDeProduto] = useState("camisa");
  const [tipoAlgodao, setTipoAlgodao] = useState("comalgodao");
  const [tipoCadastro, setTipoCadastro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [loja, setLoja] = useState("");
  const [data, setData] = useState<any[]>([]);

  //Integração IA para Geração de SEO
  function geraSEO(tituloProduto: any) {
    if (tituloProduto.length > 30) {
      axios
        .post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCrzFpg0GtlbYO5ydvztSAEQtWD0GvOlc4", {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Com base nesse título '${tituloProduto}', meta title, meta description e metakeywords(separados por vírgula). Sempre respeitando a quantidade de caracteres visto como boa prática em otimizações de SEO para e-commerces. Forneça as informacoes de formas simples, separando o valor de cada meta com o símbolo '|' , não deixe espaços em branco entre os separadores '|', não é necessário usar formatadores de markdown por exemplo '##' e '\n', e não é necessário colocar o nome da informação. É importante adicionar a marca de acordo com o nicho estabelecido nas meta keywords`,
                },
              ],
            },
          ],
          systemInstruction: {
            role: "user",
            parts: [
              {
                text: "Somos uma empresa, e temos 3 principais marcas de atuação:\n\nBRK Agro: Atuamos principalmente com produtos voltados para pessoas do campo , como camisas, camisetas, botinas, bonés entre outros acessórios.\n\nBRK Fishing: Atuando mais no nicho de pescadores com venda de produtos como camisas, camisetas, bonés, botinas, varas, molinetes, carretilhas, caixas térmicas, tubenecks, black masks, iscas, anzóis entre outros acessórios para pesca.\n\nBRK Motors: Voltado mais para pessoas do nicho de motociclismo, que faz expedições e praticam esporte ao ar livre, vendendo produtos como camisas, camisetas, botinas, tubenecks, bonés e outros acessórios.",
              },
            ],
          },
        })
        .then((data: any) => {
          let retornoDadosIa = data.data.candidates[0].content.parts[0].text;
          setInformacoesSeo(retornoDadosIa.split("|"));
        });
    }
  }

  //Captura e Armazena o Token do Bling
  function getToken() {
    axios.get(`/api/bling-token`).then((res: any) => {
      const token = res.data[0].token;
      localStorage.setItem("tokenBling", token);
    });
  }

  useEffect(() => {
    () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  });

  //Salva Produto no Bling
  async function saveProdutos(data: any) {
    const retornoCadastroProduto: any = await axios.post(`/api/bling-produtos?token=${localStorage.getItem("tokenBling")}`, data);
    const variacoes = retornoCadastroProduto.data.variacoes;
    const quantidadeVariacoes = Object.keys(variacoes).length;

    if (quantidadeVariacoes !== 0) {
      for (let i = 0; i < quantidadeVariacoes; i++) {
        const variacao = variacoes[i];
        try {
          if (!variacao.nomeVariacao.includes("G3") && !variacao.nomeVariacao.includes("G4")) {
            await axios.post(`/api/bling-estoques?token=${localStorage.getItem("tokenBling")}`, { id: variacao.id });
          }
        } catch (error) {
          console.error(`Erro na requisição para variação ${variacao.id}:`, error);
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } else {
      axios.post(`/api/bling-estoques?token=${localStorage.getItem("tokenBling")}`, { id: retornoCadastroProduto.idProduto });
    }

    if (retornoCadastroProduto.status === 201) {
      alert("Produto Cadastrado com sucesso 🚀");
      setCarregando(false);
    }
  }

  //Converte arquivo de Imagem para Base64 para subir no Imgur
  function fileToBase64(file:any) {
    return new Promise((resolve, reject) => {
      const reader: any = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove o cabeçalho "data:image/png;base64,"
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  //Captura do Formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<esquemaDeDadosFormulario>();

  const onSubmit: SubmitHandler<esquemaDeDadosFormulario> = async (data) => {
    setCarregando(true);

    //Imagens Bling
    let todasAsImagensBling = [];
    var imagensMasculinasBling: any = [];
    var imagensFemininasBling: any = [];
    var imagensInfantisBling: any = [];

    var imagensCorBrancoBling: any = [];
    var imagensCorPretoBling: any = [];
    var imagensCorAzulBling: any = [];

    //Imagens Planilha
    let todasAsImagens = [];
    var imagensMasculinas: any = [];
    var imagensFemininas: any = [];
    var imagensInfantis: any = [];

    var imagensCorBranco: any = [];
    var imagensCorPreto: any = [];
    var imagensCorAzul: any = [];

    const qtdFiles = Object.keys(files).length;

    //Ordena as Imagens em Ordem Ascendente
    const filesOrdenados = files.toSorted((a, b) => {
      const numA = parseInt(a.name.split("_")[0], 10);
      const numB = parseInt(b.name.split("_")[0], 10);

      return numA - numB;
    });

    //Upload das imagens separando por Gêneros e Cores por tipo de produto
    for (let i = 0; i < qtdFiles; i++) {
      const file = filesOrdenados[i];
      const formData = new FormData();
      formData.append("file", file);
      const fileData = await fileToBase64(file);

      try {
        const response = await axios.post(`/api/imgur-upload`, {image: fileData});
        const urlExternaImagem = response.data.url;
        
        // Imagens por Gênero
        if (file.name.toLowerCase().includes("masc")) {
          imagensMasculinas.push(urlExternaImagem);
          imagensMasculinasBling.push({ link: urlExternaImagem });
        }

        if (file.name.toLowerCase().includes("fem")) {
          imagensFemininas.push(urlExternaImagem);
          imagensFemininasBling.push({ link: urlExternaImagem });
        }

        if (file.name.toLowerCase().includes("inf")) {
          imagensInfantis.push(urlExternaImagem);
          imagensInfantisBling.push({ link: urlExternaImagem });
        }

        // Imagens por Cores
        if (file.name.toLowerCase().includes("branco")) {
          imagensCorBranco.push(urlExternaImagem);
          imagensCorBrancoBling.push({ link: urlExternaImagem });
        }

        if (file.name.toLowerCase().includes("preto")) {
          imagensCorPreto.push(urlExternaImagem);
          imagensCorPretoBling.push({ link: urlExternaImagem });
        }

        if (file.name.toLowerCase().includes("azul")) {
          imagensCorAzul.push(urlExternaImagem);
          imagensCorAzulBling.push({ link: urlExternaImagem });
        }

        todasAsImagens.push(urlExternaImagem);

        todasAsImagensBling.push({ link: urlExternaImagem });
      } catch (error) {
        console.error("Erro no Upload da Imagem: ", error);
      }
    }

    // Dados da Planilha
    var preco = parseFloat(data.preco.replace("R$", "").replace(".", "").replace(",", "."));
    var estoque = parseInt(data.estoque);
    const primeiraLinhaDaPlanilha = [
      {
        codigo: data.codigo.toLocaleUpperCase(),
        descricao: data.titulo,
        estoque: parseFloat("0"),
        preco: preco,
        produto_variacao: "Produto",
        tipo_producao: "Terceiros", // backlog Bling 1
        tipo_do_item: "Mercadoria para Revenda",
        codigo_pai: "",
        marca: loja,
        url_imagens_externas: todasAsImagens.join("|"), //backlog clodinary
        grupo_de_produtos: (tipoDeProduto === "camisa" && "Camisa Master") || ((tipoDeProduto === "camiseta" && tipoAlgodao === 'comalgodao') && "Camiseta Algodão") ||(tipoDeProduto === "camiseta" && "Camiseta Casual") || (tipoAlgodao === "comalgodao" && "Camiseta Algodão"),
        ncm: (tipoDeProduto === "camiseta" && tipoAlgodao === 'comalgodao') ? '6205.20.00' : '6101.30.00'
      },
    ];

    var variacaoDeProduto: any = [...primeiraLinhaDaPlanilha];

    var dadosVariacoesBling: any = [];
    if (tipoDeProduto === "camisa") {
      if (data.tamanho_masculino) {
        relacaoDeTamanhos[0].masculino.tamanhos.map(async (item) => {
          // var retornoCapturaEan = await axios.get("/api/ean");
          // var idEAN = retornoCapturaEan.data.data.id;
          // var numeroEAN = retornoCapturaEan.data.data.numero;

          //Sinaliza EAN Como Utilizado
          // if (idEAN) {
          //   await axios.put("/api/ean", { dataEan: idEAN });
          // }

          //Variacoes para Planilha
          variacaoDeProduto.push({
            codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
            descricao: `Gênero:Masculino;Tamanho:${item.nome}`,
            estoque: estoque,
            preco: preco,
            produto_variacao: "Variação",
            tipo_producao: "Terceiros", // backlog Bling 1
            tipo_do_item: "Mercadoria para Revenda",
            codigo_pai: data.codigo.toLocaleUpperCase(),
            url_imagens_externas: imagensMasculinas.join("|"),
            grupo_de_produtos: "Camisa Master",
          });

          // Dados Bling
          dadosVariacoesBling.push({
            codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
            formato: "S",
            gtin: "1234567890123",
            gtinEmbalagem: "1234567890123",
            midia: {
              imagens: {
                externas: imagensMasculinasBling,
              },
            },
            variacao: {
              nome: `Gênero:Masculino;Tamanho:${item.nome}`,
              ordem: 1,
              produtoPai: {
                cloneInfo: true,
              },
            },
          });
        });
      }

      if (data.tamanho_feminino) {
        relacaoDeTamanhos[0].feminino.tamanhos.map((item) => {
          //Variacoes para Planilha
          variacaoDeProduto.push({
            codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
            descricao: `Gênero:Feminino;Tamanho:Baby Look ${item.nome}`,
            estoque: estoque,
            preco: preco,
            produto_variacao: "Variação",
            tipo_producao: "Terceiros", // backlog Bling 1
            tipo_do_item: "Mercadoria para Revenda",
            codigo_pai: data.codigo.toLocaleUpperCase(),
            url_imagens_externas: imagensFemininas.join("|"), //backlog clodinary,
            grupo_de_produtos: "Camisa Master",
          });

          // Dados Bling
          dadosVariacoesBling.push({
            codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
            formato: "S",
            gtin: "1234567890123",
            gtinEmbalagem: "1234567890123",
            midia: {
              imagens: {
                externas: imagensFemininasBling,
              },
            },
            variacao: {
              nome: `Gênero:Feminino;Tamanho:${item.nome}`,
              ordem: 1,
              produtoPai: {
                cloneInfo: true,
              },
            },
          });
        });
      }

      if (data.tamanho_infantil) {
        relacaoDeTamanhos[0].infantil.tamanhos.map((item) => {
          variacaoDeProduto.push({
            codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
            descricao: `Gênero:Infantil;Tamanho:Infantil ${item.nome}`,
            estoque: estoque,
            preco: preco,
            produto_variacao: "Variação",
            tipo_producao: "Terceiros", // backlog Bling 1
            tipo_do_item: "Mercadoria para Revenda",
            codigo_pai: data.codigo.toLocaleUpperCase(),
            url_imagens_externas: imagensInfantis.join("|"), //backlog clodinary,
            grupo_de_produtos: "Camisa Master",
          });

          // Dados Bling
          dadosVariacoesBling.push({
            codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
            formato: "S",
            gtin: "1234567890123",
            gtinEmbalagem: "1234567890123",
            midia: {
              imagens: {
                externas: imagensInfantisBling,
              },
            },
            variacao: {
              nome: `Gênero:Infantil;Tamanho:${item.nome}`,
              ordem: 1,
              produtoPai: {
                cloneInfo: true,
              },
            },
          });
        });
      }
    }

    if (tipoDeProduto === "camiseta") {
      if (tipoAlgodao === "semalgodao") {
        if (data.tamanho_masculino) {
          relacaoDeTamanhos[0].masculino.tamanhos.map((item) => {
            variacaoDeProduto.push({
              codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
              descricao: `Gênero:Masculino;Tamanho:${item.nome}`,
              estoque: estoque,
              preco: preco,
              produto_variacao: "Variação",
              tipo_producao: "Terceiros", // backlog Bling 1
              tipo_do_item: "Mercadoria para Revenda",
              codigo_pai: data.codigo.toLocaleUpperCase(),
              url_imagens_externas: imagensMasculinas.join("|"), //backlog clodinary,
              grupo_de_produtos: "Camiseta Casual",
            });

            // Dados Bling
            dadosVariacoesBling.push({
              codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
              formato: "S",
              gtin: "1234567890123",
              gtinEmbalagem: "1234567890123",
              midia: {
                imagens: {
                  externas: imagensMasculinasBling,
                },
              },
              variacao: {
                nome: `Gênero:Masculino;Tamanho:${item.nome}`,
                ordem: 1,
                produtoPai: {
                  cloneInfo: true,
                },
              },
            });
          });
        }

        if (data.tamanho_feminino) {
          relacaoDeTamanhos[0].feminino.tamanhos.map((item) => {
            variacaoDeProduto.push({
              codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
              descricao: `Gênero:Feminino;Tamanho:Baby Look ${item.nome}`,
              estoque: estoque,
              preco: preco,
              produto_variacao: "Variação",
              tipo_producao: "Terceiros", // backlog Bling 1
              tipo_do_item: "Mercadoria para Revenda",
              codigo_pai: data.codigo.toLocaleUpperCase(),
              marca: "Brk Agro", // backlog Loja
              url_imagens_externas: imagensFemininas.join("|"), //backlog clodinary,
              grupo_de_produtos: "Camiseta Casual",
            });

            // Dados Bling
            dadosVariacoesBling.push({
              codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
              formato: "S",
              gtin: "1234567890123",
              gtinEmbalagem: "1234567890123",
              midia: {
                imagens: {
                  externas: imagensFemininasBling,
                },
              },
              variacao: {
                nome: `Gênero:Feminino;Tamanho:${item.nome}`,
                ordem: 1,
                produtoPai: {
                  cloneInfo: true,
                },
              },
            });
          });
        }

        if (data.tamanho_infantil) {
          relacaoDeTamanhos[0].infantil.tamanhos.map((item) => {
            variacaoDeProduto.push({
              codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
              descricao: `Gênero:Infantil;Tamanho:Infantil ${item.nome}`,
              estoque: estoque,
              preco: preco,
              produto_variacao: "Variação",
              tipo_producao: "Terceiros", // backlog Bling 1
              tipo_do_item: "Mercadoria para Revenda",
              codigo_pai: data.codigo.toLocaleUpperCase(),
              url_imagens_externas: imagensInfantis.join("|"), //backlog clodinary,
              grupo_de_produtos: "Camiseta Casual",
            });

            // Dados Bling
            dadosVariacoesBling.push({
              codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
              formato: "S",
              gtin: "1234567890123",
              gtinEmbalagem: "1234567890123",
              midia: {
                imagens: {
                  externas: imagensInfantisBling,
                },
              },
              variacao: {
                nome: `Gênero:Infantil;Tamanho:${item.nome}`,
                ordem: 1,
                produtoPai: {
                  cloneInfo: true,
                },
              },
            });
          });
        }
      }

      if (tipoAlgodao === "comalgodao") {
        if (data.cor_preto) {
          relacaoDeCores[0].preto.tamanhos.map((item) => {
            if (item.tamanho !== "PP") {
              variacaoDeProduto.push({
                // codigo: `${data.codigo.toLocaleUpperCase()}-${item.cor_nome.toUpperCase()}-${item.tamanho}`,
                codigo: `${data.codigo.toLocaleUpperCase()}-PREMIUM-${item.cor_nome.toUpperCase()}-${item.tamanho}`,
                descricao: `Cor:${item.cor_nome};Tamanho:${item.tamanho}`,
                estoque: estoque,
                preco: preco,
                produto_variacao: "Variação",
                tipo_producao: "Terceiros", // backlog Bling 1
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: data.codigo.toLocaleUpperCase(),
                url_imagens_externas: imagensCorPreto.join("|"), //backlog clodinary,
                grupo_de_produtos: "Camiseta Algodão",
                ncm: '6205.20.00',
              });
            }

            // Dados Bling
            dadosVariacoesBling.push({
              codigo: `${data.codigo.toLocaleUpperCase()}-${item.cor_nome.toUpperCase()}-${item.tamanho}`,
              formato: "S",
              gtin: "1234567890123",
              gtinEmbalagem: "1234567890123",
              midia: {
                imagens: {
                  externas: imagensCorPretoBling,
                },
              },
              variacao: {
                nome: `Cor:${item.cor_nome};Tamanho:${item.tamanho}`,
                ordem: 1,
                produtoPai: {
                  cloneInfo: true,
                },
              },
            });
          });
        }

        if (data.cor_azul) {
          relacaoDeCores[0].azul.tamanhos.map((item) => {
            if (item.tamanho !== "PP") {
              variacaoDeProduto.push({
                // codigo: `${data.codigo.toLocaleUpperCase()}-${item.cor_nome.toUpperCase()}-${item.tamanho}`,
                codigo: `${data.codigo.toLocaleUpperCase()}-PREMIUM-${item.cor_nome.toUpperCase()}-${item.tamanho}`,
                descricao: `Cor:${item.cor_nome};Tamanho:${item.tamanho}`,
                estoque: estoque,
                preco: preco,
                produto_variacao: "Variação",
                tipo_producao: "Terceiros", // backlog Bling 1
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: data.codigo.toLocaleUpperCase(),
                marca: "Brk Agro", // backlog Loja
                url_imagens_externas: imagensCorAzul.join("|"), //backlog clodinary,
                grupo_de_produtos: "Camiseta Algodão",
                ncm: '6205.20.00',
              });

              // Dados Bling
              dadosVariacoesBling.push({
                codigo: `${data.codigo.toLocaleUpperCase()}_${item.cor_nome.toUpperCase()}_${item.tamanho}`,
                formato: "S",
                gtin: "1234567890123",
                gtinEmbalagem: "1234567890123",
                midia: {
                  imagens: {
                    externas: imagensCorAzulBling,
                  },
                },
                variacao: {
                  nome: `Cor:${item.cor_nome};Tamanho:${item.tamanho}`,
                  ordem: 1,
                  produtoPai: {
                    cloneInfo: true,
                  },
                },
              });
            }
          });
        }

        if (data.cor_branco) {
          relacaoDeCores[0].branco.tamanhos.map((item) => {
            if (item.tamanho !== "PP") {
              variacaoDeProduto.push({
                // codigo: `${data.codigo.toLocaleUpperCase()}-${item.cor_nome.toUpperCase()}-${item.tamanho}`,
                codigo: `${data.codigo.toLocaleUpperCase()}-PREMIUM-${item.cor_nome.toUpperCase()}-${item.tamanho}`,
                descricao: `Cor:${item.cor_nome};Tamanho:${item.tamanho}`,
                estoque: estoque,
                preco: preco,
                produto_variacao: "Variação",
                tipo_producao: "Terceiros", // backlog Bling 1
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: data.codigo.toLocaleUpperCase(),
                url_imagens_externas: imagensCorBranco.join("|"), //backlog clodinary,
                grupo_de_produtos: "Camiseta Algodão",
                ncm: '6205.20.00',
              });

              // Dados Bling
              dadosVariacoesBling.push({
                codigo: `${data.codigo.toLocaleUpperCase()}_${item.cor_nome.toUpperCase()}_${item.tamanho}`,
                formato: "S",
                gtin: "1234567890123",
                gtinEmbalagem: "1234567890123",
                midia: {
                  imagens: {
                    imagensURL: imagensCorBrancoBling,
                  },
                },
                variacao: {
                  nome: `Cor:${item.cor_nome};Tamanho:${item.tamanho}`,
                  ordem: 1,
                  produtoPai: {
                    cloneInfo: true,
                  },
                },
              });
            }
          });
        }
      }
    }

    const dadosBling = {
      nome: data.titulo,
      codigo: data.codigo.toLocaleUpperCase(),
      preco: preco,
      tipo: "P",
      situacao: "A",
      formato: "V",
      descricaoCurta: "Descrição curta",
      unidade: "UN",
      pesoLiquido: 0.25,
      pesoBruto: 0.25,
      volumes: 1,
      itensPorCaixa: 1,
      gtin: "7794051852802",
      gtinEmbalagem: "7794051852802",
      tipoProducao: "P",
      condicao: 0,
      freteGratis: false,
      marca: loja === "" ? "" : (loja === "agro" && "Brk Agro") || (loja === "fishing" && "Brk Fishing") || (loja === "motors" && "Brk Motors"),
      descricaoComplementar: "Descrição complementar",
      dimensoes: {
        largura: 10,
        altura: 11,
        profundidade: 16,
        unidadeMedida: 1,
      },
      actionEstoque: "T",
      tributacao: {
        origem: 0,
        ncm: (tipoDeProduto === 'Camiseta' && tipoAlgodao === 'comalgodao') ?? '6205.20.00',
        cest: "28.038.00",
        codigoListaServicos: "",
        spedTipoItem: "",
        codigoItem: "",
        valorBaseStRetencao: 0,
        valorStRetencao: 0,
        valorICMSSubstituto: 0,
      },
      midia: {
        imagens: {
          imagensURL: todasAsImagensBling,
        },
      },
      variacoes: dadosVariacoesBling,
    };

    try {
      if (tipoCadastro === "planilha") {
        // console.log("Dados da Planilha:", variacaoDeProduto);

        if (loja === ""){
          alert("Selecione a loja BRK 😓");
          return
        } 
        if (qtdFiles === 0){
          alert("Não esqueça as imagens 🖼️");
          return
        }

        geraPlanilha(variacaoDeProduto, data.codigo.toUpperCase());
      } else if (tipoCadastro === "bling") {
        saveProdutos(dadosBling);
      }
    } catch (error) {
      alert(`Opa, tem algum problema rolando... Chama o dev 😒: ${error}`);
      setCarregando(false);
    } finally {
      setCarregando(false);
    }
  };

  // Planinha
  async function geraPlanilha(dadosDaPlanilha: any, codigoProduto: string) {
    // Gera Planilha do Bling 3
    const rows = Array.from(dadosDaPlanilha).map((row: any) => ({
      ID: "",
      Código: row.codigo, // Dinâmico
      Descrição: row.descricao, // Dinâmico
      Unidade: "UN",
      NCM: row.ncm,
      Origem: parseFloat("0"),
      Preço: row.preco, // Dinâmico
      "Valor IPI fixo": parseFloat("0"),
      Observações: "",
      Situação: "Ativo",
      Estoque: row.estoque, // Dinâmico
      "Preço de custo": parseFloat("55"),
      "Cód. no fornecedor": "",
      Fornecedor: "",
      Localização: "",
      "Estoque máximo": parseFloat("0"),
      "Estoque mínimo": parseFloat("0"),
      "Peso líquido (Kg)": "0,250",
      "Peso bruto (Kg)": "0,250",
      "GTIN/EAN": "", // Dinâmico
      "GTIN/EAN da Embalagem": "", // Dinâmico
      "Largura do produto": parseFloat("10"),
      "Altura do Produto": parseFloat("11"),
      "Profundidade do produto": parseFloat("16"),
      "Data Validade": "",
      "Descrição do Produto no Fornecedor": "",
      "Descrição Complementar": "",
      "Itens p/ caixa": parseFloat("1"),
      "Produto Variação": row.produto_variacao, // Dinâmico
      "Tipo Produção": row.tipo_producao, // Dinâmico
      "Classe de enquadramento do IPI": "",
      "Código na Lista de Serviços": "",
      "Tipo do item": row.tipo_do_item, // Dinâmico
      "Grupo de Tags/Tags": "",
      Tributos: parseFloat("0"),
      "Código Pai": row.codigo_pai, // Dinâmico
      "Código Integração": parseFloat("0"),
      "Grupo de produtos": row.grupo_de_produtos, // Dinâmico
      Marca: loja === "" ? "Brk" : (loja === "agro" && "Brk Agro") || (loja === "fishing" && "Brk Fishing") || (loja === "motors" && "Brk Motors"), // Dinâmico row.marca
      CEST: "28.038.00",
      Volumes: parseFloat("1"),
      "Descrição Curta": "",
      "Cross-Docking": "",
      "URL Imagens Externas": row.url_imagens_externas, // Dinâmico
      "Link Externo": "",
      "Meses Garantia no Fornecedor": parseFloat("0"),
      "Clonar dados do pai": "NÂO",
      "Condição do Produto": "NOVO",
      "Frete Grátis": "NÂO",
      "Número FCI": "",
      Vídeo: "",
      Departamento: "",
      "Unidade de Medida": "Centímetro",
      "Preço de Compra": parseFloat("0"),
      "Valor base ICMS ST para retenção": parseFloat("0"),
      "Valor ICMS ST para retenção": parseFloat("0"),
      "Valor ICMS próprio do substituto": parseFloat("0"),
      "Categoria do produto": "",
      "Informações Adicionais": "",
    }));

    const worksheet = utils.json_to_sheet(rows);
    const workbook = utils.book_new();

    utils.book_append_sheet(workbook, worksheet, "");

    writeFileXLSX(workbook, `${codigoProduto}-bling-3.xlsx`, {
      compression: true,
    });

    setCarregando(false);
  }

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <Image
        className="rounded-lg"
        width={90}
        height={90}
        src={file.preview}
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
        alt=""
      />
    </div>
  ));

  //Gerenciamento de EAN/GTIN
  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      const workbook = readFile(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

      // Extract data from column C starting from row 2
      const columnCData = jsonData.slice(1).map((row: any) => row[1]);

      setData(columnCData);

      criaEan(columnCData);
    };

    reader.readAsArrayBuffer(file);
  };

  async function criaEan(dataEan: any) {
    try {
      for (let i = 0; i <= dataEan.length; i++) {
        await axios.post("/api/ean", { numero: dataEan[i].toString() });
      }
    } catch (error) {
      console.log("Ops! Houve um problema: ", error);
    } finally {
      // alert("Importação Finalizada! 🎉");
    }

    // console.log(retornoCriaEan);
  }

  async function capturaEan() {
    try {
      await axios.get("/api/ean").then((res) => {
        return JSON.stringify({
          id: res.data.data.id,
          numero: res.data.data.numero,
        });
      });
    } catch (error) {
      console.log("Ops! Houve um problema: ", error);
    } finally {
      // alert("Importação Finalizada! 🎉");
    }
  }

  function marcaEanUtilizado(idEan: String) {
    try {
      return axios.put("/api/ean", { idEan });
    } catch (error) {
      console.log("Ops, houve um problema 😭: ", error);
    }
  }

  return (
    <>
      <div className="relative flex flex-col min-h-screen h-full w-full items-center justify-center gap-4 py-10 overflow-y-clip">
        {/* HUD do EAN/GTIN */}
        <div className="fixed flex flex-col top-0 right-0 p-5">
          <label
            className="relative flex flex-col justify-center items-center text-center rounded-full text-green-300 border border-slate-200/35 p-2 gap-y-1 cursor-pointer bg-slate-200/10 gap-[1.5rem]"
            htmlFor="upean"
          >
            {/* <UploadSimple className="font-bold" size={36} /> */}
            <span className="flex items-center justify-center h-4 w-4">45</span>
            <input className="hidden" id="upean" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          </label>
        </div>

        {/* Imagens Dinâmicas por Produtos */}
        <Image
          src={`/camisa.png`}
          className={`absolute ease-in-out -left-60 -bottom-96 z-0 ${tipoDeProduto === "camisa" ? "translate-x-0 translate-y-0 placeholder-opacity-75" : "opacity-0 translate-x-10 translate-y-10"}`}
          width={900}
          height={900}
          alt=""
          priority
        />
        <Image
          src={`/camiseta.png`}
          className={`absolute ease-in-out -left-60 -bottom-80 z-0 ${tipoDeProduto === "camiseta" ? "translate-x-0 translate-y-0 placeholder-opacity-75" : "opacity-0 translate-x-10 translate-y-10"}`}
          width={900}
          height={900}
          alt=""
        />

        {/* Escolha de Loja */}
        <div className="flex justify-center align-center z-10">
          <button onClick={() => setLoja("agro")} type="button" className={`flex flex-col gap-1 items-center justify-center py-2 px-6 text-sm`}>
            <span className={`flex flex-col items-center justify-center ${loja === "agro" ? "text-zinc-200" : "text-zinc-200/30"} `}>
              <Barn className="" size={32} />
              BRK Agro
            </span>
          </button>
          <button onClick={() => setLoja("fishing")} type="button" className={`flex flex-col gap-2 items-center justify-center py-2 px-6 text-sm`}>
            <span className={`flex flex-col items-center justify-center ${loja === "fishing" ? "text-zinc-200" : "text-zinc-200/30"} `}>
              <FishSimple size={32} />
              BRK Fishing
            </span>
          </button>
          <button
            onClick={() => setLoja("motors")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-2 px-6 text-sm rounded-r-lg ${loja === "motors" ? "text-zinc-200" : "text-zinc-200/30"}`}
          >
            <span className={`flex flex-col items-center justify-center ${loja === "motors" ? "text-zinc-200" : "text-zinc-200/30"} `}>
              <Motorcycle size={32} />
              BRK Motors
            </span>
          </button>
          <button
            onClick={() => setLoja("brk")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-2 px-6 text-sm rounded-r-lg ${loja === "motors" ? "text-zinc-200" : "text-zinc-200/30"}`}
          >
            <span className={`flex flex-col items-center justify-center ${loja === "" ? "text-zinc-200" : "text-zinc-200/30"} `}>
              <Empty size={32} />
              Nenhum
            </span>
          </button>
        </div>

        {/* Escolha do Produto */}
        <div className="fixed right-0 top-[50%] translate-y-[-50%] flex flex-col justify-center align-center divide-y z-10">
          <button
            onClick={() => setTipoDeProduto("camisa")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-4 px-1 rounded-tl-lg text-sm ${
              tipoDeProduto === "camisa" ? "bg-slate-200 text-zinc-950" : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"
            }`}
          >
            <Hoodie size={32} />
            Camisas
          </button>
          <button
            onClick={() => setTipoDeProduto("camiseta")}
            type="button"
            className={`flex flex-col gap-1 items-center justify-center py-4 px-1 text-sm ${
              tipoDeProduto === "camiseta" ? "bg-slate-200 text-zinc-950" : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"
            }`}
          >
            <Tree size={32} />
            Algodão
          </button>
          <button
            onClick={() => setTipoDeProduto("bone")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-4 px-1 text-sm ${
              tipoDeProduto === "bone" ? "bg-slate-200 text-zinc-950" : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"
            }`}
          >
            <BaseballCap size={32} />
            Boné
          </button>
          <button
            onClick={() => setTipoDeProduto("cortavento")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-4 px-1 text-sm rounded-bl-lg ${
              tipoDeProduto === "cortavento" ? "bg-slate-200 text-zinc-950" : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"
            } opacity-15 pointer-events-none`}
          >
            <Hoodie size={32} />
            Corta-vento
          </button>
        </div>

        {/* Formulários */}
        <div className="flex z-10">
          <form className="flex flex-col justify-center items-center gap-10" onSubmit={handleSubmit(onSubmit)}>
            {tipoDeProduto === "camisa" && (
              <>
                <section className="container">
                  <label
                    htmlFor="imagens"
                    {...getRootProps({
                      className: "dropzone flex bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 border-dashed w-full justify-center items-center cursor-pointer mb-10 mt-4 p-8 rounded-lg",
                    })}
                  >
                    <input
                      className="cursor-pointer text-zinc-200"
                      type="file"
                      id="imagens"
                      multiple
                      // required
                      {...register("imagens")}
                      {...getInputProps()}
                    />

                    <div className="flex flex-col gap-1 text-slate-100">
                      <h4>
                        {files.length === 0 ? (
                          <div className="flex flex-col gap-4 justify-center items-center text-slate-100/45">
                            <FileArrowDown size={32} />
                            <p>Selecione as Imagens ou Solte Aqui</p>
                          </div>
                        ) : (
                          "Imagens"
                        )}
                      </h4>
                      <ul className="flex text-slate-100/45 gap-4">{thumbs}</ul>
                    </div>
                  </label>
                </section>

                <div className="flex gap-10 mb-16">
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="codigo">
                    Código
                    <input
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5 uppercase"
                      id="codigo"
                      type="text"
                      placeholder="Ex: C0..."
                      required
                      {...register("codigo")}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="titulo">
                    Titulo
                    <input
                      className="min-w-96 bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="titulo"
                      type="text"
                      placeholder="Ex: Camisa Agro Brk..."
                      required
                      {...register("titulo")}
                      onBlur={(e) => geraSEO(e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="estoque">
                    Estoque
                    <input
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="estoque"
                      type="text"
                      placeholder="Ex: C0..."
                      required
                      defaultValue={1000}
                      {...register("estoque")}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="preco">
                    Preço
                    {/* <input
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="preco"
                      type="text"
                      placeholder={`${precos.camisa}`}
                      required
                      {...register("preco")}
                    /> */}
                    <CurrencyInput
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="preco"
                      placeholder={`${precos.camisa}`}
                      defaultValue={`${precos.camisa}`}
                      intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                      {...register("preco")}
                    />
                  </label>
                </div>

                {/* Variações de Gêneros */}
                <div className="flex-1 w-full">
                  <fieldset className="flex justify-center border border-slate-200/10 p-10 gap-10">
                    <legend className="text-slate-200 font-bold text-lg px-4">Variações</legend>
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="tamanho-masculino">
                      <input id="tamanho-masculino" type="checkbox" {...register("tamanho_masculino")} defaultChecked={true} />
                      <span className="text-zinc-200">Masculino</span>
                    </label>
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="tamanho-feminino">
                      <input id="tamanho-feminino" type="checkbox" {...register("tamanho_feminino")} defaultChecked={true} />
                      <span className="text-zinc-200">Feminino</span>
                    </label>
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="tamanho-infantil">
                      <input id="tamanho-infantil" type="checkbox" {...register("tamanho_infantil")} defaultChecked={true} />
                      <span className="text-zinc-200">Infantil</span>
                    </label>
                  </fieldset>
                </div>

                {/* SEO */}
                <div className="flex flex-col w-full">
                  <fieldset className="border border-slate-200/10 p-10">
                    <legend className="text-slate-200 font-bold text-lg px-4">SEO</legend>

                    <label className="flex flex-col gap-2 text-zinc-200 mb-8" htmlFor="titulo">
                      Meta Title
                      <input
                        className="bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                        id="titulo"
                        type="text"
                        placeholder=""
                        {...register("metatitle")}
                        value={`${informacoesSeo[0]}`}
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-zinc-200 mb-8" htmlFor="titulo">
                      Meta Description
                      <textarea
                        className="bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                        id="titulo"
                        placeholder=""
                        {...register("metadescription")}
                        value={`${informacoesSeo[1]}`}
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-zinc-200" htmlFor="titulo">
                      Meta Keywords
                      <input
                        className="bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                        id="titulo"
                        type="text"
                        placeholder=""
                        {...register("metakeywords")}
                        value={`${informacoesSeo[2]}`}
                      />
                    </label>
                  </fieldset>
                </div>
              </>
            )}

            {tipoDeProduto === "camiseta" && (
              <>
                <section className="container">
                  <label
                    htmlFor="imagens"
                    {...getRootProps({
                      className: "dropzone flex bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 border-dashed w-full justify-center items-center cursor-pointer mb-10 mt-4 p-8 rounded-lg",
                    })}
                  >
                    <input
                      className="cursor-pointer text-zinc-200"
                      type="file"
                      id="imagens"
                      multiple
                      // required
                      {...register("imagens")}
                      {...getInputProps()}
                    />

                    <div className="flex flex-col gap-1 text-slate-100">
                      <h4>
                        {files.length === 0 ? (
                          <div className="flex flex-col gap-4 justify-center items-center text-slate-100/45">
                            <FileArrowDown size={32} />
                            <p>Selecione as Imagens ou Solte Aqui</p>
                          </div>
                        ) : (
                          "Imagens"
                        )}
                      </h4>
                      <ul className="flex text-slate-100/45 gap-4">{thumbs}</ul>
                    </div>
                  </label>
                </section>

                <div className="flex gap-10 mb-16">
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="codigo">
                    Código
                    <input
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5 uppercase"
                      id="codigo"
                      type="text"
                      placeholder="Ex: CASUAL / APC0_"
                      required
                      {...register("codigo")}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="titulo">
                    Titulo
                    <input
                      className="min-w-96 bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="titulo"
                      type="text"
                      placeholder="Ex: Camiseta Agro Brk..."
                      required
                      {...register("titulo")}
                      onBlur={(e) => geraSEO(e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="estoque">
                    Estoque
                    <input
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="estoque"
                      type="text"
                      placeholder="Ex: C0..."
                      required
                      defaultValue={1000}
                      {...register("estoque")}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="preco">
                    Preço ( R$ )
                    <input
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="preco"
                      type="text"
                      placeholder={`${precos.camiseta}`}
                      required
                      {...register("preco")}
                    />
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setTipoAlgodao("comalgodao")}
                    type="button"
                    className={`pb-2 text-zinc-200 ${tipoAlgodao === "comalgodao" ? "border-b b-zinc-200" : "border-b border-transparent hover:border-b hover:border-zinc-200"}`}
                  >
                    Com Algodão Egípcio
                  </button>
                  <button
                    onClick={() => setTipoAlgodao("semalgodao")}
                    type="button"
                    className={`pb-2 text-zinc-200 ${tipoAlgodao === "semalgodao" ? "border-b b-zinc-200" : "border-b border-transparent hover:border-b hover:border-zinc-200"}`}
                  >
                    Sem Algodão Egípcio
                  </button>
                </div>

                {tipoAlgodao === "semalgodao" && (
                  // Variações de Gêneros
                  <div className="flex gap-4">
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="genero-masculino">
                      <input id="genero-masculino" type="checkbox" {...register("tamanho_masculino")} defaultChecked={true} />
                      <span className="text-zinc-200">Masculino</span>
                    </label>
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="genero-feminino">
                      <input id="genero-feminino" type="checkbox" {...register("tamanho_feminino")} defaultChecked={true} />
                      <span className="text-zinc-200">Feminino</span>
                    </label>
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="genero-infantil">
                      <input id="genero-infantil" type="checkbox" {...register("tamanho_infantil")} defaultChecked={true} />
                      <span className="text-zinc-200">Infantil</span>
                    </label>
                  </div>
                )}

                {tipoAlgodao === "comalgodao" && (
                  // Variações de Cores
                  <div className="flex gap-4">
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="genero-feminino">
                      <input id="genero-feminino" type="checkbox" defaultChecked={true} {...register("cor_preto")} />
                      <span className="text-zinc-200">Preto</span>
                    </label>
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="genero-infantil">
                      <input id="genero-infantil" type="checkbox" defaultChecked={true} {...register("cor_azul")} />
                      <span className="text-zinc-200">Azul</span>
                    </label>
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="genero-masculino">
                      <input id="genero-masculino" type="checkbox" defaultChecked={true} {...register("cor_branco")} />
                      <span className="text-zinc-200">Branco</span>
                    </label>
                  </div>
                )}

                {/* SEO */}
                <div className="flex flex-col w-full">
                  <fieldset className="border border-slate-200/10 p-10">
                    <legend className="text-slate-200 font-bold text-lg px-4">SEO</legend>

                    <label className="flex flex-col gap-2 text-zinc-200 mb-8" htmlFor="titulo">
                      Meta Title
                      <input
                        className="bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                        id="titulo"
                        type="text"
                        placeholder=""
                        {...register("metatitle")}
                        value={`${informacoesSeo[0]}`}
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-zinc-200 mb-8" htmlFor="titulo">
                      Meta Description
                      <textarea
                        className="bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                        id="titulo"
                        placeholder=""
                        {...register("metadescription")}
                        value={`${informacoesSeo[1]}`}
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-zinc-200" htmlFor="titulo">
                      Meta Keywords
                      <input
                        className="bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                        id="titulo"
                        type="text"
                        placeholder=""
                        {...register("metakeywords")}
                        value={`${informacoesSeo[2]}`}
                      />
                    </label>
                  </fieldset>
                </div>
              </>
            )}

            {tipoDeProduto === "bone" && (
              <>
                <section className="container">
                  <label
                    htmlFor="imagens"
                    {...getRootProps({
                      className: "dropzone flex bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 border-dashed w-full justify-center items-center cursor-pointer mb-10 mt-4 p-8 rounded-lg",
                    })}
                  >
                    <input className="cursor-pointer text-zinc-200" type="file" id="imagens" multiple {...register("imagens")} {...getInputProps()} />

                    <div className="flex flex-col gap-1 text-slate-100">
                      <h4>
                        {files.length === 0 ? (
                          <div className="flex flex-col gap-4 justify-center items-center text-slate-100/45">
                            <FileArrowDown size={32} />
                            <p>Selecione as Imagens ou Solte Aqui</p>
                          </div>
                        ) : (
                          "Imagens"
                        )}
                      </h4>
                      <ul className="flex text-slate-100/45 gap-4">{thumbs}</ul>
                    </div>
                  </label>
                </section>

                <div className="flex gap-4">
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="codigo">
                    Código
                    <input
                      className="max-w-32 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5 uppercase"
                      id="codigo"
                      type="text"
                      placeholder="Ex: BA0..."
                      {...register("codigo")}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="titulo">
                    Titulo
                    <input
                      className="min-w-96 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5"
                      id="titulo"
                      type="text"
                      placeholder="Ex: Boné Agro Brk..."
                      {...register("titulo")}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="estoque">
                    Estoque
                    <input
                      className="max-w-32 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5"
                      id="estoque"
                      type="text"
                      placeholder="Ex: C0..."
                      {...register("estoque")}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="preco">
                    Preço ( R$ )
                    <input
                      className="max-w-32 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5"
                      itemID="preco"
                      type="text"
                      required
                      placeholder={`${precos.bone}`}
                      {...register("preco")}
                    />
                  </label>
                </div>
              </>
            )}

            {tipoDeProduto === "cortavento" && (
              <>
                <input type="file" name="" id="" multiple />

                <div className="flex gap-4">
                  <label className="flex flex-col gap-2" htmlFor="codigo">
                    Código
                    <input
                      className="max-w-32 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5 uppercase"
                      id="codigo"
                      type="text"
                      placeholder="Ex: CV0..."
                    />
                  </label>
                  <label className="flex flex-col gap-2" htmlFor="titulo">
                    Titulo
                    <input
                      className="min-w-96 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5"
                      id="titulo"
                      type="text"
                      placeholder="Ex: Jaqueta Corta Vento Brk..."
                    />
                  </label>
                  <label className="flex flex-col gap-2" htmlFor="estoque">
                    Estoque
                    <input
                      className="max-w-32 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5"
                      id="estoque"
                      type="text"
                      placeholder="Ex: C0..."
                      defaultValue={1000}
                    />
                  </label>
                  <label className="flex flex-col gap-2" htmlFor="preco">
                    Preço ( R$ )
                    <input
                      className="max-w-32 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5"
                      id="preco"
                      type="text"
                      defaultValue={precos.cortaVento}
                    />
                  </label>
                </div>
              </>
            )}

            {tipoDeProduto !== "" && (
              <div className="flex container items-center justify-center mt-10 pt-10 py-2 px-10 border-t border-zinc-800 gap-8">
                <button
                  onClick={() => {
                    setTipoCadastro("planilha");
                  }}
                  type="submit"
                  className={`py-2 px-10 border border-transparent hover:border-zinc-400 rounded-lg text-zinc-200 ${carregando && "pointer-events-none cursor-not-allowed opacity-5"}`}
                >
                  {carregando ? (
                    <span className="flex justify-center items-center">
                      <CircleNotch size={20} className="animate-spin mr-4" />
                      Processando...
                    </span>
                  ) : (
                    <span className="flex justify-center items-center gap-2">
                      <MicrosoftExcelLogo size={32} /> Gerar Planilha
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setTipoCadastro("bling");
                  }}
                  type="submit"
                  className={`hidden py-2 px-10 border border-transparent hover:border-zinc-400 rounded-lg text-zinc-200 ${carregando && "pointer-events-none cursor-not-allowed opacity-5"}`}
                >
                  {carregando ? (
                    <span className="flex justify-center items-center">
                      <CircleNotch size={20} className="animate-spin mr-4" />
                      Processando...
                    </span>
                  ) : (
                    <span className="flex justify-center items-center gap-2">
                      <ListPlus size={32} /> Cadastrar
                    </span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
