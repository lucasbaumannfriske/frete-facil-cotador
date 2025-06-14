
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReportsFiltrosProps {
  draftDataInicio: Date | undefined;
  draftDataFim: Date | undefined;
  setDraftDataInicio: (date: Date | undefined) => void;
  setDraftDataFim: (date: Date | undefined) => void;
  onAplicarFiltros: () => void;
  onLimparFiltros: () => void;
}

const ReportsFiltros = ({
  draftDataInicio,
  draftDataFim,
  setDraftDataInicio,
  setDraftDataFim,
  onAplicarFiltros,
  onLimparFiltros,
}: ReportsFiltrosProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        Filtros por Período
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2 w-full sm:w-1/3">
          <Label className="text-sm font-medium">Data Início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {draftDataInicio ? format(draftDataInicio, "dd/MM/yyyy") : "Selecionar"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={draftDataInicio}
                onSelect={setDraftDataInicio}
                locale={ptBR}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2 w-full sm:w-1/3">
          <Label className="text-sm font-medium">Data Fim</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {draftDataFim ? format(draftDataFim, "dd/MM/yyyy") : "Selecionar"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={draftDataFim}
                onSelect={setDraftDataFim}
                locale={ptBR}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-end w-full sm:w-1/3 gap-2">
          <Button
            variant="default"
            className="w-1/2"
            onClick={onAplicarFiltros}
          >
            Aplicar Filtros
          </Button>
          <Button
            variant="outline"
            className="w-1/2"
            onClick={onLimparFiltros}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ReportsFiltros;
