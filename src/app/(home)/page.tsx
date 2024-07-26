"use client";
import { Barn, BaseballCap, CircleNotch, FishSimple, Hoodie, ListPlus, MicrosoftExcelLogo, Motorcycle, TShirt } from "@phosphor-icons/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { writeFileXLSX, utils } from "xlsx";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

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
        },
        {
          nome: "G3",
          sigla_camisa: "G3",
        },
        {
          nome: "G4",
          sigla_camisa: "G4",
        },
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
          tamanho: "PP",
        },
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
      ],
    },
    preto: {
      tamanhos: [
        {
          cor_nome: "Preto",
          tamanho: "PP",
        },
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
      ],
    },
    azul: {
      tamanhos: [
        {
          cor_nome: "Azul",
          tamanho: "PP",
        },
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
      ],
    },
  },
];

const precos = {
  camisa: 154.9,
  camiseta: 94.9,
  bone: 129.9,
  cortaVento: 229.9,
};

export default function Home() {
  const searchParams = useSearchParams();
  const codigoBling = searchParams?.get("code");

  const [tipoDeProduto, setTipoDeProduto] = useState("camisa");
  const [tipoAlgodao, setTipoAlgodao] = useState("comalgodao");
  const [tipoCadastro, setTipoCadastro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [tokenBling, setTokenBling] = useState("");
  const [loja, setLoja] = useState("");

  // Autenticação do Bling
  const iniciarOAuth = () => {
    const clientId = "c31b56f93fafffa81d982a9e409980829942169c";
    const authUrl = `https://www.bling.com.br/b/Api/v3/oauth/authorize?response_type=code&client_id=${clientId}&state=a223bb05e34e202f5cc198603b351957`;
    window.location.href = authUrl;
  };

  function getToken() {
    axios.get(`/api/bling-token?code=${codigoBling}`).then((res: any) => {
      if (res.error === undefined) {
        const token = res.data.access_token;
        setTokenBling(token);
        localStorage.setItem("tokenBling", token);
      } else {
        alert("Ops! Houve um problema na geração do Token ⛔");
      }
    });
  }

  useEffect(() => {
    console.log(localStorage.getItem("tokenBling"));
    if (codigoBling === null) iniciarOAuth();
    if (codigoBling !== "") {
      if (localStorage.getItem("tokenBling") === "" || localStorage.getItem("tokenBling") === null) getToken();
    }
  });

  //Busca Produtos Cadastrados no Bling
  // const getProdutos = async () => {
  //   setCarregando(false);
  //   if (tokenBling)
  //     const response = await axios.get(
  //       `/api/bling-produtos?token=${tokenBling}`
  //     );
  // };

  async function saveProdutos(data: any) {
    const retornoCadastroProduto: any = await axios.post(`/api/bling-produtos?token=${localStorage.getItem("tokenBling")}`, data);
    const variacoes = retornoCadastroProduto.data.variacoes;
    const quantidadeVariacoes = Object.keys(variacoes).length;

    if (quantidadeVariacoes !== 0) {
      for (let i = 0; i < quantidadeVariacoes; i++) {
        const variacao = variacoes[i];
        try {
          await axios.post(`/api/bling-estoques?token=${localStorage.getItem("tokenBling")}`, { id: variacao.id });
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

  //Caputura do Formulário
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<esquemaDeDadosFormulario>();

  const onSubmit: SubmitHandler<esquemaDeDadosFormulario> = async (data) => {
    setCarregando(true);

    // Processamento das Imagens

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

    for (let i = 0; i < data.imagens.length; i++) {
      const file = data.imagens[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      try {
        const response = await axios.post("https://api.cloudinary.com/v1_1/daruxsllg/image/upload", formData);

        // Imagens por Gênero...
        if (file.name.toLowerCase().includes("masc")) {
          imagensMasculinas.push(response.data.secure_url);
          imagensMasculinasBling.push({ link: response.data.secure_url });
        }

        if (file.name.toLowerCase().includes("fem")) {
          imagensFemininas.push(response.data.secure_url);
          imagensFemininasBling.push({ link: response.data.secure_url });
        }

        if (file.name.toLowerCase().includes("inf")) {
          imagensInfantis.push(response.data.secure_url);
          imagensInfantisBling.push({ link: response.data.secure_url });
        }

        // Imagens por Cores
        if (file.name.toLowerCase().includes("branco")) {
          imagensCorBranco.push(response.data.secure_url);
          imagensCorBrancoBling.push({ link: response.data.secure_url });
        }

        if (file.name.toLowerCase().includes("preto")) {
          imagensCorPreto.push(response.data.secure_url);
          imagensCorPretoBling.push({ link: response.data.secure_url });
        }

        if (file.name.toLowerCase().includes("azul")) {
          imagensCorAzul.push(response.data.secure_url);
          imagensCorAzulBling.push({ link: response.data.secure_url });
        }

        todasAsImagens.push(response.data.secure_url);

        todasAsImagensBling.push({ link: response.data.secure_url });
      } catch (error) {
        console.error("Erro no Upload da Imagem: ", error);
      }
    }

    // Dados da Planilha
    var preco = parseFloat(data.preco);
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
        marca: loja, // backlog Loja
        url_imagens_externas: todasAsImagens.join("|"), //backlog clodinary
        grupo_de_produtos: (tipoDeProduto === "camisa" && "Camisa Master") || (tipoDeProduto === "camiseta" && "Camiseta Casual") || (tipoAlgodao === "comalgodao" && "Camiseta Algodão"),
      },
    ];

    var variacaoDeProduto: any = [...primeiraLinhaDaPlanilha];

    var dadosVariacoesBling: any = [];
    if (tipoDeProduto === "camisa") {
      if (data.tamanho_masculino) {
        relacaoDeTamanhos[0].masculino.tamanhos.map((item) => {
          //Variacoes para Planilha
          variacaoDeProduto.push({
            codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
            descricao: `Gênero:Masculino;Tamanho:${item.nome}`,
            estoque: item.nome === "G3" || item.nome === "G4" ? 0 : estoque,
            preco: item.nome === "G3" || item.nome === "G4" ? preco + 20 : preco,
            produto_variacao: "Variação",
            tipo_producao: "Terceiros", // backlog Bling 1
            tipo_do_item: "Mercadoria para Revenda",
            codigo_pai: data.codigo.toLocaleUpperCase(),
            marca: "Brk Agro", // backlog Loja
            url_imagens_externas: imagensMasculinas.join("|"), //backlog clodinary,
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
            descricao: `Gênero:Feminino;Tamanho:${item.nome}`,
            estoque: estoque,
            preco: preco,
            produto_variacao: "Variação",
            tipo_producao: "Terceiros", // backlog Bling 1
            tipo_do_item: "Mercadoria para Revenda",
            codigo_pai: data.codigo.toLocaleUpperCase(),
            marca: "Brk Agro", // backlog Loja
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
            descricao: `Gênero:Infantil;Tamanho:${item.nome}`,
            estoque: estoque,
            preco: preco,
            produto_variacao: "Variação",
            tipo_producao: "Terceiros", // backlog Bling 1
            tipo_do_item: "Mercadoria para Revenda",
            codigo_pai: data.codigo.toLocaleUpperCase(),
            marca: "Brk Agro", // backlog Loja
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
        console.log("informações do formulário: ", data);

        if (data.tamanho_masculino) {
          relacaoDeTamanhos[0].masculino.tamanhos.map((item) => {
            variacaoDeProduto.push({
              codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
              descricao: `Gênero:Masculino;Tamanho:${item.nome}`,
              estoque: item.nome === "G3" || item.nome === "G4" ? 0 : estoque,
              preco: item.nome === "G3" || item.nome === "G4" ? preco + 20 : preco,
              produto_variacao: "Variação",
              tipo_producao: "Terceiros", // backlog Bling 1
              tipo_do_item: "Mercadoria para Revenda",
              codigo_pai: data.codigo.toLocaleUpperCase(),
              marca: "Brk Agro", // backlog Loja
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
              descricao: `Gênero:Feminino;Tamanho:${item.nome}`,
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
              descricao: `Gênero:Infantil;Tamanho:${item.nome}`,
              estoque: estoque,
              preco: preco,
              produto_variacao: "Variação",
              tipo_producao: "Terceiros", // backlog Bling 1
              tipo_do_item: "Mercadoria para Revenda",
              codigo_pai: data.codigo.toLocaleUpperCase(),
              marca: "Brk Agro", // backlog Loja
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
        if (data.cor_branco) {
          relacaoDeCores[0].branco.tamanhos.map((item) => {
            if (item.tamanho !== "PP") {
              variacaoDeProduto.push({
                codigo: `${data.codigo.toLocaleUpperCase()}_${item.cor_nome.toUpperCase()}_${item.tamanho}`,
                descricao: `Cor:${item.cor_nome};Tamanho:${item.tamanho}`,
                estoque: estoque,
                preco: preco,
                produto_variacao: "Variação",
                tipo_producao: "Terceiros", // backlog Bling 1
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: data.codigo.toLocaleUpperCase(),
                url_imagens_externas: imagensCorBranco.join("|"), //backlog clodinary,
                grupo_de_produtos: "Camiseta Algodão",
              });

              // Dados Bling
              dadosVariacoesBling.push({
                codigo: `${data.codigo.toLocaleUpperCase()}_${item.cor_nome.toUpperCase()}_${item.tamanho}`,
                formato: "S",
                gtin: "1234567890123",
                gtinEmbalagem: "1234567890123",
                midia: {
                  imagens: {
                    externas: imagensCorBrancoBling,
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

        if (data.cor_preto) {
          relacaoDeCores[0].preto.tamanhos.map((item) => {
            if (item.tamanho !== "PP") {
              variacaoDeProduto.push({
                codigo: `${data.codigo.toLocaleUpperCase()}_${item.cor_nome.toUpperCase()}_${item.tamanho}`,
                descricao: `Cor:${item.cor_nome};Tamanho:${item.tamanho}`,
                estoque: estoque,
                preco: preco,
                produto_variacao: "Variação",
                tipo_producao: "Terceiros", // backlog Bling 1
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: data.codigo.toLocaleUpperCase(),
                url_imagens_externas: imagensCorPreto.join("|"), //backlog clodinary,
                grupo_de_produtos: "Camiseta Algodão",
              });
            }

            // Dados Bling
            dadosVariacoesBling.push({
              codigo: `${data.codigo.toLocaleUpperCase()}_${item.cor_nome.toUpperCase()}_${item.tamanho}`,
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
                codigo: `${data.codigo.toLocaleUpperCase()}_${item.cor_nome.toUpperCase()}_${item.tamanho}`,
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
      pesoLiquido: 1,
      pesoBruto: 1,
      volumes: 1,
      itensPorCaixa: 1,
      gtin: "7794051852802",
      gtinEmbalagem: "7794051852802",
      tipoProducao: "P",
      condicao: 0,
      freteGratis: false,
      marca: "Marca",
      descricaoComplementar: "Descrição complementar",
      dimensoes: {
        largura: 1,
        altura: 10,
        profundidade: 16,
        unidadeMedida: 1,
      },
      actionEstoque: "T",
      tributacao: {
        origem: 0,
        ncm: "6101.30.00",
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
          externas: todasAsImagensBling,
        },
      },
      variacoes: dadosVariacoesBling,
    };

    try {
      if (tipoCadastro === "planilha") {
        geraPlanilha(variacaoDeProduto, data.codigo.toUpperCase());
      } else if (tipoCadastro === "bling") {
        saveProdutos(dadosBling);
      }
    } catch (error) {
      alert(`Opa, tem algum problema rolando... Chama o dev 😒: ${error}`);
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
      NCM: "6101.30.00",
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
      Marca: loja === "" ? "" : (loja === "agro" && "Brk Agro") || (loja === "fishing" && "Brk Fishing") || (loja === "motors" && "Brk Motors"), // Dinâmico row.marca
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

    // Gera Planilha do Bling 1
    const rowsBling1 = Array.from(dadosDaPlanilha).map((row: any) => ({
      ID: "",
      Código: row.codigo, // Dinâmico
      Descrição: row.descricao, // Dinâmico
      Unidade: "UN",
      NCM: "6101.30.00",
      Origem: parseFloat("0"),
      Preço: row.preco, // Dinâmico
      "Valor IPI fixo": parseFloat("0"),
      Observações: "",
      Situação: "Ativo",
      Estoque: parseFloat("0"), // Dinâmico
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
      "Tipo Produção": "Própria", // Dinâmico
      "Classe de enquadramento do IPI": "",
      "Código na Lista de Serviços": "",
      "Tipo do item": "Produto Acabado", // Dinâmico
      "Grupo de Tags/Tags": "",
      Tributos: parseFloat("0"),
      "Código Pai": row.codigo_pai, // Dinâmico
      "Código Integração": parseFloat("0"),
      "Grupo de produtos": row.grupo_de_produtos, // Dinâmico
      Marca: (loja === "" && "") || (loja === "agro" && "Brk Agro") || (loja === "fishing" && "Brk Fishing") || (loja === "motors" && "Brk Motors"), // Dinâmico row.marca
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

    const worksheetBling1 = utils.json_to_sheet(rowsBling1);
    const workbookBling1 = utils.book_new();

    utils.book_append_sheet(workbookBling1, worksheetBling1);

    writeFileXLSX(workbookBling1, `${codigoProduto}-bling-1.xlsx`);

    setCarregando(false);
  }

  return (
    <>
      <div className="relative flex flex-col h-full w-full items-center justify-center gap-4 bg-gradient-to-r from-zinc-800 to-zinc-950 overflow-hidden">
        <Image
          src={`/camisa.png`}
          className={`absolute ease-in-out -left-60 -bottom-80 z-0 ${tipoDeProduto === "camisa" ? "translate-x-0 translate-y-0 placeholder-opacity-75" : "opacity-0 translate-x-10 translate-y-10"}`}
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
          <button onClick={() => setLoja("agro")} type="button" className={`flex flex-col gap-1 items-center justify-center py-2 px-6`}>
            <span className={`flex flex-col items-center justify-center ${loja === "agro" ? "text-zinc-200" : "text-zinc-200/30"} `}>
              <Barn className="" size={32} />
              BRK Agro
            </span>
          </button>
          <button onClick={() => setLoja("fishing")} type="button" className={`flex flex-col gap-2 items-center justify-center py-2 px-6`}>
            <span className={`flex flex-col items-center justify-center ${loja === "fishing" ? "text-zinc-200" : "text-zinc-200/30"} `}>
              <FishSimple size={32} />
              BRK Fishing
            </span>
          </button>
          <button
            onClick={() => setLoja("motors")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-2 px-6 rounded-r-lg ${loja === "motors" ? "text-zinc-200" : "text-zinc-200/30"}`}
          >
            <span className={`flex flex-col items-center justify-center ${loja === "motors" ? "text-zinc-200" : "text-zinc-200/30"} `}>
              <Motorcycle size={32} />
              BRK Motors
            </span>
          </button>
        </div>

        {/* Escolha do Produto */}
        <div className="absolute right-0 flex flex-col justify-center align-center divide-y z-10">
          <button
            onClick={() => setTipoDeProduto("camisa")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-6 px-2 rounded-tl-lg  ${
              tipoDeProduto === "camisa" ? "bg-slate-200 text-zinc-950" : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"
            }`}
          >
            <Hoodie size={32} />
            Camisa
          </button>
          <button
            onClick={() => setTipoDeProduto("camiseta")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-6 px-2 ${
              tipoDeProduto === "camiseta" ? "bg-slate-200 text-zinc-950" : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"
            }`}
          >
            <TShirt size={32} />
            Camiseta
          </button>
          <button
            onClick={() => setTipoDeProduto("bone")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-6 px-2 ${tipoDeProduto === "bone" ? "bg-slate-200 text-zinc-950" : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"}`}
          >
            <BaseballCap size={32} />
            Boné
          </button>
          <button
            onClick={() => setTipoDeProduto("cortavento")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-6 px-2 rounded-bl-lg ${
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
                <label
                  className="flex bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 border-dashed w-full justify-center items-center cursor-pointer mb-10 mt-4 p-8 rounded-lg"
                  htmlFor="imagens"
                >
                  <input
                    className="cursor-pointer text-zinc-200"
                    type="file"
                    id="imagens"
                    multiple
                    // required
                    {...register("imagens")}
                  />
                </label>

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
                      defaultValue={10000}
                      {...register("estoque")}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-zinc-200" htmlFor="preco">
                    Preço ( R$ )
                    <input
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="preco"
                      type="text"
                      placeholder={`${precos.camisa}`}
                      required
                      {...register("preco")}
                    />
                  </label>
                </div>

                {/* Variações de Gêneros */}
                <div className="flex gap-4">
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
                </div>
              </>
            )}

            {tipoDeProduto === "camiseta" && (
              <>
                <label
                  className="flex bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 border-dashed w-full justify-center items-center cursor-pointer mb-10 mt-4 p-8 rounded-lg"
                  htmlFor="imagens"
                >
                  <input className="cursor-pointer text-zinc-200" type="file" id="imagens" multiple required {...register("imagens")} />
                </label>

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
                      defaultValue={10000}
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
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="genero-masculino">
                      <input id="genero-masculino" type="checkbox" defaultChecked={true} {...register("cor_branco")} />
                      <span className="text-zinc-200">Branco</span>
                    </label>
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="genero-feminino">
                      <input id="genero-feminino" type="checkbox" defaultChecked={true} {...register("cor_preto")} />
                      <span className="text-zinc-200">Preto</span>
                    </label>
                    <label className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer" htmlFor="genero-infantil">
                      <input id="genero-infantil" type="checkbox" defaultChecked={true} {...register("cor_azul")} />
                      <span className="text-zinc-200">Azul</span>
                    </label>
                  </div>
                )}
              </>
            )}

            {tipoDeProduto === "bone" && (
              <>
                <label
                  className="flex bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 border-dashed w-full justify-center items-center cursor-pointer mb-10 mt-4 p-8 rounded-lg"
                  htmlFor="imagens"
                >
                  <input
                    className="cursor-pointer text-zinc-200"
                    type="file"
                    id="imagens"
                    multiple
                    // required
                    {...register("imagens")}
                  />
                </label>

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
                    setCarregando(true);
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
                    setCarregando(true);
                    setTipoCadastro("bling");
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
