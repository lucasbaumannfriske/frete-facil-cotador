
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CotacaoSalva, Transportadora } from "@/types";
import HistoricoItem from "./HistoricoItem";
import { toast } from "sonner";

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
      setCotacaoEmEdicao(JSON.parse(JSON.stringify(cotacao)));
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
      <h2>Histórico de Cotações</h2>
      <ScrollArea className="max-h-[600px] pr-4">
        {historico.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma cotação salva.
          </p>
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
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Historico;
