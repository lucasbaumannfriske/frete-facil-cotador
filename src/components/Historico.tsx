
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CotacaoSalva, Transportadora, Produto } from "@/types";
import HistoricoItem from "./HistoricoItem";
import { TruckIcon, ChevronDown, MapPinIcon } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useCotacoes } from "@/hooks/useCotacoes";
import { toast } from "sonner";

interface HistoricoProps {
  historico: CotacaoSalva[];
  setHistorico: (historico: CotacaoSalva[]) => void;
  loading?: boolean;
}

const Historico = ({ historico, loading = false }: HistoricoProps) => {
  const { atualizarCotacao, deletarCotacao } = useCotacoes();
  const [itemEditando, setItemEditando] = useState<string | null>(null);
  const [cotacaoEmEdicao, setCotacaoEmEdicao] = useState<CotacaoSalva | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Toggle the expanded/collapsed state of an item
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Função para remover uma cotação do histórico
  const removerCotacao = async (id: string) => {
    const sucesso = await deletarCotacao(id);
    if (sucesso) {
      setExpandedItems(prev => prev.filter(item => item !== id));
    }
  };

  // Função para iniciar a edição de uma cotação
  const editarCotacao = (id: string) => {
    const cotacao = historico.find((item) => item.id === id);
    if (cotacao) {
      setItemEditando(id);
      setCotacaoEmEdicao(JSON.parse(JSON.stringify(cotacao))); // Deep clone para evitar referências
      
      // Expand the item when editing
      if (!expandedItems.includes(id)) {
        setExpandedItems([...expandedItems, id]);
      }
    }
  };

  // Função para salvar as edições feitas em uma cotação
  const salvarEdicao = async () => {
    if (!cotacaoEmEdicao) {
      toast.error("Nenhuma cotação em edição");
      return;
    }

    console.log("Salvando cotação editada:", cotacaoEmEdicao);
    
    try {
      const sucesso = await atualizarCotacao(cotacaoEmEdicao);
      
      if (sucesso) {
        setItemEditando(null);
        setCotacaoEmEdicao(null);
        toast.success("Cotação atualizada com sucesso!");
      } else {
        toast.error("Erro ao salvar as alterações");
      }
    } catch (error) {
      console.error("Erro ao salvar cotação:", error);
      toast.error("Erro inesperado ao salvar");
    }
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
        { id: Date.now().toString(), nome: "", quantidade: 1, peso: "", embalagem: "" }
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
  const atualizarStatus = async (transportadoraIndex: number, status: string) => {
    if (!cotacaoEmEdicao) return;

    const novasTransportadoras = [...cotacaoEmEdicao.transportadoras];
    novasTransportadoras[transportadoraIndex] = {
      ...novasTransportadoras[transportadoraIndex],
      status: status
    };

    const cotacaoAtualizada = {
      ...cotacaoEmEdicao,
      transportadoras: novasTransportadoras
    };

    const sucesso = await atualizarCotacao(cotacaoAtualizada);
    
    if (sucesso) {
      setCotacaoEmEdicao(cotacaoAtualizada);
      toast.success("Status atualizado com sucesso!");
    }
  };
  
  // Função para atualizar a proposta final de uma transportadora
  const atualizarPropostaFinal = async (transportadoraIndex: number, propostaFinal: string) => {
    if (!cotacaoEmEdicao) return;

    const novasTransportadoras = [...cotacaoEmEdicao.transportadoras];
    novasTransportadoras[transportadoraIndex] = {
      ...novasTransportadoras[transportadoraIndex],
      propostaFinal: propostaFinal
    };

    const cotacaoAtualizada = {
      ...cotacaoEmEdicao,
      transportadoras: novasTransportadoras
    };

    const sucesso = await atualizarCotacao(cotacaoAtualizada);
    
    if (sucesso) {
      setCotacaoEmEdicao(cotacaoAtualizada);
      toast.success("Proposta final atualizada com sucesso!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <TruckIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50 animate-pulse" />
          <p className="text-muted-foreground">Carregando cotações...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TruckIcon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Histórico de Cotações</h2>
      </div>
      
      <ScrollArea className="h-[600px] pr-4 overflow-y-auto">
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
          <div className="space-y-3">
            {historico.map((item) => {
              // Use a cotação em edição se estivermos editando este item
              const itemParaExibir = (itemEditando === item.id && cotacaoEmEdicao) ? cotacaoEmEdicao : item;
              
              return (
                <Collapsible 
                  key={item.id} 
                  open={expandedItems.includes(item.id)}
                  onOpenChange={() => toggleExpand(item.id)}
                  className="border rounded-md overflow-hidden"
                >
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <TruckIcon className="h-5 w-5 text-primary" />
                        <div className="font-medium">{itemParaExibir.cliente} <span className="text-muted-foreground">(Tomador do Serviço)</span></div>
                      </div>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-x-6 mt-1">
                        {itemParaExibir.origem && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5 text-primary" />
                            <span className="font-medium">Origem:</span> {itemParaExibir.origem}
                          </div>
                        )}
                        {itemParaExibir.destino && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5 text-destructive" />
                            <span className="font-medium">Destino:</span> {itemParaExibir.destino}
                          </div>
                        )}
                        <div className="ml-auto">
                          {itemParaExibir.data}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${expandedItems.includes(item.id) ? 'transform rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-t bg-muted/10">
                    <HistoricoItem
                      item={itemParaExibir}
                      removerCotacao={() => removerCotacao(item.id)}
                      editarCotacao={() => editarCotacao(item.id)}
                      modoEdicao={itemEditando === item.id}
                      salvarEdicao={salvarEdicao}
                      cancelarEdicao={cancelarEdicao}
                      atualizarTransportadora={atualizarTransportadora}
                      atualizarStatus={atualizarStatus}
                      atualizarCampo={atualizarCampo}
                      atualizarProduto={atualizarProduto}
                      adicionarProduto={adicionarProduto}
                      removerProduto={removerProduto}
                      atualizarPropostaFinal={atualizarPropostaFinal}
                    />
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Historico;
