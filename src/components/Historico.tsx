
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CotacaoSalva, Transportadora, Produto } from "@/types";
import HistoricoItem from "./HistoricoItem";
import { toast } from "sonner";
import { TruckIcon } from "lucide-react";

interface HistoricoProps {
  historico: CotacaoSalva[];
  setHistorico: (historico: CotacaoSalva[]) => void;
}

const Historico = ({ historico, setHistorico }: HistoricoProps) => {
  const [itemEditando, setItemEditando] = useState<string | null>(null);
  const [cotacaoEmEdicao, setCotacaoEmEdicao] = useState<CotacaoSalva | null>(null);

  const removerCotacao = (id: string) => {
    const novoCotacoes = historico.filter((item) => item.id !== id);
    setHistorico(novoCotacoes);
    localStorage.setItem("cotacoes", JSON.stringify(novoCotacoes));
    toast.success("Cotação removida com sucesso!");
  };

  const editarCotacao = (id: string) => {
    const cotacao = historico.find((item) => item.id === id);
    if (cotacao) {
      setItemEditando(id);
      setCotacaoEmEdicao({ ...cotacao });
    }
  };

  const salvarEdicao = () => {
    if (!cotacaoEmEdicao) return;

    const novoCotacoes = historico.map((item) =>
      item.id === cotacaoEmEdicao.id ? cotacaoEmEdicao : item
    );

    setHistorico(novoCotacoes);
    localStorage.setItem("cotacoes", JSON.stringify(novoCotacoes));
    setItemEditando(null);
    setCotacaoEmEdicao(null);
    toast.success("Cotação atualizada com sucesso!");
  };

  const cancelarEdicao = () => {
    setItemEditando(null);
    setCotacaoEmEdicao(null);
  };

  const atualizarTransportadora = (
    transportadoraIndex: number, 
    campo: keyof Transportadora, 
    valor: string
  ) => {
    if (!cotacaoEmEdicao) return;

    const novasTransportadoras = [...cotacaoEmEdicao.transportadoras];
    novasTransportadoras[transportadoraIndex] = {
      ...novasTransportadoras[transportadoraIndex],
      [campo]: valor,
    };

    setCotacaoEmEdicao({
      ...cotacaoEmEdicao,
      transportadoras: novasTransportadoras,
    });
  };

  const atualizarCampo = (campo: keyof CotacaoSalva, valor: string) => {
    if (!cotacaoEmEdicao) return;

    setCotacaoEmEdicao({
      ...cotacaoEmEdicao,
      [campo]: valor,
    });
  };

  const atualizarProduto = (
    produtoIndex: number,
    campo: keyof Produto,
    valor: string | number
  ) => {
    if (!cotacaoEmEdicao) return;

    const novosProdutos = [...cotacaoEmEdicao.produtos];
    novosProdutos[produtoIndex] = {
      ...novosProdutos[produtoIndex],
      [campo]: valor,
    };

    setCotacaoEmEdicao({
      ...cotacaoEmEdicao,
      produtos: novosProdutos,
    });
  };

  const adicionarProduto = () => {
    if (!cotacaoEmEdicao) return;

    setCotacaoEmEdicao({
      ...cotacaoEmEdicao,
      produtos: [
        ...cotacaoEmEdicao.produtos,
        { id: Date.now().toString(), nome: "", quantidade: 1, peso: "" }
      ]
    });
  };

  const removerProduto = (produtoIndex: number) => {
    if (!cotacaoEmEdicao || cotacaoEmEdicao.produtos.length <= 1) return;

    const novosProdutos = cotacaoEmEdicao.produtos.filter((_, idx) => idx !== produtoIndex);
    
    setCotacaoEmEdicao({
      ...cotacaoEmEdicao,
      produtos: novosProdutos
    });
  };

  const atualizarStatus = (transportadoraIndex: number, status: string) => {
    if (cotacaoEmEdicao) {
      atualizarTransportadora(transportadoraIndex, "status", status);
    } else {
      // Atualizar status diretamente sem edição completa
      const cotacaoAtual = historico.find(item => item.id === itemEditando);
      if (!cotacaoAtual) return;
      
      const novasCotacoes = historico.map(item => {
        if (item.id === cotacaoAtual.id) {
          const novasTransportadoras = [...item.transportadoras];
          novasTransportadoras[transportadoraIndex] = {
            ...novasTransportadoras[transportadoraIndex],
            status: status
          };
          return {...item, transportadoras: novasTransportadoras};
        }
        return item;
      });
      
      setHistorico(novasCotacoes);
      localStorage.setItem("cotacoes", JSON.stringify(novasCotacoes));
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <TruckIcon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Histórico de Cotações</h2>
      </div>
      
      <ScrollArea className="max-h-[600px] pr-4">
        {historico.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <TruckIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              Nenhuma cotação salva ainda.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              As cotações salvas aparecerão aqui.
            </p>
          </div>
        ) : (
          <div>
            {historico.map((item) => (
              <HistoricoItem
                key={item.id}
                item={cotacaoEmEdicao && item.id === cotacaoEmEdicao.id ? cotacaoEmEdicao : item}
                removerCotacao={removerCotacao}
                editarCotacao={editarCotacao}
                modoEdicao={itemEditando === item.id}
                salvarEdicao={salvarEdicao}
                cancelarEdicao={cancelarEdicao}
                atualizarTransportadora={atualizarTransportadora}
                atualizarStatus={atualizarStatus}
                atualizarCampo={atualizarCampo}
                atualizarProduto={atualizarProduto}
                adicionarProduto={adicionarProduto}
                removerProduto={removerProduto}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Historico;
