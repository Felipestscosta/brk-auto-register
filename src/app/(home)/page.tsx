"use client";

import { writeFileXLSX, utils } from "xlsx";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";

type esquemaDeDadosFormulario = {
  codigo: string;
  titulo: string;
  estoque: string;
  preco: string;

  tamanho_masculino: string;
  tamanho_feminino: string;
  tamanho_infantil: string;

  cor_masculino: string;
  cor_feminino: string;
  cor_infantil: string;
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
      tamanhos: ["PP", "P", "M", "G", "GG", "G1"],
    },
    preto: {
      tamanhos: ["PP", "P", "M", "G", "GG", "G1"],
    },
    azul: {
      tamanhos: ["PP", "P", "M", "G", "GG", "G1"],
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
  const [tipoDeProduto, setTipoDeProduto] = useState("camisa");
  const [tipoAlgodao, setTipoAlgodao] = useState("comalgodao");

  //Caputura do Formulário
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<esquemaDeDadosFormulario>();

  const onSubmit: SubmitHandler<esquemaDeDadosFormulario> = (data) => {
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
        codigo_pai: data.codigo.toLocaleUpperCase(),
        marca: "Brk Agro", // backlog Loja
        url_imagens_externas: "", //backlog clodinary
      },
    ];

    var variacaoDeProduto: any = [...primeiraLinhaDaPlanilha];
    if (tipoDeProduto === "camisa") {
      if (data.tamanho_masculino) {
        relacaoDeTamanhos[0].masculino.tamanhos.map((item) => {
          variacaoDeProduto.push({
            codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
            descricao: `Gênero: Masculino;Tamanho: ${item.nome}`,
            estoque: item.nome === "G3" || item.nome === "G4" ? 0 : estoque,
            preco:
              item.nome === "G3" || item.nome === "G4" ? preco + 20 : preco,
            produto_variacao: "Variação",
            tipo_producao: "Terceiros", // backlog Bling 1
            tipo_do_item: "Mercadoria para Revenda",
            codigo_pai: data.codigo.toLocaleUpperCase(),
            marca: "Brk Agro", // backlog Loja
            url_imagens_externas: "", //backlog clodinary
          });
        });
      }

      if (data.tamanho_feminino) {
        relacaoDeTamanhos[0].feminino.tamanhos.map((item) => {
          variacaoDeProduto.push({
            codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
            descricao: `Gênero: Feminino;Tamanho: ${item.nome}`,
            estoque: estoque,
            preco: preco,
            produto_variacao: "Variação",
            tipo_producao: "Terceiros", // backlog Bling 1
            tipo_do_item: "Mercadoria para Revenda",
            codigo_pai: data.codigo.toLocaleUpperCase(),
            marca: "Brk Agro", // backlog Loja
            url_imagens_externas: "", //backlog clodinary
          });
        });
      }

      if (data.tamanho_infantil) {
        relacaoDeTamanhos[0].infantil.tamanhos.map((item) => {
          variacaoDeProduto.push({
            codigo: `${data.codigo.toLocaleUpperCase()}${item.sigla_camisa}`,
            descricao: `Gênero: Infantil;Tamanho: ${item.nome}`,
            estoque: estoque,
            preco: preco,
            produto_variacao: "Variação",
            tipo_producao: "Terceiros", // backlog Bling 1
            tipo_do_item: "Mercadoria para Revenda",
            codigo_pai: data.codigo.toLocaleUpperCase(),
            marca: "Brk Agro", // backlog Loja
            url_imagens_externas: "", //backlog clodinary
          });
        });
      }
    }

    geraPlanilha(variacaoDeProduto);
  };

  // Planinha
  async function geraPlanilha(dadosDaPlanilha: any) {
    const rows = Array.from(dadosDaPlanilha).map((row: any) => ({
      ID: "",
      Código: row.codigo, // Dinâmico
      Descrição: row.descricao, // Dinâmico
      Unidade: "UN",
      NCM: "6101.30.00",
      Origem: "0",
      Preço: row.preco, // Dinâmico
      "Valor IPI fixo": "0",
      Observações: "",
      Situação: "Ativo",
      Estoque: row.estoque, // Dinâmico
      "Preço de custo": "55",
      "Cód. no fornecedor": "",
      Fornecedor: "",
      Localização: "",
      "Estoque máximo": "0",
      "Estoque mínimo": "0",
      "Peso líquido (Kg)": "0,25",
      "Peso bruto (Kg)": "0,25",
      "GTIN/EAN": "", // Dinâmico
      "GTIN/EAN da Embalagem": "", // Dinâmico
      "Largura do produto": "1",
      "Altura do Produto": "11",
      "Profundidade do produto": "16",
      "Data Validade": "",
      "Descrição do Produto no Fornecedor": "",
      "Descrição Complementar": "",
      "Itens p/ caixa": "",
      "Produto Variação": row.produto_variacao, // Dinâmico
      "Tipo Produção": row.tipo_producao, // Dinâmico
      "Classe de enquadramento do IPI": "",
      "Código na Lista de Serviços": "",
      "Tipo do item": row.tipo_do_item, // Dinâmico
      "Grupo de Tags/Tags": "",
      Tributos: "0",
      "Código Pai": row.codigo, // Dinâmico
      "Código Integração": "0",
      "Grupo de produtos": "",
      Marca: row.marca, // Dinâmico
      CEST: "28.038.00",
      Volumes: "1",
      "Descrição Curta": "",
      "Cross-Docking": "",
      "URL Imagens Externas": row.url_imagens_externas, // Dinâmico
      "Link Externo": "",
      "Meses Garantia no Fornecedor": "0",
      "Clonar dados do pai": "NÂO",
      "Condição do Produto": "NOVO",
      "Frete Grátis": "NÂO",
      "Número FCI": "",
      Vídeo: "",
      Departamento: "",
      "Unidade de Medida": "Centímetro",
      "Preço de Compra": "0",
      "Valor base ICMS ST para retenção": "0",
      "Valor ICMS ST para retenção": "0",
      "Valor ICMS próprio do substituto": "0",
      "Categoria do produto": "",
      "Informações Adicionais": "",
    }));

    const worksheet = utils.json_to_sheet(rows);

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "");
    writeFileXLSX(workbook, "cadastro-produtos.xlsx", { compression: true });
  }

  //geraPlanilha();

  return (
    <>
      <div className="flex flex-col h-full w-full items-center justify-center gap-24 bg-gradient-to-r from-zinc-800 to-zinc-950">
        {/* Escolha do Produto */}
        <div className="flex justify-center align-center gap-10">
          <button
            onClick={() => setTipoDeProduto("camisa")}
            type="button"
            className={`flex border border-zinc-200 rounded-lg px-6 py-3 ${
              tipoDeProduto === "camisa"
                ? "bg-slate-200 text-zinc-950"
                : "hover:bg-slate-200 hover:text-slate-950"
            }`}
          >
            Camisa
          </button>
          <button
            onClick={() => setTipoDeProduto("camiseta")}
            type="button"
            className={`flex border border-zinc-200 rounded-lg px-6 py-3 ${
              tipoDeProduto === "camiseta"
                ? "bg-slate-200 text-zinc-950"
                : "hover:bg-slate-200 hover:text-slate-950"
            } opacity-15 pointer-events-none`}
          >
            Camiseta
          </button>
          <button
            onClick={() => setTipoDeProduto("bone")}
            type="button"
            className={`flex border border-zinc-200 rounded-lg px-6 py-3 ${
              tipoDeProduto === "bone"
                ? "bg-slate-200 text-zinc-950"
                : "hover:bg-slate-200 hover:text-slate-950"
            } opacity-15 pointer-events-none`}
          >
            Boné
          </button>
          <button
            onClick={() => setTipoDeProduto("cortavento")}
            type="button"
            className={`flex border border-zinc-200 rounded-lg px-6 py-3 ${
              tipoDeProduto === "cortavento"
                ? "bg-slate-200 text-zinc-950"
                : "hover:bg-slate-200 hover:text-slate-950"
            } opacity-15 pointer-events-none`}
          >
            Corta-vento
          </button>
        </div>

        {/* Formulários */}
        <div className="flex">
          <form
            className="flex flex-col justify-center items-center gap-10"
            encType=""
            onSubmit={handleSubmit(onSubmit)}
          >
            {tipoDeProduto === "camisa" && (
              <>
                <label
                  className="flex bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 border-dashed w-full justify-center items-center cursor-pointer mb-10 mt-4 p-8 rounded-lg"
                  htmlFor="imagens"
                >
                  <input
                    className="cursor-pointer"
                    type="file"
                    name=""
                    id="imagens"
                    multiple
                  />
                </label>

                <div className="flex gap-10 mb-16">
                  <label className="flex flex-col gap-2" htmlFor="codigo">
                    Código
                    <input
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5 uppercase"
                      id="codigo"
                      type="text"
                      placeholder="Ex: C0..."
                      {...register("codigo")}
                      defaultValue={`C0`}
                    />
                  </label>
                  <label className="flex flex-col gap-2" htmlFor="titulo">
                    Titulo
                    <input
                      className="min-w-96 bg-transparent text-zinc-400 placeholder:text-zinc-400/25 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="titulo"
                      type="text"
                      placeholder="Ex: Camisa Agro Brk..."
                      {...register("titulo")}
                      defaultValue={`Camisa Agro Brk `}
                    />
                  </label>
                  <label className="flex flex-col gap-2" htmlFor="estoque">
                    Estoque
                    <input
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="estoque"
                      type="text"
                      placeholder="Ex: C0..."
                      defaultValue={10000}
                      {...register("estoque")}
                    />
                  </label>
                  <label className="flex flex-col gap-2" htmlFor="preco">
                    Preço ( R$ )
                    <input
                      className="max-w-32 bg-transparent text-zinc-400 placeholder:text-sm border-b border-b-zinc-700 py-1.5"
                      id="preco"
                      type="text"
                      defaultValue={precos.camisa}
                      {...register("preco")}
                    />
                  </label>
                </div>

                {/* Variações de Gêneros */}
                <div className="flex gap-4">
                  <label
                    className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                    htmlFor="tamanho-masculino"
                  >
                    <input
                      id="tamanho-masculino"
                      type="checkbox"
                      {...register("tamanho_masculino")}
                      defaultChecked={true}
                    />
                    <span>Masculino</span>
                  </label>
                  <label
                    className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                    htmlFor="tamanho-feminino"
                  >
                    <input
                      id="tamanho-feminino"
                      type="checkbox"
                      {...register("tamanho_feminino")}
                      defaultChecked={true}
                    />
                    <span>Feminino</span>
                  </label>
                  <label
                    className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                    htmlFor="tamanho-infantil"
                  >
                    <input
                      id="tamanho-infantil"
                      type="checkbox"
                      {...register("tamanho_infantil")}
                      defaultChecked={true}
                    />
                    <span>Infantil</span>
                  </label>
                </div>
              </>
            )}

            {tipoDeProduto === "camiseta" && (
              <>
                <input type="file" name="" id="" multiple />

                <div className="flex gap-4 mb-16">
                  <label className="flex flex-col gap-2" htmlFor="codigo">
                    Código
                    <input
                      className="max-w-32 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5 uppercase"
                      id="codigo"
                      type="text"
                      placeholder="Ex: APC0..."
                    />
                  </label>
                  <label className="flex flex-col gap-2" htmlFor="titulo">
                    Titulo
                    <input
                      className="min-w-96 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5"
                      id="titulo"
                      type="text"
                      placeholder="Ex: Camiseta Agro Brk..."
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
                      defaultValue={precos.camiseta}
                    />
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setTipoAlgodao("comalgodao")}
                    type="button"
                    className={`pb-2 ${
                      tipoAlgodao === "comalgodao"
                        ? "border-b b-zinc-200"
                        : "border-b border-transparent hover:border-b hover:border-zinc-200"
                    }`}
                  >
                    Com Algodão Egípcio
                  </button>
                  <button
                    onClick={() => setTipoAlgodao("semalgodao")}
                    type="button"
                    className={`pb-2 ${
                      tipoAlgodao === "semalgodao"
                        ? "border-b b-zinc-200"
                        : "border-b border-transparent hover:border-b hover:border-zinc-200"
                    }`}
                  >
                    Sem Algodão Egípcio
                  </button>
                </div>

                {tipoAlgodao === "semalgodao" && (
                  // Variações de Gêneros
                  <div className="flex gap-4">
                    <label
                      className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                      htmlFor="genero-masculino"
                    >
                      <input
                        id="genero-masculino"
                        type="checkbox"
                        name=""
                        defaultChecked={true}
                      />
                      <span>Masculino</span>
                    </label>
                    <label
                      className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                      htmlFor="genero-feminino"
                    >
                      <input
                        id="genero-feminino"
                        type="checkbox"
                        name=""
                        defaultChecked={true}
                      />
                      <span>Feminino</span>
                    </label>
                    <label
                      className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                      htmlFor="genero-infantil"
                    >
                      <input
                        id="genero-infantil"
                        type="checkbox"
                        name=""
                        defaultChecked={true}
                      />
                      <span>Infantil</span>
                    </label>
                  </div>
                )}

                {tipoAlgodao === "comalgodao" && (
                  // Variações de Cores
                  <div className="flex gap-4">
                    <label
                      className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                      htmlFor="genero-masculino"
                    >
                      <input
                        id="genero-masculino"
                        type="checkbox"
                        name=""
                        defaultChecked={true}
                      />
                      <span>Branco</span>
                    </label>
                    <label
                      className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                      htmlFor="genero-feminino"
                    >
                      <input
                        id="genero-feminino"
                        type="checkbox"
                        name=""
                        defaultChecked={true}
                      />
                      <span>Preto</span>
                    </label>
                    <label
                      className="flex gap-4 border border-zinc-800 py-4 px-10 rounded-lg cursor-pointer"
                      htmlFor="genero-infantil"
                    >
                      <input
                        id="genero-infantil"
                        type="checkbox"
                        name=""
                        defaultChecked={true}
                      />
                      <span>Azul</span>
                    </label>
                  </div>
                )}
              </>
            )}

            {tipoDeProduto === "bone" && (
              <>
                <input type="file" name="" id="" multiple />

                <div className="flex gap-4">
                  <label className="flex flex-col gap-2" htmlFor="codigo">
                    Código
                    <input
                      className="max-w-32 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5 uppercase"
                      id="codigo"
                      type="text"
                      placeholder="Ex: BA0..."
                    />
                  </label>
                  <label className="flex flex-col gap-2" htmlFor="titulo">
                    Titulo
                    <input
                      className="min-w-96 bg-transparent text-zinc-200 placeholder:text-sm border-b border-r-0 border-l-0 border-t-0 py-1.5"
                      id="titulo"
                      type="text"
                      placeholder="Ex: Boné Agro Brk..."
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
                      defaultValue={precos.bone}
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
              <div className="flex container items-center justify-center mt-32 pt-10 py-2 px-10 border-t border-zinc-800">
                <button
                  type="submit"
                  className="py-2 px-10 border border-transparent hover:border-zinc-400 rounded-lg"
                >
                  Gerar Planilha
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
