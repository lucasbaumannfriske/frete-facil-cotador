
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

  // Função para remover uma cotação do histórico
  const removerCotacao = (id: string) => {
    const novoCotacoes = historico.filter((item) => item.id !== id);
    setHistorico(novoCotacoes);
    localStorage.setItem("cotacoes", JSON.stringify(novoCotacoes));
    toast.success("Cotação removida com sucesso!");
  };

  // Função para iniciar a edição de uma cotação
  const editarCotacao = (id: string) => {
    const cotacao = historico.find((item) => item.id === id);
    if (cotacao) {
      setItemEditando(id);
      setCotacaoEmEdicao(JSON.parse(JSON.stringify(cotacao))); // Deep clone para evitar referências
    }
  };

  // Função para salvar as edições feitas em uma cotação
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

  // Função para cancelar a edição
  const cancelarEdicao = () => {
    setItemEditando(null);
    setCotacaoEmEdicao(null);
  };

  // Função para atualizar uma transportadora durante a edição
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

  // Função para atualizar um campo da cotação durante a edição
  const atualizarCampo = (campo: keyof CotacaoSalva, valor: string) => {
    if (!cotacaoEmEdicao) return;

    setCotacaoEmEdicao({
      ...cotacaoEmEdicao,
      [campo]: valor,
    });
  };

  // Função para atualizar um produto durante a edição
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

  // Função para adicionar um novo produto durante a edição
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

  // Função para remover um produto durante a edição
  const removerProduto = (produtoIndex: number) => {
    if (!cotacaoEmEdicao || cotacaoEmEdicao.produtos.length <= 1) return;

    const novosProdutos = cotacaoEmEdicao.produtos.filter((_, idx) => idx !== produtoIndex);
    
    setCotacaoEmEdicao({
      ...cotacaoEmEdicao,
      produtos: novosProdutos
    });
  };

  // Função para atualizar o status de uma transportadora
  const atualizarStatus = (cotacaoId: string, transportadoraIndex: number, status: string) => {
    if (cotacaoEmEdicao && cotacaoEmEdicao.id === cotacaoId) {
      atualizarTransportadora(transportadoraIndex, "status", status);
    } else {
      // Atualizar status diretamente sem edição completa
      const novasCotacoes = historico.map(item => {
        if (item.id === cotacaoId) {
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
  
  // Função para atualizar a proposta final de uma transportadora
  const atualizarPropostaFinal = (cotacaoId: string, transportadoraIndex: number, propostaFinal: string) => {
    if (cotacaoEmEdicao && cotacaoEmEdicao.id === cotacaoId) {
      atualizarTransportadora(transportadoraIndex, "propostaFinal", propostaFinal);
    } else {
      // Atualizar proposta final diretamente sem edição completa
      const novasCotacoes = historico.map(item => {
        if (item.id === cotacaoId) {
          const novasTransportadoras = [...item.transportadoras];
          novasTransportadoras[transportadoraIndex] = {
            ...novasTransportadoras[transportadoraIndex],
            propostaFinal: propostaFinal
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
          <div className="space-y-4">
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
                atualizarStatus={(transportadoraIndex, status) => atualizarStatus(item.id, transportadoraIndex, status)}
                atualizarCampo={atualizarCampo}
                atualizarProduto={atualizarProduto}
                adicionarProduto={adicionarProduto}
                removerProduto={removerProduto}
                atualizarPropostaFinal={(transportadoraIndex, proposta) => atualizarPropostaFinal(item.id, transportadoraIndex, proposta)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Historico;
