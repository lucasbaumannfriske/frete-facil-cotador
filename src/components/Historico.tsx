
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CotacaoSalva, Transportadora, Produto } from "@/types";
import HistoricoItem from "./HistoricoItem";
import GerenciadorUsuarios from "./GerenciadorUsuarios";
import { toast } from "sonner";
import { TruckIcon, ChevronDown, MapPinIcon, User } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HistoricoProps {
  historico: CotacaoSalva[];
  setHistorico: (historico: CotacaoSalva[]) => void;
}

const Historico = ({ historico, setHistorico }: HistoricoProps) => {
  const [itemEditando, setItemEditando] = useState<string | null>(null);
  const [cotacaoEmEdicao, setCotacaoEmEdicao] = useState<CotacaoSalva | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("cotacoes");

  // Toggle the expanded/collapsed state of an item
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

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
      
      // Expand the item when editing
      if (!expandedItems.includes(id)) {
        setExpandedItems([...expandedItems, id]);
      }
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
  const atualizarStatus = (transportadoraIndex: number, status: string) => {
    if (!cotacaoEmEdicao) return;

    const novasTransportadoras = [...cotacaoEmEdicao.transportadoras];
    novasTransportadoras[transportadoraIndex] = {
      ...novasTransportadoras[transportadoraIndex],
      status: status
    };

    setCotacaoEmEdicao({
      ...cotacaoEmEdicao,
      transportadoras: novasTransportadoras
    });
  };
  
  // Função para atualizar a proposta final de uma transportadora
  const atualizarPropostaFinal = (transportadoraIndex: number, propostaFinal: string) => {
    // Atualiza diretamente na lista de histórico sem entrar em modo de edição
    const novoCotacoes = historico.map(item => {
      if (item.id === itemEditando || (cotacaoEmEdicao && item.id === cotacaoEmEdicao.id)) {
        const novasTransportadoras = [...item.transportadoras];
        novasTransportadoras[transportadoraIndex] = {
          ...novasTransportadoras[transportadoraIndex],
          propostaFinal: propostaFinal
        };
        return {...item, transportadoras: novasTransportadoras};
      }
      return item;
    });
    
    setHistorico(novoCotacoes);
    localStorage.setItem("cotacoes", JSON.stringify(novoCotacoes));
    toast.success("Proposta final atualizada com sucesso!");
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cotacoes" className="flex items-center gap-2">
            <TruckIcon className="h-4 w-4" />
            <span>Histórico de Cotações</span>
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Gerenciar Usuários</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cotacoes" className="mt-4">
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
                {historico.map((item) => (
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
                          <div className="font-medium">{item.cliente} <span className="text-muted-foreground">(Tomador do Serviço)</span></div>
                        </div>
                        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-6 mt-1">
                          {item.origem && (
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-3.5 w-3.5 text-primary" />
                              <span className="font-medium">Origem:</span> {item.origem}
                            </div>
                          )}
                          {item.destino && (
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-3.5 w-3.5 text-destructive" />
                              <span className="font-medium">Destino:</span> {item.destino}
                            </div>
                          )}
                          <div className="ml-auto">
                            {item.data}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${expandedItems.includes(item.id) ? 'transform rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border-t bg-muted/10">
                      <HistoricoItem
                        item={cotacaoEmEdicao && item.id === cotacaoEmEdicao.id ? cotacaoEmEdicao : item}
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
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="usuarios" className="mt-4">
          <GerenciadorUsuarios />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Historico;
