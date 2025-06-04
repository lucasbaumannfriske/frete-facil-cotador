
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CotacaoSalva, Transportadora, Produto } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { 
  TruckIcon, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ChevronDown,
  MapPinIcon,
  Plus
} from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useCotacoes } from "@/hooks/useCotacoes";
import { toast } from "sonner";

interface HistoricoCotacoesProps {
  cotacoes: CotacaoSalva[];
  loading?: boolean;
}

const HistoricoCotacoes = ({ cotacoes, loading = false }: HistoricoCotacoesProps) => {
  const { atualizarCotacao, deletarCotacao } = useCotacoes();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<CotacaoSalva | null>(null);
  
  // Estado local para armazenar cotações atualizadas
  const [localCotacoes, setLocalCotacoes] = useState<CotacaoSalva[]>(cotacoes);

  // Atualizar estado local quando as props mudarem
  React.useEffect(() => {
    setLocalCotacoes(cotacoes);
  }, [cotacoes]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const startEdit = (cotacao: CotacaoSalva) => {
    setEditingId(cotacao.id);
    setEditData({ ...cotacao });
    if (!expandedItems.includes(cotacao.id)) {
      setExpandedItems([...expandedItems, cotacao.id]);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const saveEdit = async () => {
    if (!editData) return;

    const sucesso = await atualizarCotacao(editData);
    if (sucesso) {
      // Atualizar o estado local imediatamente
      setLocalCotacoes(prev => 
        prev.map(cotacao => 
          cotacao.id === editData.id ? editData : cotacao
        )
      );
      
      setEditingId(null);
      setEditData(null);
      console.log('Cotação atualizada localmente:', editData);
    }
  };

  const deleteCotacao = async (id: string) => {
    const sucesso = await deletarCotacao(id);
    if (sucesso) {
      // Atualizar o estado local imediatamente
      setLocalCotacoes(prev => prev.filter(cotacao => cotacao.id !== id));
      setExpandedItems(prev => prev.filter(item => item !== id));
    }
  };

  const updateField = (field: keyof CotacaoSalva, value: string) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
  };

  const updateTransportadora = (index: number, field: keyof Transportadora, value: string) => {
    if (!editData) return;
    const newTransportadoras = [...editData.transportadoras];
    newTransportadoras[index] = { ...newTransportadoras[index], [field]: value };
    setEditData({ ...editData, transportadoras: newTransportadoras });
  };

  const updateProduto = (index: number, field: keyof Produto, value: string | number) => {
    if (!editData) return;
    const newProdutos = [...editData.produtos];
    newProdutos[index] = { ...newProdutos[index], [field]: value };
    setEditData({ ...editData, produtos: newProdutos });
  };

  const addProduto = () => {
    if (!editData) return;
    const newProduto: Produto = {
      id: Date.now().toString(),
      nome: "",
      quantidade: 1,
      peso: "",
      embalagem: ""
    };
    setEditData({ ...editData, produtos: [...editData.produtos, newProduto] });
  };

  const removeProduto = (index: number) => {
    if (!editData || editData.produtos.length <= 1) return;
    const newProdutos = editData.produtos.filter((_, i) => i !== index);
    setEditData({ ...editData, produtos: newProdutos });
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
      
      <ScrollArea className="h-[600px] pr-4">
        {localCotacoes.length === 0 ? (
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
            {localCotacoes.map((cotacao) => {
              const isEditing = editingId === cotacao.id;
              const currentData = isEditing ? editData! : cotacao;
              
              return (
                <Collapsible 
                  key={cotacao.id} 
                  open={expandedItems.includes(cotacao.id)}
                  onOpenChange={() => toggleExpand(cotacao.id)}
                  className="border rounded-md overflow-hidden"
                >
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <TruckIcon className="h-5 w-5 text-primary" />
                        <div className="font-medium">{cotacao.cliente} <span className="text-muted-foreground">(Tomador do Serviço)</span></div>
                      </div>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-x-6 mt-1">
                        {cotacao.origem && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5 text-primary" />
                            <span className="font-medium">Origem:</span> {cotacao.origem}
                          </div>
                        )}
                        {cotacao.destino && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5 text-destructive" />
                            <span className="font-medium">Destino:</span> {cotacao.destino}
                          </div>
                        )}
                        <div className="ml-auto">
                          {cotacao.data}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${expandedItems.includes(cotacao.id) ? 'transform rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="border-t bg-muted/10 p-4">
                    {/* Detalhes do Cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Cliente:</label>
                          {isEditing ? (
                            <Input
                              value={currentData.cliente}
                              onChange={(e) => updateField('cliente', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-sm">{currentData.cliente}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium">Cidade:</label>
                            {isEditing ? (
                              <Input
                                value={currentData.cidade || ""}
                                onChange={(e) => updateField('cidade', e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{currentData.cidade}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Estado:</label>
                            {isEditing ? (
                              <Input
                                value={currentData.estado || ""}
                                onChange={(e) => updateField('estado', e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{currentData.estado}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Origem:</label>
                          {isEditing ? (
                            <Input
                              value={currentData.origem || ""}
                              onChange={(e) => updateField('origem', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-sm">{currentData.origem}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Destino:</label>
                          {isEditing ? (
                            <Input
                              value={currentData.destino || ""}
                              onChange={(e) => updateField('destino', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-sm">{currentData.destino}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Produtos */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Produtos:</h4>
                      <div className="space-y-2">
                        {currentData.produtos.map((produto, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-background rounded border">
                            {isEditing ? (
                              <>
                                <Input
                                  value={produto.nome}
                                  onChange={(e) => updateProduto(idx, 'nome', e.target.value)}
                                  placeholder="Nome do produto"
                                  className="flex-1"
                                />
                                <Input
                                  type="number"
                                  value={produto.quantidade}
                                  onChange={(e) => updateProduto(idx, 'quantidade', Number(e.target.value))}
                                  placeholder="Qtd"
                                  className="w-20"
                                  min="1"
                                />
                                <Input
                                  value={produto.peso || ""}
                                  onChange={(e) => updateProduto(idx, 'peso', e.target.value)}
                                  placeholder="Peso"
                                  className="w-24"
                                />
                                <Input
                                  value={produto.embalagem || ""}
                                  onChange={(e) => updateProduto(idx, 'embalagem', e.target.value)}
                                  placeholder="Embalagem"
                                  className="w-32"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeProduto(idx)}
                                  disabled={currentData.produtos.length <= 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="font-medium flex-1">{produto.nome}</span>
                                <span className="text-xs bg-secondary px-2 py-1 rounded">
                                  Qtd: {produto.quantidade}
                                </span>
                                {produto.peso && (
                                  <span className="text-xs bg-secondary px-2 py-1 rounded">
                                    {produto.peso}
                                  </span>
                                )}
                                {produto.embalagem && (
                                  <span className="text-xs bg-secondary px-2 py-1 rounded">
                                    {produto.embalagem}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <Button onClick={addProduto} size="sm" variant="outline">
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar Produto
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Transportadoras */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <TruckIcon className="h-4 w-4 text-primary" />
                        Transportadoras:
                      </h4>
                      <div className="space-y-3">
                        {currentData.transportadoras.map((transp, idx) => (
                          <div key={idx} className="p-3 bg-background rounded border">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                              <div>
                                <label className="text-xs text-muted-foreground">Nome:</label>
                                {isEditing ? (
                                  <Input
                                    value={transp.nome}
                                    onChange={(e) => updateTransportadora(idx, 'nome', e.target.value)}
                                    className="mt-1"
                                  />
                                ) : (
                                  <p className="mt-1 font-medium">{transp.nome}</p>
                                )}
                              </div>
                              
                              <div>
                                <label className="text-xs text-muted-foreground">Prazo:</label>
                                {isEditing ? (
                                  <Input
                                    value={transp.prazo || ""}
                                    onChange={(e) => updateTransportadora(idx, 'prazo', e.target.value)}
                                    className="mt-1"
                                  />
                                ) : (
                                  <p className="mt-1 text-sm">{transp.prazo || "N/A"}</p>
                                )}
                              </div>
                              
                              <div>
                                <label className="text-xs text-muted-foreground">Valor Unit.:</label>
                                {isEditing ? (
                                  <Input
                                    value={transp.valorUnitario || ""}
                                    onChange={(e) => updateTransportadora(idx, 'valorUnitario', e.target.value)}
                                    className="mt-1"
                                  />
                                ) : (
                                  <p className="mt-1 text-sm">{transp.valorUnitario || "N/A"}</p>
                                )}
                              </div>
                              
                              <div>
                                <label className="text-xs text-muted-foreground">Proposta Final:</label>
                                {isEditing ? (
                                  <Input
                                    value={transp.propostaFinal || ""}
                                    onChange={(e) => updateTransportadora(idx, 'propostaFinal', e.target.value)}
                                    className="mt-1"
                                  />
                                ) : (
                                  <p className="mt-1 text-sm">{transp.propostaFinal || "N/A"}</p>
                                )}
                              </div>
                              
                              <div>
                                <label className="text-xs text-muted-foreground">Status:</label>
                                {isEditing ? (
                                  <Select 
                                    value={transp.status || "Pendente"}
                                    onValueChange={(value) => updateTransportadora(idx, 'status', value)}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pendente">Pendente</SelectItem>
                                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                                      <SelectItem value="Recusado">Recusado</SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <div className="mt-1">
                                    <StatusBadge status={transp.status || "Pendente"} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Observações */}
                    {(isEditing || currentData.observacoes) && (
                      <div className="mb-4">
                        <label className="text-sm font-medium">Observações:</label>
                        {isEditing ? (
                          <Textarea
                            value={currentData.observacoes || ""}
                            onChange={(e) => updateField('observacoes', e.target.value)}
                            className="mt-1"
                            rows={3}
                          />
                        ) : (
                          <p className="mt-1 text-sm bg-muted/20 p-2 rounded">{currentData.observacoes}</p>
                        )}
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex gap-2 pt-2 border-t">
                      {isEditing ? (
                        <>
                          <Button onClick={saveEdit} size="sm">
                            <Save className="h-4 w-4 mr-1" />
                            Salvar
                          </Button>
                          <Button onClick={cancelEdit} variant="outline" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button onClick={() => startEdit(cotacao)} variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            onClick={() => deleteCotacao(cotacao.id)} 
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </>
                      )}
                    </div>
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

export default HistoricoCotacoes;
