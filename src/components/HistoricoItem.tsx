
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CotacaoSalva, Transportadora } from "@/types";

interface HistoricoItemProps {
  item: CotacaoSalva;
  removerCotacao: (id: string) => void;
  editarCotacao: (id: string) => void;
  modoEdicao: boolean;
  salvarEdicao: () => void;
  cancelarEdicao: () => void;
  atualizarTransportadora: (transportadoraIndex: number, campo: keyof Transportadora, valor: string) => void;
  atualizarStatus: (transportadoraIndex: number, status: string) => void;
}

const HistoricoItem = ({
  item,
  removerCotacao,
  editarCotacao,
  modoEdicao,
  salvarEdicao,
  cancelarEdicao,
  atualizarTransportadora,
  atualizarStatus,
}: HistoricoItemProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Cotação para: {item.cliente}
          </h3>
          <span className="text-sm text-muted-foreground">
            {item.data}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <p>
            <strong>Endereço:</strong> {item.endereco}, {item.cidade} - {item.estado},
            CEP: {item.cep}
          </p>
          <p>
            <strong>Fazenda:</strong> {item.fazenda || "N/A"}
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="produtos">
            <AccordionTrigger>Produtos</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1">
                {item.produtos.map((produto, idx) => (
                  <li key={idx}>
                    {produto.nome} - Qtd: {produto.quantidade}, Peso:{" "}
                    {produto.peso || "N/A"} kg
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Cotações de transportadoras:</h4>
          <ul className="space-y-3">
            {item.transportadoras.map((transp, idx) => (
              <li
                key={idx}
                className="p-3 bg-secondary rounded-md"
                id={`transp-${item.id}-${transp.nome.replace(/\s+/g, "")}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <span className="font-medium">{transp.nome}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-sm text-muted-foreground block">Prazo:</span>
                    {modoEdicao ? (
                      <Input
                        type="number"
                        className="edit-prazo"
                        value={transp.prazo}
                        onChange={(e) => atualizarTransportadora(idx, "prazo", e.target.value)}
                        placeholder="Prazo"
                        min="1"
                      />
                    ) : (
                      <span className="prazo">{transp.prazo || "N/A"} dias</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground block">Valor Unitário:</span>
                    {modoEdicao ? (
                      <Input
                        type="number"
                        className="edit-valorUnitario"
                        value={transp.valorUnitario}
                        onChange={(e) => atualizarTransportadora(idx, "valorUnitario", e.target.value)}
                        placeholder="Valor unitário"
                        step="0.01"
                      />
                    ) : (
                      <span className="valorUnitario">
                        R$ {transp.valorUnitario || "A determinar"}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground block">Valor Total:</span>
                    {modoEdicao ? (
                      <Input
                        type="number"
                        className="edit-valorTotal"
                        value={transp.valorTotal}
                        onChange={(e) => atualizarTransportadora(idx, "valorTotal", e.target.value)}
                        placeholder="Valor total"
                        step="0.01"
                      />
                    ) : (
                      <span className="valorTotal">
                        R$ {transp.valorTotal || "A determinar"}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground block">Status:</span>
                    {modoEdicao ? (
                      <Select 
                        value={transp.status}
                        onValueChange={(value) => atualizarStatus(idx, value)}
                      >
                        <SelectTrigger className="edit-status">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Aprovado">Aprovado</SelectItem>
                          <SelectItem value="Recusado">Recusado</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select 
                        value={transp.status}
                        onValueChange={(value) => atualizarStatus(idx, value)}
                      >
                        <SelectTrigger className="hist-status">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Aprovado">Aprovado</SelectItem>
                          <SelectItem value="Recusado">Recusado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {item.observacoes && (
          <p className="mb-4">
            <strong>Observações:</strong> {item.observacoes}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {modoEdicao ? (
            <>
              <Button onClick={salvarEdicao}>Salvar Edição</Button>
              <Button variant="outline" onClick={cancelarEdicao}>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => editarCotacao(item.id)}>
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => removerCotacao(item.id)}
              >
                Apagar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricoItem;
