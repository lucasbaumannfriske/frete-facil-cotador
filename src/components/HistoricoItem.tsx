
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { TruckIcon, Edit, Trash2, Save } from "lucide-react";

interface HistoricoItemProps {
  item: CotacaoSalva;
  removerCotacao: (id: string) => void;
  editarCotacao: (id: string) => void;
  modoEdicao: boolean;
  salvarEdicao: (cotacao: CotacaoSalva) => void;
  cancelarEdicao: () => void;
}

const HistoricoItem = ({
  item,
  removerCotacao,
  editarCotacao,
  modoEdicao,
  salvarEdicao,
  cancelarEdicao,
}: HistoricoItemProps) => {

  const [cotacaoLocal, setCotacaoLocal] = useState<CotacaoSalva>(item);

  // Atualizar estado local quando o item mudar ou entrar em modo de edição
  useEffect(() => {
    setCotacaoLocal(item);
  }, [item, modoEdicao]);

  console.log("HistoricoItem - modoEdicao:", modoEdicao, "cotacaoLocal:", cotacaoLocal);

  // Função para atualizar um campo da cotação
  const atualizarCampo = (campo: keyof CotacaoSalva, valor: string) => {
    console.log("Atualizando campo:", campo, "para:", valor);
    setCotacaoLocal(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Função para atualizar uma transportadora
  const atualizarTransportadora = (
    transportadoraIndex: number, 
    campo: keyof Transportadora, 
    valor: string
  ) => {
    console.log("Atualizando transportadora:", transportadoraIndex, campo, "para:", valor);
    setCotacaoLocal(prev => {
      const novasTransportadoras = [...prev.transportadoras];
      novasTransportadoras[transportadoraIndex] = {
        ...novasTransportadoras[transportadoraIndex],
        [campo]: valor,
      };
      return {
        ...prev,
        transportadoras: novasTransportadoras
      };
    });
  };

  // Função para atualizar um produto
  const atualizarProduto = (
    produtoIndex: number,
    campo: keyof Produto,
    valor: string | number
  ) => {
    console.log("Atualizando produto:", produtoIndex, campo, "para:", valor);
    setCotacaoLocal(prev => {
      const novosProdutos = [...prev.produtos];
      novosProdutos[produtoIndex] = {
        ...novosProdutos[produtoIndex],
        [campo]: valor,
      };
      return {
        ...prev,
        produtos: novosProdutos
      };
    });
  };

  // Função para adicionar um novo produto
  const adicionarProduto = () => {
    setCotacaoLocal(prev => ({
      ...prev,
      produtos: [
        ...prev.produtos,
        { id: Date.now().toString(), nome: "", quantidade: 1, peso: "", embalagem: "" }
      ]
    }));
  };

  // Função para remover um produto
  const removerProduto = (produtoIndex: number) => {
    if (cotacaoLocal.produtos.length <= 1) return;

    setCotacaoLocal(prev => ({
      ...prev,
      produtos: prev.produtos.filter((_, idx) => idx !== produtoIndex)
    }));
  };

  // Função para salvar
  const handleSalvar = () => {
    salvarEdicao(cotacaoLocal);
  };

  return (
    <div className="p-4">
      {/* Detalhes do cliente */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {modoEdicao ? (
              <div className="mb-3">
                <label className="text-sm font-medium mb-1 block">Cliente:</label>
                <Input
                  value={cotacaoLocal.cliente || ""}
                  onChange={(e) => atualizarCampo('cliente', e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">Cliente:</span> {cotacaoLocal.cliente}
              </div>
            )}

            {modoEdicao ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Cidade:</label>
                  <Input
                    value={cotacaoLocal.cidade || ""}
                    onChange={(e) => atualizarCampo('cidade', e.target.value)}
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Estado:</label>
                  <Input
                    value={cotacaoLocal.estado || ""}
                    onChange={(e) => atualizarCampo('estado', e.target.value)}
                    placeholder="Estado"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1 text-sm">
                <span className="font-medium">Local:</span> {cotacaoLocal.cidade} - {cotacaoLocal.estado}
              </div>
            )}
            
            {modoEdicao ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Fazenda:</label>
                  <Input
                    value={cotacaoLocal.fazenda || ""}
                    onChange={(e) => atualizarCampo('fazenda', e.target.value)}
                    placeholder="Fazenda"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">CEP:</label>
                  <Input
                    value={cotacaoLocal.cep || ""}
                    onChange={(e) => atualizarCampo('cep', e.target.value)}
                    placeholder="CEP"
                  />
                </div>
              </div>
            ) : cotacaoLocal.fazenda ? (
              <div className="flex items-center gap-2 mb-1 text-sm">
                <span className="font-medium">Fazenda:</span> {cotacaoLocal.fazenda}
              </div>
            ) : null}
            
            {modoEdicao ? (
              <div className="mb-3">
                <label className="text-sm font-medium mb-1 block">Endereço:</label>
                <Input
                  value={cotacaoLocal.endereco || ""}
                  onChange={(e) => atualizarCampo('endereco', e.target.value)}
                  placeholder="Endereço"
                />
              </div>
            ) : cotacaoLocal.endereco ? (
              <div className="flex items-center gap-2 mb-1 text-sm">
                <span className="font-medium">Endereço:</span> {cotacaoLocal.endereco}
              </div>
            ) : null}
          </div>
          <div>
            {modoEdicao ? (
              <>
                <div className="mb-3">
                  <label className="text-sm font-medium mb-1 block">Origem:</label>
                  <Input
                    value={cotacaoLocal.origem || ""}
                    onChange={(e) => atualizarCampo('origem', e.target.value)}
                    placeholder="Origem"
                  />
                </div>
                <div className="mb-3">
                  <label className="text-sm font-medium mb-1 block">Destino:</label>
                  <Input
                    value={cotacaoLocal.destino || ""}
                    onChange={(e) => atualizarCampo('destino', e.target.value)}
                    placeholder="Destino"
                  />
                </div>
                <div className="mb-3">
                  <label className="text-sm font-medium mb-1 block">Roteiro:</label>
                  <Input
                    value={cotacaoLocal.roteiro || ""}
                    onChange={(e) => atualizarCampo('roteiro', e.target.value)}
                    placeholder="Roteiro"
                  />
                </div>
              </>
            ) : (
              <>
                {cotacaoLocal.origem && (
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    <span className="font-medium">Origem:</span> {cotacaoLocal.origem}
                  </div>
                )}
                {cotacaoLocal.destino && (
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    <span className="font-medium">Destino:</span> {cotacaoLocal.destino}
                  </div>
                )}
                {cotacaoLocal.roteiro && (
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    <span className="font-medium">Roteiro:</span> {cotacaoLocal.roteiro}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Produtos */}
      <Accordion type="single" collapsible className="mb-4" defaultValue={modoEdicao ? "produtos" : undefined}>
        <AccordionItem value="produtos" className="border-none">
          <AccordionTrigger className="py-2 px-2 hover:bg-muted/30 rounded-md">
            Produtos
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-2 bg-muted/20 rounded-md p-3">
              {modoEdicao ? (
                <div className="space-y-3">
                  {cotacaoLocal.produtos.map((produto, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-1 bg-background rounded-md border p-2">
                      <Input
                        value={produto.nome || ""}
                        onChange={(e) => atualizarProduto(idx, 'nome', e.target.value)}
                        placeholder="Nome do produto"
                        className="flex-grow"
                      />
                      <Input
                        type="number"
                        value={produto.quantidade || 1}
                        onChange={(e) => atualizarProduto(idx, 'quantidade', Number(e.target.value))}
                        placeholder="Qtd"
                        className="w-20"
                        min="1"
                      />
                      <Input
                        value={produto.peso || ""}
                        onChange={(e) => atualizarProduto(idx, 'peso', e.target.value)}
                        placeholder="Peso"
                        className="w-24"
                      />
                      <Input
                        value={produto.embalagem || ""}
                        onChange={(e) => atualizarProduto(idx, 'embalagem', e.target.value)}
                        placeholder="Embalagem"
                        className="w-32"
                      />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => removerProduto(idx)}
                        disabled={cotacaoLocal.produtos.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    onClick={adicionarProduto}
                    size="sm" 
                    className="mt-2"
                  >
                    Adicionar Produto
                  </Button>
                </div>
              ) : (
                <ul className="space-y-1 text-sm">
                  {cotacaoLocal.produtos.map((produto, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-1">
                      <span className="font-medium">{produto.nome}</span>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                        Qtd: {produto.quantidade}
                      </span>
                      {produto.peso && (
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                          {produto.peso} kg
                        </span>
                      )}
                      {produto.embalagem && (
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                          {produto.embalagem}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Transportadoras */}
      <div className="mb-4">
        <h4 className="font-medium mb-2 flex items-center gap-1.5">
          <TruckIcon className="h-4 w-4 text-primary" />
          Cotações de transportadoras:
        </h4>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {cotacaoLocal.transportadoras.map((transp, idx) => (
            <div
              key={idx}
              className="p-3 rounded-md bg-muted/30 border border-muted"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                {modoEdicao ? (
                  <Input
                    value={transp.nome || ""}
                    onChange={(e) => atualizarTransportadora(idx, "nome", e.target.value)}
                    placeholder="Nome da transportadora"
                    className="sm:max-w-[200px]"
                  />
                ) : (
                  <span className="font-medium text-primary">{transp.nome}</span>
                )}
                {!modoEdicao && (
                  <StatusBadge status={transp.status || "Pendente"} className="sm:ml-auto" />
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-background rounded p-2">
                  <span className="text-xs text-muted-foreground block mb-1">Prazo:</span>
                  {modoEdicao ? (
                    <Input
                      className="h-8"
                      value={transp.prazo || ""}
                      onChange={(e) => atualizarTransportadora(idx, "prazo", e.target.value)}
                      placeholder="Prazo"
                    />
                  ) : (
                    <div className="h-8 flex items-center text-sm">
                      {transp.prazo || "Não informado"}
                    </div>
                  )}
                </div>
                
                <div className="bg-background rounded p-2">
                  <span className="text-xs text-muted-foreground block mb-1">Valor Unitário:</span>
                  {modoEdicao ? (
                    <Input
                      className="h-8"
                      value={transp.valorUnitario || ""}
                      onChange={(e) => atualizarTransportadora(idx, "valorUnitario", e.target.value)}
                      placeholder="Valor unitário"
                    />
                  ) : (
                    <div className="h-8 flex items-center text-sm">
                      {transp.valorUnitario || "Não informado"}
                    </div>
                  )}
                </div>
                
                <div className="bg-background rounded p-2">
                  <span className="text-xs text-muted-foreground block mb-1">Valor Total:</span>
                  {modoEdicao ? (
                    <Input
                      className="h-8"
                      value={transp.valorTotal || ""}
                      onChange={(e) => atualizarTransportadora(idx, "valorTotal", e.target.value)}
                      placeholder="Valor total"
                    />
                  ) : (
                    <div className="h-8 flex items-center text-sm">
                      {transp.valorTotal || "Não informado"}
                    </div>
                  )}
                </div>
                
                <div className="bg-background rounded p-2">
                  <span className="text-xs text-muted-foreground block mb-1">Proposta Final:</span>
                  <Input
                    className="h-8"
                    value={transp.propostaFinal || ""}
                    onChange={(e) => atualizarTransportadora(idx, "propostaFinal", e.target.value)}
                    placeholder="Proposta final"
                  />
                </div>
                
                <div className="bg-background rounded p-2">
                  <span className="text-xs text-muted-foreground block mb-1">Status:</span>
                  <Select 
                    value={transp.status || "Pendente"}
                    onValueChange={(value) => atualizarTransportadora(idx, "status", value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                      <SelectItem value="Recusado">Recusado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observações */}
      {modoEdicao ? (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Observações:</h4>
          <Textarea
            value={cotacaoLocal.observacoes || ""}
            onChange={(e) => atualizarCampo('observacoes', e.target.value)}
            placeholder="Observações"
            className="min-h-[100px]"
          />
        </div>
      ) : cotacaoLocal.observacoes ? (
        <div className="mb-4 bg-muted/20 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-1">Observações:</h4>
          <p className="text-sm">{cotacaoLocal.observacoes}</p>
        </div>
      ) : null}

      {/* Ações */}
      <div className="flex flex-wrap gap-2 mt-4">
        {modoEdicao ? (
          <>
            <Button onClick={handleSalvar} size="sm" className="gap-1">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
            <Button variant="outline" onClick={cancelarEdicao} size="sm" className="gap-1">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => editarCotacao(item.id)} size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={() => removerCotacao(item.id)}
              size="sm"
              className="gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoricoItem;
