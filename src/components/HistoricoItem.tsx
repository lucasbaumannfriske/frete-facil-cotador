
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
import { StatusBadge } from "./StatusBadge";
import { CalendarIcon, MapPinIcon, TruckIcon, PackageIcon } from "lucide-react";

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
    <Card className="mb-4 overflow-hidden border-l-4 border-l-primary">
      <CardContent className="p-0">
        <div className="bg-muted/40 p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TruckIcon className="h-5 w-5 text-primary" />
              {item.cliente}
            </h3>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {item.data}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{item.cidade} - {item.estado}</span>
            </div>
            {item.fazenda && (
              <div className="flex items-center gap-1 ml-4">
                <PackageIcon className="h-4 w-4" />
                <span>{item.fazenda}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="produtos" className="border-none">
              <AccordionTrigger className="py-2 px-2 hover:bg-muted/30 rounded-md">
                Produtos
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 bg-muted/20 rounded-md p-3">
                  <ul className="space-y-1 text-sm">
                    {item.produtos.map((produto, idx) => (
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
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mb-4">
            <h4 className="font-medium mb-2 flex items-center gap-1.5">
              <TruckIcon className="h-4 w-4 text-primary" />
              Cotações de transportadoras:
            </h4>
            <div className="space-y-3">
              {item.transportadoras.map((transp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-md bg-muted/30 border border-muted"
                  id={`transp-${item.id}-${transp.nome.replace(/\s+/g, "")}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                    <span className="font-medium text-primary">{transp.nome}</span>
                    {!modoEdicao && (
                      <StatusBadge status={transp.status} className="sm:ml-auto" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-background rounded p-2">
                      <span className="text-xs text-muted-foreground block mb-1">Prazo:</span>
                      {modoEdicao ? (
                        <Input
                          type="number"
                          className="edit-prazo h-8"
                          value={transp.prazo}
                          onChange={(e) => atualizarTransportadora(idx, "prazo", e.target.value)}
                          placeholder="Prazo"
                          min="1"
                        />
                      ) : (
                        <span className="prazo font-medium">
                          {transp.prazo || "N/A"} dias
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-background rounded p-2">
                      <span className="text-xs text-muted-foreground block mb-1">Valor Unitário:</span>
                      {modoEdicao ? (
                        <Input
                          type="number"
                          className="edit-valorUnitario h-8"
                          value={transp.valorUnitario}
                          onChange={(e) => atualizarTransportadora(idx, "valorUnitario", e.target.value)}
                          placeholder="Valor unitário"
                          step="0.01"
                        />
                      ) : (
                        <span className="valorUnitario font-medium">
                          R$ {transp.valorUnitario || "A determinar"}
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-background rounded p-2">
                      <span className="text-xs text-muted-foreground block mb-1">Valor Total:</span>
                      {modoEdicao ? (
                        <Input
                          type="number"
                          className="edit-valorTotal h-8"
                          value={transp.valorTotal}
                          onChange={(e) => atualizarTransportadora(idx, "valorTotal", e.target.value)}
                          placeholder="Valor total"
                          step="0.01"
                        />
                      ) : (
                        <span className="valorTotal font-medium">
                          R$ {transp.valorTotal || "A determinar"}
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-background rounded p-2">
                      <span className="text-xs text-muted-foreground block mb-1">Status:</span>
                      {modoEdicao ? (
                        <Select 
                          value={transp.status}
                          onValueChange={(value) => atualizarStatus(idx, value)}
                        >
                          <SelectTrigger className="edit-status h-8">
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
                          <SelectTrigger className="hist-status h-8">
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
                </div>
              ))}
            </div>
          </div>

          {item.observacoes && (
            <div className="mb-4 bg-muted/20 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-1">Observações:</h4>
              <p className="text-sm">{item.observacoes}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {modoEdicao ? (
              <>
                <Button onClick={salvarEdicao} size="sm" className="gap-1">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
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
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => removerCotacao(item.id)}
                  size="sm"
                  className="gap-1"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3.5 5C3.22386 5 3 5.22386 3 5.5C3 5.77614 3.22386 6 3.5 6H4V12C4 12.5523 4.44772 13 5 13H10C10.5523 13 11 12.5523 11 12V6H11.5C11.7761 6 12 5.77614 12 5.5C12 5.22386 11.7761 5 11.5 5H3.5ZM5 6H10V12H5V6Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                  Apagar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricoItem;
