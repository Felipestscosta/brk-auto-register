"use client";
import {
  Barn,
  BaseballCap,
  CircleNotch,
  Empty,
  FishSimple,
  Hoodie,
  ListPlus,
  MicrosoftExcelLogo,
  Motorcycle,
  Tree
} from "@phosphor-icons/react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";

import { writeFileXLSX, utils, readFile } from "xlsx";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Cloudflare from "cloudflare";
import { motion, AnimatePresence } from "framer-motion";

type esquemaDeDadosFormulario = {
  forms: {
    codigo: string;
    titulo: string;
    estoque: string;
    preco: string;
    imagens: any;
    cor_modelo_all: string;

    tamanho_masculino: boolean;
    tamanho_feminino: boolean;
    tamanho_infantil: boolean;

    metatitle: string;
    metadescription: string;
    metakeywords: string;
  }[];
  is_all: boolean;
  codigo_all: string;
  titulo_all: string;
};

const descricaoCamisaPorLoja = {
  agro: `<h2>[titulo-produto]</h2><p>As Camisas Agro Brk são uma inovação no segmento ao unir<span> </span><strong>qualidade, estilo e performance</strong><span> </span>em um só produto. Confeccionadas com tecido exclusivo<span> </span><strong>XTech Pro®</strong>, proporcionam<span> </span><strong>conforto, proteção solar de UV50+, antiodor e antibacteriano</strong>.<p>Vista-se com uma Camisa Brk Agro com cores vibrantes que<span> </span><strong>não desbota, não precisa passar, tem costura reforçada e secagem ultra rápida.</strong><p><strong>Atente-se para alguns cuidados básicos necessários para conservar as propriedades do tecido e a eficácia da tecnologia que usamos:</strong><ul><li>Lavar em água fria e com detergente líquido;<li>Após a lavagem, deixar secar na sombra;<li>Não utilizar máquina de secar e nem lavagem a seco;<li>Não passar sua camisa com ferro elétrico.</ul><p><strong>Confira alguns diferenciais da Camisa Brk:</strong><ul><li>Costura reforçada com tecnologia;<li>Tecido XTech Pro® Exclusivo;<li>Antiodor e Antibacteriano;<li>Proteção Solar UV50+;<li>Estampas exclusivas.<li>Garantia de 1 ano;<li>Troca Fácil;</ul>`,
  fishing: `<h2>[titulo-produto]</h2><p>As Camisas de Pesca Brk são a combinação perfeita de <strong>qualidade, estilo e alta performance</strong> para quem ama atividades ao ar livre. Produzidas com o inovador tecido exclusivo <strong>XTech Pro®</strong>, oferecem <strong>conforto, proteção solar UV50+, tecnologia antiodor e antibacteriana</strong>, garantindo uma experiência única durante suas pescarias.<h3>Cuidados essenciais para manter sua camisa impecável:</h3><ul><li>Lave em água fria utilizando detergente líquido;<li>Deixe secar à sombra após a lavagem;<li>Evite usar máquina de secar ou lavagem a seco;<li>Não passe a camisa com ferro elétrico.</ul><h3>Diferenciais das Camisas de Pesca Brk:</h3><ul><li>Costura reforçada com tecnologia;<li>Exclusivo tecido <strong>XTech Pro®</strong>;<li>Tecnologia <strong>antiodor e antibacteriana</strong>;<li>Proteção Solar <strong>UV50+</strong> homologada;<li>Estampas exclusivas e estilosas;<li>Garantia de 1 ano;<li>Troca fácil e descomplicada.</ul><p><strong>Ideal para pescarias e aventuras ao ar livre</strong>, a Camisa de Pesca Brk é a escolha certa para quem valoriza conforto, tecnologia e estilo em um só produto. 🌊🎣`,
  motors: `<h2>[titulo-produto]</h2><p>As Camisas de Motociclismo Brk são a combinação perfeita de <strong>qualidade, estilo e alta performance</strong> para quem ama encarar as estradas e aventuras em duas rodas. Produzidas com o inovador tecido exclusivo <strong>XTech Pro®</strong>, oferecem <strong>conforto, proteção solar UV50+, tecnologia antiodor e antibacteriana</strong>, garantindo uma experiência única durante suas viagens e trajetos de moto.<h3>Cuidados essenciais para manter sua camisa impecável:</h3><ul><li>Lave em água fria utilizando detergente líquido;<li>Deixe secar à sombra após a lavagem;<li>Evite usar máquina de secar ou lavagem a seco;<li>Não passe a camisa com ferro elétrico.</ul><h3>Diferenciais das Camisas de Motociclismo Brk:</h3><ul><li>Costura reforçada com tecnologia;<li>Exclusivo tecido <strong>XTech Pro®</strong>;<li>Tecnologia <strong>antiodor e antibacteriana</strong>;<li>Proteção Solar <strong>UV50+</strong> homologada;<li>Estampas exclusivas e estilosas;<li>Garantia de 1 ano;<li>Troca fácil e descomplicada.</ul><p><strong>Ideal para motociclismo e aventuras ao ar livre</strong>, a Camisa Motociclismo Brk é a escolha certa para quem valoriza conforto, tecnologia e estilo em um só produto. 🏍️🔥`,
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
  const [quantidadeEans, setQuantidadeEans] = useState(0);
  const [tipoDeProduto, setTipoDeProduto] = useState("camisa");
  const [tipoCadastro, setTipoCadastro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [usaEan, setUsaEan] = useState(false);
  const [loja, setLoja] = useState("Brk");
  const [data, setData] = useState<any[]>([]);
  const [titulos, setTitulos] = useState<string[]>([]);

  console.log(loja)

  async function getNumeroEans() {
    const dataNumeroEans = await axios.get("api/ean?quantidadeeans=true");
    setQuantidadeEans(dataNumeroEans ? dataNumeroEans.data.count : "0");
  }

  //Captura e Armazena o Token do Bling
  async function getToken() {
    return await axios.get(`/api/bling-token`);
  }

  useEffect(() => {
    usaEan && getNumeroEans();

    () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  });

  //Salva Produto no Bling
  async function saveProdutos(data: any) {
    const retornoObtemToken = await getToken();
    const token = retornoObtemToken.data[0].token;
    // const token = 'bc12a4341494c9cc8b4652d250d629320cfbb737';

    const retornoCadastroProduto: any = await axios.post(
      `/api/bling-produtos?token=${token}`,
      data
    );
    const variacoes = retornoCadastroProduto.data.variacoes;
    const quantidadeVariacoes = Object.keys(variacoes).length;

    if (quantidadeVariacoes !== 0) {
      for (let i = 0; i < quantidadeVariacoes; i++) {
        const variacao = variacoes[i];
        try {
          if (
            !variacao.nomeVariacao.includes("G3") &&
            !variacao.nomeVariacao.includes("G4")
          ) {
            await axios.post(`/api/bling-estoques?token=${token}`, {
              id: variacao.id,
            });
          }
        } catch (error) {
          console.error(
            `Erro na requisição para variação ${variacao.id}:`,
            error
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } else {
      axios.post(`/api/bling-estoques?token=${token}`, {
        id: retornoCadastroProduto.idProduto,
      });
    }

    if (retornoCadastroProduto.status === 201) {
      alert("Produto Cadastrado com sucesso 🚀");
      setCarregando(false);
    }
  }

  //Converte arquivo de Imagem para Base64 para subir no Imgur
  function fileToBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader: any = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove o cabeçalho "data:image/png;base64,"
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Função para adicionar novo grupo de formulário
  const addFormInstance = () => {
    append({
      codigo: "",
      titulo: "",
      estoque: "",
      preco: "R$159,90",
      imagens: [],
      tamanho_masculino: true,
      tamanho_feminino: true,
      tamanho_infantil: true,
      metatitle: "",
      metadescription: "",
      metakeywords: "",
      cor_modelo_all: "",
    });
    setTitulos((prev) => [...prev, ""]);
  };

  // Função para remover grupo de formulário
  const removeFormInstance = (indexToRemove: number) => {
    if (fields.length === 1) {
      alert("Não é possível remover o último formulário!");
      return;
    }
    remove(indexToRemove);
    setTitulos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  //Captura do Formulário
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<esquemaDeDadosFormulario>({
    defaultValues: {
      forms: [
        {
          codigo: "",
          titulo: "",
          estoque: "",
          preco: "R$ 159,90",
          imagens: [],
          tamanho_masculino: true,
          tamanho_feminino: true,
          tamanho_infantil: true,
          metatitle: "",
          metadescription: "",
          metakeywords: "",
          cor_modelo_all: "",
        },
      ],
      is_all: false,
      codigo_all: "",
      titulo_all: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "forms",
  });

  const onSubmit: SubmitHandler<esquemaDeDadosFormulario> = async (data) => {
    //setCarregando(true);

    var produtosEVariacoesUnidas = [];
    for (const dadosFormulario of data.forms) {
      var nomeLoja = loja == 'Brk' && 'Brk' 
      || loja == 'agro' && 'Brk Agro' 
      || loja == 'fishing' && 'Brk Fishing'
      || loja == 'motors' && 'Brk Motors';
        // loja === "Brk"
        //   ? "Brk"
        //   : (loja === "agro" && "Brk Agro") ||
        //     (loja === "fishing" && "Brk Fishing") ||
        //     (loja === "motors" && "Brk Motors");

      var descricaoProduto;

      //Imagens Bling
      let todasAsImagensBling: any = [];
      var imagensMasculinasBling: any = [];
      var imagensFemininasBling: any = [];
      var imagensInfantisBling: any = [];

      //Imagens Planilha
      let todasAsImagens = [];
      var imagensMasculinas: any = [];
      var imagensFemininas: any = [];
      var imagensInfantis: any = [];

      if (loja === "") {
        alert("Selecione a loja Brk 😓");
        setCarregando(false);
        return;
      }

      // if (qtdFiles === 0){
      //   alert("Não esqueça as imagens 🖼️");
      //   setCarregando(false);
      //   return
      // }

      // getNumeroEans();
      // if(quantidadeEans < 30){
      //   alert('Sem número de EANs suficiente 😐. Recarregue os EANs, clicando na quantidade.')
      //   setCarregando(false)
      //   return
      // }

      var confirmadoPeloUsuario: any;
      if (tipoCadastro === "bling") {
        confirmadoPeloUsuario = confirm(
          "⚠️Atenção! Tenha certeza de que os dados estão corretos. Quer mesmo continuar?"
        );
      }

      //Continua se o usuário concorda que revisou os dados
      !confirmadoPeloUsuario && setCarregando(false);

      if (confirmadoPeloUsuario ?? true) {
        setCarregando(true);

        var formularioFiles = Array.from(
          (dadosFormulario.imagens as FileList) || []
        );

        //Ordena as Imagens em Ordem Ascendente
        if (formularioFiles.length > 0) {
          formularioFiles.sort((a: File, b: File) => {
            const numA = parseInt(a.name.split("_")[0], 10);
            const numB = parseInt(b.name.split("_")[0], 10);
            return numA - numB;
          });
        }

        //Upload das imagens separando por Gêneros e Cores por tipo de produto
        for (let i = 0; i < formularioFiles.length; i++) {
          const file = formularioFiles[i];
          const formData = new FormData();
          formData.append("file", file as File);

          try {
            const response: any = await axios.post(
              "/api/upload-image-s3",
              formData
            );
            const urlDaImagem = response.data.file.location;
            // const urlDaImagem = "";

            // Imagens por Gênero
            if (file.name.toLowerCase().includes("masc")) {
              imagensMasculinas.push(urlDaImagem);
            }

            if (file.name.toLowerCase().includes("fem")) {
              imagensFemininas.push(urlDaImagem);
            }

            if (file.name.toLowerCase().includes("inf")) {
              imagensInfantis.push(urlDaImagem);
            }

            todasAsImagens.push(urlDaImagem);
          } catch (error) {
            console.error("Erro no Upload da Imagem: ", error);
          }
        }

        // Dados da Planilha
        var preco = parseFloat(
          dadosFormulario.preco
            .replace("R$", "")
            .replace(".", "")
            .replace(",", ".")
        );

        var produtosEVariacoes: any = [];
        var dadosVariacoesBling: any = [];
        if (tipoDeProduto === "camisa") {
          // Variação masculina da camisa
          if (dadosFormulario.tamanho_masculino) {
            let codigoProdutoPaiMasculino =
              dadosFormulario.codigo.toLocaleUpperCase();

            //Define o titulo de acordo com a loja
            let tituloProdutoMasculino: any;
            switch (loja) {
              case "agro":
                tituloProdutoMasculino = `Camisa Agro Brk ${dadosFormulario.titulo} com Proteção Solar UV50+`;
                break;
              case "fishing":
                tituloProdutoMasculino = `Camisa de Pesca Brk ${dadosFormulario.titulo} com Proteção Solar UV50+`;
                break;
              case "motors":
                tituloProdutoMasculino = `Camisa Motociclismo Brk ${dadosFormulario.titulo} com Proteção Solar UV50+`;
                break;
              default:
                tituloProdutoMasculino = dadosFormulario.titulo;
                break;
            }

            //Define a descrição de acordo com a loja
            let descricaoProdutoMasculino = '';

            let imagensConcatenadasMasculinas =
              imagensMasculinas && imagensMasculinas.length > 0
                ? imagensMasculinas.join("|")
                : imagensMasculinas;

            // Produto Pai
            let produtoPai = [
              {
                codigo: codigoProdutoPaiMasculino,
                descricao: tituloProdutoMasculino,
                descricao_complementar: descricaoProdutoMasculino,
                descricao_curta: descricaoProdutoMasculino,
                estoque: parseFloat("0"),
                preco: preco,
                produto_variacao: "Produto",
                tipo_producao: "Terceiros",
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: "",
                marca: nomeLoja,
                url_imagens_externas: imagensConcatenadasMasculinas,
                grupo_de_produtos: "Camisa Master",
              },
            ];

            var variacaoDeProdutoMasculino: any = [...produtoPai];

            for (
              var i = 0;
              i < relacaoDeTamanhos[0].masculino.tamanhos.length;
              i++
            ) {
              var item = relacaoDeTamanhos[0].masculino.tamanhos[i];

              //Sinaliza EAN Como Utilizado
              var resultaldoEAN = usaEan
                ? (await axios.get("/api/ean")).data
                : "";
              if (resultaldoEAN) {
                await axios.put("/api/ean", {
                  idEan: resultaldoEAN.id,
                  sku: `${dadosFormulario.codigo.concat(item.sigla_camisa)}`,
                });
              }

              //Variacoes para Planilha
              variacaoDeProdutoMasculino.push({
                codigo: `${dadosFormulario.codigo.toLocaleUpperCase()}${
                  item.sigla_camisa
                }`,
                descricao: dadosFormulario.cor_modelo_all ? `Cor:${dadosFormulario.cor_modelo_all};Tamanho:${item.nome}` : `Tamanho:${item.nome}`, //Título
                estoque: "1000",
                preco: preco,
                produto_variacao: "Variação",
                tipo_producao: "Terceiros", // backlog Bling 1
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: dadosFormulario.codigo.toLocaleUpperCase(),
                url_imagens_externas: imagensConcatenadasMasculinas,
                grupo_de_produtos: "Camisa Master",
                ean: resultaldoEAN.numero,
              });

              // Dados Bling
              dadosVariacoesBling.push({
                codigo: `${dadosFormulario.codigo.toLocaleUpperCase()}${
                  item.sigla_camisa
                }`,
                marca: nomeLoja,
                preco: preco,
                situacao: "A",
                descricaoCurta: descricaoProduto,
                unidade: "UN",
                pesoLiquido: 0.25,
                pesoBruto: 0.25,
                volumes: 1,
                itensPorCaixa: 1,
                tipoProducao: "P",
                condicao: 0,
                freteGratis: false,
                descricaoComplementar: descricaoProduto,
                dimensoes: {
                  largura: 22,
                  altura: 4,
                  profundidade: 30,
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
                formato: "S",
                tipo: "P",
                gtin: resultaldoEAN.numero,
                gtinEmbalagem: resultaldoEAN.numero,
                midia: {
                  imagens: {
                    imagensURL: imagensMasculinasBling,
                  },
                },
                variacao: {
                  nome: `Gênero:Masculino;Tamanho:${item.nome}`,
                  ordem: 1,
                  produtoPai: {
                    cloneInfo: false,
                  },
                },
              });
            }

            produtosEVariacoes.push(variacaoDeProdutoMasculino);
          }

          // Variação feminina da camisa
          if (dadosFormulario.tamanho_feminino) {
            let codigoProdutoPaiFeminino = `${dadosFormulario.codigo.toLocaleUpperCase()}BL`;

            //Define o titulod e acordo com a loja
            let tituloProdutoFeminino: any;
            switch (loja) {
              case "agro":
                tituloProdutoFeminino = `Camisa Agro Feminina Brk ${dadosFormulario.titulo} com Proteção Solar UV50+`;
                break;
              case "fishing":
                tituloProdutoFeminino = `Camisa de Pesca Feminina Brk ${dadosFormulario.titulo} com Proteção Solar UV50+`;
                break;
              case "motors":
                tituloProdutoFeminino = `Camisa Motociclismo Feminina Brk ${dadosFormulario.titulo} com Proteção Solar UV50+`;
                break;
              default:
                tituloProdutoFeminino = dadosFormulario.titulo;
                break;
            }

            //Define a descrição de acordo com a loja
            let descricaoProdutoFeminino = '';

            let imagensConcatenadasFemininas =
              imagensFemininas && imagensFemininas.length > 0
                ? imagensFemininas.join("|")
                : imagensFemininas;

            // Produto Pai
            var produtoPai = [
              {
                codigo: codigoProdutoPaiFeminino,
                descricao: tituloProdutoFeminino,
                descricao_complementar: descricaoProdutoFeminino,
                descricao_curta: descricaoProdutoFeminino,
                estoque: parseFloat("0"),
                preco: preco,
                produto_variacao: "Produto",
                tipo_producao: "Terceiros",
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: "",
                marca: nomeLoja,
                url_imagens_externas: imagensConcatenadasFemininas,
                grupo_de_produtos: "Camisa Master",
              },
            ];

            var variacaoDeProdutoFeminino: any = [...produtoPai];

            for (
              var i = 0;
              i < relacaoDeTamanhos[0].feminino.tamanhos.length;
              i++
            ) {
              var item = relacaoDeTamanhos[0].feminino.tamanhos[i];

              //Sinaliza EAN Como Utilizado
              var resultaldoEAN = usaEan
                ? (await axios.get("/api/ean")).data
                : "";
              if (resultaldoEAN) {
                await axios.put("/api/ean", {
                  idEan: resultaldoEAN.id,
                  sku: `${dadosFormulario.codigo.concat(item.sigla_camisa)}`,
                });
              }

              // Dados da Planilha
              variacaoDeProdutoFeminino.push({
                codigo: `${dadosFormulario.codigo.toLocaleUpperCase()}${
                  item.sigla_camisa
                }`,
                descricao: dadosFormulario.cor_modelo_all ? `Cor:${dadosFormulario.cor_modelo_all};Tamanho:${item.nome}` : `Tamanho:${item.nome}`,
                estoque: "1000",
                preco: preco,
                produto_variacao: "Variação",
                tipo_producao: "Terceiros",
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: `${dadosFormulario.codigo.toLocaleUpperCase()}BL`,
                url_imagens_externas: imagensConcatenadasFemininas,
                grupo_de_produtos: "Camisa Master",
                ean: resultaldoEAN.numero,
              });

              // Dados do Bling
              dadosVariacoesBling.push({
                codigo: `${dadosFormulario.codigo.toLocaleUpperCase()}${
                  item.sigla_camisa
                }`,
                preco: preco,
                situacao: "A",
                descricaoCurta: "Descrição curta",
                unidade: "UN",
                pesoLiquido: 0.25,
                pesoBruto: 0.25,
                volumes: 1,
                itensPorCaixa: 1,
                tipoProducao: "P",
                condicao: 0,
                freteGratis: false,
                marca: nomeLoja,
                descricaoComplementar: "Descrição complementar",
                dimensoes: {
                  largura: 22,
                  altura: 4,
                  profundidade: 30,
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
                formato: "S",
                tipo: "P",
                gtin: resultaldoEAN.numero,
                gtinEmbalagem: resultaldoEAN.numero,
                midia: {
                  imagens: {
                    imagensURL: imagensFemininasBling,
                  },
                },
                variacao: {
                  nome: `Gênero:Feminino;Tamanho:Baby Look ${item.nome}`,
                  ordem: 1,
                  produtoPai: {
                    cloneInfo: false,
                  },
                },
              });
            }

            produtosEVariacoes.push(variacaoDeProdutoFeminino);
          }

          // Variação infantil da camisa
          if (dadosFormulario.tamanho_infantil) {
            let codigoProdutoPaiInfantil = `${dadosFormulario.codigo.toLocaleUpperCase()}I`;

            //Define o titulo de acordo com a loja
            let tituloProdutoInfantil: any;
            switch (loja) {
              case "agro":
                tituloProdutoInfantil = `Camisa Agro Infantil Brk ${dadosFormulario.titulo} com Proteção Solar UV50+`;
                break;
              case "fishing":
                tituloProdutoInfantil = `Camisa de Pesca Infantil Brk ${dadosFormulario.titulo} com Proteção Solar UV50+`;
                break;
              case "motors":
                tituloProdutoInfantil = `Camisa Motociclismo Infantil Brk ${dadosFormulario.titulo} com Proteção Solar UV50+`;
                break;
              default:
                tituloProdutoInfantil = dadosFormulario.titulo;
                break;
            }

            //Define a descrição de acordo com a loja
            let descricaoProdutoInfantil = '';

            let imagensConcatenadasInfantis =
              imagensInfantis && imagensInfantis.length > 0
                ? imagensInfantis.join("|")
                : imagensInfantis;

            // Produto Pai
            let produtoPai = [
              {
                codigo: codigoProdutoPaiInfantil,
                descricao: tituloProdutoInfantil,
                descricao_complementar: descricaoProdutoInfantil,
                descricao_curta: descricaoProdutoInfantil,
                estoque: parseFloat("0"),
                preco: preco,
                produto_variacao: "Produto",
                tipo_producao: "Terceiros",
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: "",
                marca: nomeLoja,
                url_imagens_externas: imagensConcatenadasInfantis,
                grupo_de_produtos: "Camisa Master",
              },
            ];

            var variacaoDeProdutoInfantil: any = [...produtoPai];

            for (
              var i = 0;
              i < relacaoDeTamanhos[0].infantil.tamanhos.length;
              i++
            ) {
              var item = relacaoDeTamanhos[0].infantil.tamanhos[i];

              //Sinaliza EAN Como Utilizado
              var resultaldoEAN = usaEan
                ? (await axios.get("/api/ean")).data
                : "";
              if (resultaldoEAN) {
                await axios.put("/api/ean", {
                  idEan: resultaldoEAN.id,
                  sku: `${dadosFormulario.codigo.concat(item.sigla_camisa)}`,
                });
              }

              variacaoDeProdutoInfantil.push({
                codigo: `${dadosFormulario.codigo.toLocaleUpperCase()}${
                  item.sigla_camisa
                }`,
                marca: loja,
                descricao: dadosFormulario.cor_modelo_all ? `Cor:${dadosFormulario.cor_modelo_all};Tamanho:${item.nome}` : `Tamanho:${item.nome}`,
                estoque: "1000",
                preco: preco,
                produto_variacao: "Variação",
                tipo_producao: "Terceiros",
                tipo_do_item: "Mercadoria para Revenda",
                codigo_pai: `${dadosFormulario.codigo.toLocaleUpperCase()}I`,
                url_imagens_externas: imagensConcatenadasInfantis,
                grupo_de_produtos: "Camisa Master",
                ean: resultaldoEAN.numero,
              });

              // Dados Bling
              dadosVariacoesBling.push({
                codigo: `${dadosFormulario.codigo.toLocaleUpperCase()}${
                  item.sigla_camisa
                }`,
                marca: nomeLoja,
                preco: preco,
                situacao: "A",
                descricaoCurta: "Descrição curta",
                unidade: "UN",
                pesoLiquido: 0.25,
                pesoBruto: 0.25,
                volumes: 1,
                itensPorCaixa: 1,
                tipoProducao: "P",
                condicao: 0,
                freteGratis: false,
                descricaoComplementar: "Descrição complementar",
                dimensoes: {
                  largura: 22,
                  altura: 4,
                  profundidade: 30,
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
                formato: "S",
                tipo: "P",
                gtin: resultaldoEAN.numero,
                gtinEmbalagem: resultaldoEAN.numero,
                midia: {
                  imagens: {
                    imagensURL: imagensInfantisBling,
                  },
                },
                variacao: {
                  nome: `Gênero:Infantil;Tamanho:Infantil ${item.nome}`,
                  ordem: 1,
                  produtoPai: {
                    cloneInfo: false,
                  },
                },
              });
            }

            produtosEVariacoes.push(variacaoDeProdutoInfantil);
          }
        }

        const dadosBling = {
          nome: dadosFormulario.titulo,
          codigo: dadosFormulario.codigo.toLocaleUpperCase(),
          preco: preco,
          tipo: "P",
          situacao: "A",
          formato: "V",
          descricaoCurta: descricaoProduto,
          unidade: "UN",
          pesoLiquido: 0.25,
          pesoBruto: 0.25,
          volumes: 1,
          itensPorCaixa: 1,
          gtin: "",
          gtinEmbalagem: "",
          tipoProducao: "P",
          condicao: 0,
          freteGratis: false,
          marca: nomeLoja,
          descricaoComplementar: descricaoProduto,
          dimensoes: {
            largura: 22,
            altura: 4,
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
              imagensURL: todasAsImagensBling,
            },
          },
          variacoes: dadosVariacoesBling,
        };

        produtosEVariacoesUnidas.push(produtosEVariacoes.flat());
      }
    }

    var todosOsProdutos = produtosEVariacoesUnidas.flat();

    //remover posicao do array que contem o valor do codigo_pai = ""
    if (data.codigo_all) {
      var produtosDesmembrados = [];
      var produtoPaiAll = todosOsProdutos[0];

      todosOsProdutos = todosOsProdutos.filter(
        (produto) =>
          (produto.codigo_pai !== "" && !produto.codigo.includes("I")) ||
          !produto.codigo.includes("BL")
      );

      produtoPaiAll.codigo = data.codigo_all;
      produtoPaiAll.descricao = data.titulo_all;

      todosOsProdutos.map((produto, index) => {
        if (produto.codigo_pai !== "") {
          produto.codigo_pai = produtoPaiAll.codigo;
          produto.codigo = `ALL_${produto.codigo}`;
        }
        // return (index !== 0) && produto.codigo_pai !== ""
        //   ? produto.codigo_pai = todosOsProdutos[0].codigo
        //   : null;
      });

      //console.log("Produtos tratados:", todosOsProdutos);

      produtosDesmembrados.push(
        ...todosOsProdutos.filter((produto) => produto.codigo_pai !== "")
      );

      //inserir produtopai no inicio do array
      produtosDesmembrados.unshift(produtoPaiAll);

      todosOsProdutos = produtosDesmembrados;
      //console.log("Produtos Desmembrados:", produtosDesmembrados);

      //console.log("Tipo All:", produtosDesmembrados);
      setTipoCadastro("is_all");
    } else {
      setTipoCadastro("planilha");
    }

    //console.log(todosOsProdutos);

    try {
      if (tipoCadastro === "planilha" || tipoCadastro === "is_all") {
        //console.log("Dados da Planilha:", todosOsProdutos);
        geraPlanilha(todosOsProdutos, "cadastro-bling");
      } else if (tipoCadastro === "bling") {
        //console.log("Dados do Bling:", dadosBling);
        // saveProdutos(dadosBling);
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
      Código: row.codigo,
      Descrição: row.descricao,
      Unidade: "UN",
      NCM: "6101.30.00",
      Origem: parseFloat("0"),
      Preço: row.preco,
      "Valor IPI fixo": parseFloat("0"),
      Observações: "",
      Situação: "Ativo",
      Estoque: row.estoque,
      "Preço de custo": parseFloat("55"),
      "Cód. no fornecedor": "",
      Fornecedor: "",
      Localização: "",
      "Estoque máximo": parseFloat("0"),
      "Estoque mínimo": parseFloat("0"),
      "Peso líquido (Kg)": "0,250",
      "Peso bruto (Kg)": "0,250",
      "GTIN/EAN": row.ean,
      "GTIN/EAN da Embalagem": row.ean,
      "Largura do produto": parseFloat("22"),
      "Altura do Produto": parseFloat("4"),
      "Profundidade do produto": parseFloat("30"),
      "Data Validade": "",
      "Descrição do Produto no Fornecedor": "",
      "Descrição Complementar": row.descricao_complementar,
      "Itens p/ caixa": parseFloat("1"),
      "Produto Variação": row.produto_variacao,
      "Tipo Produção": row.tipo_producao,
      "Classe de enquadramento do IPI": "",
      "Código na Lista de Serviços": "",
      "Tipo do item": row.tipo_do_item,
      "Grupo de Tags/Tags": "",
      Tributos: parseFloat("0"),
      "Código Pai": row.codigo_pai,
      "Código Integração": parseFloat("0"),
      "Grupo de produtos": row.grupo_de_produtos,
      Marca: loja === 'Brk' && 'Brk' || loja === 'agro' && 'Brk Agro' || loja === 'fishing' && 'Brk Fishing' || loja === 'motors' && 'Brk Motors',
      CEST: "28.038.00",
      Volumes: parseFloat("1"),
      "Descrição Curta": row.descricao_curta,
      "Cross-Docking": "",
      "URL Imagens Externas": row.url_imagens_externas,
      "Link Externo": "",
      "Meses Garantia no Fornecedor": parseFloat("0"),
      "Clonar dados do pai": "NÃO",
      "Condição do Produto": "NOVO",
      "Frete Grátis": "NÃO",
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
        className="rounded-sm"
        width={43}
        height={43}
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

      const columnCData = jsonData.slice(1).map((row: any) => row[1]);

      setData(columnCData);

      criaEan(columnCData);
    };

    reader.readAsArrayBuffer(file);
  };

  async function criaEan(dataEan: any) {
    setCarregando(true);
    var dataEans = [];
    for (let i = 0; i <= dataEan.length; i++) {
      dataEans.push(dataEan[i]);
    }

    try {
      await axios.post("/api/ean", dataEans);
      getNumeroEans();
    } catch (error) {
      console.log("Ops! Houve um problema: ", error);
    } finally {
      alert("Importação Finalizada! 🎉");
      setCarregando(false);
    }
  }

  return (
    <>
      <div className="relative flex flex-col min-h-screen h-full w-full items-center justify-center gap-4 py-10 overflow-y-clip">
        {/* Inteface de Carregamento */}
        {carregando && (
          <>
            <div className="fixed w-screen h-screen top-0 left-0 z-20 bg-zinc-100/10 backdrop-blur-[1px] blur-[1px]"></div>
            <div className="fixed top-1/3 left-1/3 w-[520px] z-30 bg-zinc-800 p-20 mt-2 rounded-md">
              <span className="flex justify-center items-center text-zinc-200">
                <CircleNotch
                  size={50}
                  className="animate-spin mr-4 text-zinc-200"
                />
                Processando...
              </span>
            </div>
          </>
        )}

        {/* HUD do EAN/GTIN */}
        <div
          className="fixed flex flex-col top-0 right-0 p-5"
          title="Quantidade de EAN's Restantes. Clique aqui para importar mais."
        >
          <label
            className={`relative flex flex-col justify-center items-center text-center rounded-lg ${
              quantidadeEans < 30 ? "text-red-300" : "text-green-300"
            } border border-slate-200/35 p-2 gap-y-1 cursor-pointer bg-slate-200/10 gap-[1.5rem]`}
            htmlFor="upean"
          >
            {/* <UploadSimple className="font-bold" size={36} /> */}
            <span className="flex items-center justify-center p-1">
              {quantidadeEans}
            </span>
            <input
              className="hidden"
              id="upean"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Imagens Dinâmicas por Produtos */}
        <Image
          src={`/camisa.png`}
          className={`absolute ease-in-out -left-60 -bottom-96 z-0 ${
            tipoDeProduto === "camisa"
              ? "translate-x-0 translate-y-0 placeholder-opacity-75"
              : "opacity-0 translate-x-10 translate-y-10"
          }`}
          width={900}
          height={900}
          alt=""
          priority
        />
        <Image
          src={`/camiseta.png`}
          className={`absolute ease-in-out -left-60 -bottom-80 z-0 ${
            tipoDeProduto === "camiseta"
              ? "translate-x-0 translate-y-0 placeholder-opacity-75"
              : "opacity-0 translate-x-10 translate-y-10"
          }`}
          width={900}
          height={900}
          alt=""
        />

        {/* Escolha de Loja */}
        <div className="flex w-full justify-center align-center z-10  border-b pb-10 border-zinc-800">
          <button
            onClick={() => setLoja("agro")}
            type="button"
            className={`flex flex-col gap-1 items-center justify-center py-2 px-6 text-sm`}
          >
            <span
              className={`flex flex-col items-center justify-center ${
                loja === "agro" ? "text-zinc-200" : "text-zinc-200/30"
              } `}
            >
              <Barn className="" size={32} />
              Brk Agro
            </span>
          </button>
          <button
            onClick={() => setLoja("fishing")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-2 px-6 text-sm`}
          >
            <span
              className={`flex flex-col items-center justify-center ${
                loja === "fishing" ? "text-zinc-200" : "text-zinc-200/30"
              } `}
            >
              <FishSimple size={32} />
              Brk Fishing
            </span>
          </button>
          <button
            onClick={() => setLoja("motors")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-2 px-6 text-sm rounded-r-lg ${
              loja === "motors" ? "text-zinc-200" : "text-zinc-200/30"
            }`}
          >
            <span
              className={`flex flex-col items-center justify-center ${
                loja === "motors" ? "text-zinc-200" : "text-zinc-200/30"
              } `}
            >
              <Motorcycle size={32} />
              Brk Motors
            </span>
          </button>
          <button
            onClick={() => setLoja("brk")}
            type="button"
            className={`flex flex-col gap-2 items-center justify-center py-2 px-6 text-sm rounded-r-lg ${
              loja === "motors" ? "text-zinc-200" : "text-zinc-200/30"
            }`}
          >
            <span
              className={`flex flex-col items-center justify-center ${
                loja === "" ? "text-zinc-200" : "text-zinc-200/30"
              } `}
            >
              <Empty size={32} />
              Nenhum
            </span>
          </button>
        </div>

        {/* Escolha do Produto */}
        <div className="fixed max-sm:hidden max-lg:visible right-0 top-[50%] translate-x-[38%] flex flex-col justify-center align-center divide-y z-10 -rotate-90">
          <button
            onClick={() => setTipoDeProduto("camisa")}
            type="button"
            className={`flex gap-2 items-center justify-center py-1 px-4 rounded-t-lg text-sm ${
              tipoDeProduto === "camisa"
                ? "bg-slate-200 text-zinc-950"
                : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"
            }`}
          >
            <Hoodie size={21} />
            Camisas
          </button>
          <button
            onClick={() => setTipoDeProduto("camiseta")}
            type="button"
            className={`hidden flex-col gap-1 items-center justify-center py-4 px-1 text-sm ${
              tipoDeProduto === "camiseta"
                ? "bg-slate-200 text-zinc-950"
                : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"
            }`}
          >
            <Tree size={32} />
            Algodão
          </button>
          <button
            onClick={() => setTipoDeProduto("bone")}
            type="button"
            className={`hidden flex-col gap-2 items-center justify-center py-4 px-1 text-sm ${
              tipoDeProduto === "bone"
                ? "bg-slate-200 text-zinc-950"
                : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"
            }`}
          >
            <BaseballCap size={32} />
            Boné
          </button>
          <button
            onClick={() => setTipoDeProduto("cortavento")}
            type="button"
            className={`hidden flex-col gap-2 items-center justify-center py-4 px-1 text-sm rounded-bl-lg ${
              tipoDeProduto === "cortavento"
                ? "bg-slate-200 text-zinc-950"
                : "text-zinc-200 hover:bg-slate-200 hover:text-slate-950"
            } opacity-15 pointer-events-none`}
          >
            <Hoodie size={32} />
            Corta-vento
          </button>
        </div>

        {/* Formulários */}
        <div className="flex justify-center items-center container z-10">
          <form
            className="flex w-full flex-col justify-center items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <AnimatePresence>
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full max-sm:mx-4 mb-10 ${
                    index % 2 === 0
                      ? "border-b-2 bg-zinc-100/5 backdrop-blur-[5px] border-zinc-600"
                      : ""
                  } rounded-lg p-10`}
                >
                  <button
                    type="button"
                    onClick={() => removeFormInstance(index)}
                    className={`${
                      fields.length === 1 ? "hidden" : "flex"
                    } w-full text-red-400 hover:text-red-300 text-sm gap-1 justify-end`}
                  >
                    <span>Remover</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="flex w-full max-sm:mx-4 max-sm:flex-col justify-center items-center gap-10 my-10">
                    {tipoDeProduto === "camisa" && (
                      <>
                        <div className="flex w-full justify-center items-center gap-10">
                          <div className="flex">
                            <input
                              className="text-zinc-200 cursor-pointer"
                              type="file"
                              multiple
                              {...register(`forms.${index}.imagens`)}
                            />
                          </div>

                          <div className="flex w-full lg:flex-col flex-col gap-10">
                            <div className="flex justify-between">
                              <div className="flex gap-10">
                                <label
                                  className="flex w-full lg:w-1/2 flex-col gap-2 text-zinc-200"
                                  htmlFor="codigo"
                                >
                                  Código
                                  <input
                                    className="bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5 uppercase"
                                    id="codigo"
                                    type="text"
                                    placeholder="Ex: C0..."
                                    required
                                    {...register(`forms.${index}.codigo`)}
                                  />
                                </label>
                                <label
                                  className="flex w-full lg:w-1/2 flex-col gap-2 text-zinc-200"
                                  htmlFor="preco"
                                >
                                  Preço
                                  <CurrencyInput
                                    className="bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                                    id="preco"
                                    placeholder={`${precos.camisa}`}
                                    defaultValue={`${precos.camisa}`}
                                    intlConfig={{
                                      locale: "pt-BR",
                                      currency: "BRL",
                                    }}
                                    {...register(`forms.${index}.preco`)}
                                  />
                                </label>
                              </div>
                              <div className="flex">
                                <label
                                  className="flex w-full lg:w-1/1 flex-col gap-2 text-zinc-200"
                                  htmlFor="preco"
                                >
                                  <span>
                                    Cor{" "}
                                    <small className="opacity-50">
                                      {`(*Se Cód. ALL)`}
                                    </small>
                                  </span>
                                  <input
                                    className="bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                                    id="cor-modelo"
                                    placeholder="(Opcional)"
                                    {...register(`forms.${index}.cor_modelo_all`)}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="flex">
                              <label
                                className="flex w-full flex-col gap-2 text-zinc-200"
                                htmlFor="titulo"
                              >
                                Titulo
                                <input
                                  className="bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                                  id="titulo"
                                  type="text"
                                  placeholder="Ex: Camisa Agro Brk..."
                                  required
                                  {...register(`forms.${index}.titulo`)}
                                  onChange={(value) => {
                                    const newTitulos = [...titulos];
                                    newTitulos[index] = value.target.value;
                                    setTitulos(newTitulos);
                                  }}
                                />
                                <div className="flex justify-between">
                                  <span className="text-zinc-400/50 text-sm font-light">
                                    {(() => {
                                      switch (loja) {
                                        case "agro":
                                          return `Camisa Agro Feminina Brk ${
                                            titulos[index] || ""
                                          } com Proteção Solar UV50+`;
                                        case "fishing":
                                          return `Camisa de Pesca Feminina Brk ${
                                            titulos[index] || ""
                                          } com Proteção Solar UV50+`;
                                        case "motors":
                                          return `Camisa Motociclismo Feminina Brk ${
                                            titulos[index] || ""
                                          } com Proteção Solar UV50+`;
                                        default:
                                          return `${titulos[index] || ""}`;
                                      }
                                    })()}
                                  </span>
                                  <span
                                    className={`${(() => {
                                      const textoCompleto = (() => {
                                        switch (loja) {
                                          case "agro":
                                            return `Camisa Agro Feminina Brk ${
                                              titulos[index] || ""
                                            } com Proteção Solar UV50+`;
                                          case "fishing":
                                            return `Camisa de Pesca Feminina Brk ${
                                              titulos[index] || ""
                                            } com Proteção Solar UV50+`;
                                          case "motors":
                                            return `Camisa Motociclismo Feminina Brk ${
                                              titulos[index] || ""
                                            } com Proteção Solar UV50+`;
                                          default:
                                            return `${titulos[index] || ""}`;
                                        }
                                      })();
                                      return textoCompleto.length > 65
                                        ? "text-red-400/90 font-extrabold text-2xl"
                                        : "text-green-400/90";
                                    })()} text-sm font-light`}
                                  >
                                    {(() => {
                                      switch (loja) {
                                        case "agro":
                                          return `Camisa Agro Feminina Brk ${
                                            titulos[index] || ""
                                          } com Proteção Solar UV50+`.length;
                                        case "fishing":
                                          return `Camisa de Pesca Feminina Brk ${
                                            titulos[index] || ""
                                          } com Proteção Solar UV50+`.length;
                                        case "motors":
                                          return `Camisa Motociclismo Feminina Brk ${
                                            titulos[index] || ""
                                          } com Proteção Solar UV50+`.length;
                                        default:
                                          return (titulos[index] || "").length;
                                      }
                                    })()}
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Variações de Gêneros */}
                          <div className="flex w-auto">
                            <div className="flex flex-coljustify-center border border-slate-200/10 p-4 gap-10">
                              <div className="flex flex-col gap-4">
                                <div>
                                  <label
                                    className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                                    htmlFor={`tamanho-masculino-${index}`}
                                  >
                                    <input
                                      id={`tamanho-masculino-${index}`}
                                      type="checkbox"
                                      {...register(
                                        `forms.${index}.tamanho_masculino`
                                      )}
                                      defaultChecked={true}
                                    />
                                    <span className="text-zinc-200">
                                      Masculino
                                    </span>
                                  </label>
                                </div>
                                <div>
                                  <label
                                    className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                                    htmlFor={`tamanho-feminino-${index}`}
                                  >
                                    <input
                                      id={`tamanho-feminino-${index}`}
                                      type="checkbox"
                                      {...register(
                                        `forms.${index}.tamanho_feminino`
                                      )}
                                      defaultChecked={true}
                                    />
                                    <span className="text-zinc-200">
                                      Feminino
                                    </span>
                                  </label>
                                </div>
                                <div>
                                  <label
                                    className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                                    htmlFor={`tamanho-infantil-${index}`}
                                  >
                                    <input
                                      id={`tamanho-infantil-${index}`}
                                      type="checkbox"
                                      {...register(
                                        `forms.${index}.tamanho_infantil`
                                      )}
                                      defaultChecked={true}
                                    />
                                    <span className="text-zinc-200">
                                      Infantil
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Botões para adicionar novo produto */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addFormInstance}
              className="self-end mb-10 py-2 px-10 border border-zinc-400 rounded-lg text-zinc-200 hover:bg-zinc-800"
            >
              Adicionar
            </motion.button>

            {/* Botões de ação */}
            <div className="flex container items-center justify-between mt-10 pt-10 py-2 border-t border-zinc-800 gap-8">
              <div className="flex gap-10">
                <label
                  className="flex gap-2 items-center justify-center cursor-pointer"
                  htmlFor="is_all"
                >
                  <input
                    id="is_all"
                    type="checkbox"
                    className="w-4 h-4"
                    {...register(`is_all`, {
                      onChange: (e) =>
                        setTipoCadastro(
                          e.target.checked ? "is_all" : "planilha"
                        ),
                    })}
                  />
                  <span className="text-zinc-200">All</span>
                </label>
                <input
                  className={`${
                    tipoCadastro === "is_all" ? "flex" : "hidden"
                  } min-w-[600px] bg-transparent text-zinc-400 placeholder:text-zinc-400/80 placeholder:text-sm border-b border-b-zinc-700 py-1.5`}
                  type="text"
                  {...register(`titulo_all`)}
                  placeholder="Título do produto ALL"
                />
                <input
                  className={`${
                    tipoCadastro === "is_all" ? "flex" : "hidden"
                  } min-w-[60px] bg-transparent text-zinc-400 placeholder:text-zinc-400/80 placeholder:text-sm border-b border-b-zinc-700 py-1.5`}
                  type="text"
                  {...register(`codigo_all`)}
                  placeholder="Código produto ALL"
                />
              </div>

              <button
                onClick={() => {
                  setTipoCadastro("planilha");
                }}
                type="submit"
                className={`py-2 px-10 border border-transparent hover:border-zinc-400 rounded-lg text-zinc-200 ${
                  carregando &&
                  "pointer-events-none cursor-not-allowed opacity-5"
                }`}
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
                className={`hidden py-2 px-10 border border-transparent hover:border-zinc-400 rounded-lg text-zinc-200 ${
                  carregando &&
                  "pointer-events-none cursor-not-allowed opacity-5"
                }`}
              >
                {carregando ? (
                  <span className="flex justify-center items-center">
                    <CircleNotch size={20} className="animate-spin mr-4" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex justify-center items-center gap-2">
                    <ListPlus size={32} /> Cadastrar no Bling
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setTipoCadastro("bling");
                }}
                type="submit"
                className={`hidden py-2 px-10 border border-transparent hover:border-zinc-400 rounded-lg text-zinc-200 ${
                  carregando &&
                  "pointer-events-none cursor-not-allowed opacity-5"
                }`}
              >
                {carregando ? (
                  <span className="flex justify-center items-center">
                    <CircleNotch size={20} className="animate-spin mr-4" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex justify-center items-center gap-2">
                    <ListPlus size={32} /> Cadastrar no Bling
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
