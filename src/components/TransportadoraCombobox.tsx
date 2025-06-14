
import React, { useMemo } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { TransportadoraCadastro } from "@/hooks/useTransportadorasCadastros";

interface TransportadoraComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: TransportadoraCadastro[];
  disabled?: boolean;
}

export const TransportadoraCombobox: React.FC<TransportadoraComboboxProps> = ({
  value,
  onChange,
  options,
  disabled = false
}) => {
  // Busca o nome da selecionada, se houver
  const selected = useMemo(
    () => options.find((c) => c.id === value),
    [options, value]
  );

  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      {/* Botão de ativação */}
      <Button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full justify-between"
        variant="outline"
        disabled={disabled}
      >
        <span className="truncate">
          {selected ? selected.nome : (disabled ? "Carregando..." : "Selecione")}
        </span>
        <svg className="ml-2 h-4 w-4 opacity-50" viewBox="0 0 20 20" fill="none">
          <path d="M7 7l3-3 3 3M7 13l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
      {/* Combobox dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-background border border-secondary rounded-md shadow-lg">
          <Command>
            <CommandInput
              placeholder="Buscar transportadora..."
              autoFocus
              className="h-9"
              disabled={disabled}
            />
            <CommandList>
              <CommandEmpty>Nenhuma encontrada.</CommandEmpty>
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    value={option.nome}
                    key={option.id}
                    onSelect={() => {
                      onChange(option.id);
                      setOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {value === option.id ? <Check className="w-4 h-4 text-primary" /> : null}
                      {option.nome}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
