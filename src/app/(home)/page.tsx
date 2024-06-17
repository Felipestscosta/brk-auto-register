import Image from "next/image";

const precos = {
    camisa: 154.9,
    camiseta: 94.9,
    bone: 129.9,
    cortaVento: 229.9
}

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center container gap-24">
        {/* Escolha do Produto */}
        <div className="flex justify-center align-center gap-10">
          <button className="flex rounded-lg px-6 py-3 bg-slate-200 text-slate-950">Camiseta</button>
          <button className="flex border border-zinc-200 rounded-lg px-6 py-3 hover:bg-slate-200 hover:text-slate-950">Camisa</button>
          <button className="flex border border-zinc-200 rounded-lg px-6 py-3 hover:bg-slate-200 hover:text-slate-950">Boné</button>
          <button className="flex border border-zinc-200 rounded-lg px-6 py-3 hover:bg-slate-200 hover:text-slate-950">Corta-vento</button>
        </div>

        {/* Formulários */}
        <div className="flex">
          <form className="flex flex-col justify-center items-center gap-10" encType="">

            <input type="file" name="" id="" multiple/>

            <div className="flex gap-4">
                <label className="flex flex-col gap-2" htmlFor="codigo">
                  Código
                  <input className="bg-transparent text-zinc-200 placeholder:text-sm border px-4 py-1.5 uppercase rounded-md" id="codigo" type="text" placeholder="Ex: C0..."/>
                </label>
                <label className="flex flex-col gap-2" htmlFor="titulo">
                  Titulo
                  <input className="bg-transparent text-zinc-200 placeholder:text-sm border px-4 py-1.5 rounded-md" id="titulo" type="text" placeholder="Ex: Camisa Agro Brk..."/>
                </label>
                <label className="flex flex-col gap-2" htmlFor="estoque">
                  Estoque
                  <input className="bg-transparent text-zinc-200 placeholder:text-sm border px-4 py-1.5 rounded-md" id="estoque" type="text" placeholder="Ex: C0..." defaultValue={1000}/>
                </label>
                <label className="flex flex-col gap-2" htmlFor="preco">
                  Preço ( R$ )
                  <input className="bg-transparent text-zinc-200 placeholder:text-sm border px-4 py-1.5 rounded-md" id="preco" type="text" defaultValue={precos.camisa}/>
                </label>
            </div>

            <div className="flex gap-4">
              <button className="pb-2 border-b-2 b-zinc-200">Tamanhos</button>
              <button className="pb-2 border-b-2 border-transparent hover:border-b-2 hover:border-zinc-200">Cores</button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
