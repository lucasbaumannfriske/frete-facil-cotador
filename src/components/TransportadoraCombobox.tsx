
import React, { useMemo, useRef, useEffect } from "react";
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

  // Fechar dropdown se clicar fora
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const cb = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", cb);
    return () => document.removeEventListener("mousedown", cb);
  }, [open]);

  // Foca automaticamente no campo de busca ao abrir dropdown
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 70);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {/* Botão de ativação */}
      <Button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full justify-between"
        variant="outline"
        disabled={disabled}
        tabIndex={0}
      >
        <span className="truncate">
          {selected ? selected.nome : (disabled ? "Carregando..." : "Selecione")}
        </span>
        <svg className="ml-2 h-4 w-4 opacity-50 shrink-0" viewBox="0 0 20 20" fill="none">
          <path d="M7 7l3-3 3 3M7 13l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
      {/* Combobox dropdown */}
      {open && (
        <div
          className="absolute left-0 z-[100] mt-2 w-full min-w-[180px] rounded-md border bg-popover shadow-xl border-secondary py-1"
          style={{
            maxHeight: 295,
            overflow: "visible",
          }}
        >
          <Command>
            <CommandInput
              ref={inputRef}
              placeholder="Buscar transportadora..."
              className="h-9"
              disabled={disabled}
              autoFocus
            />
            <CommandList className="max-h-56 overflow-y-auto">
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
                    className={value === option.id
                      ? "bg-accent text-primary rounded-sm font-medium"
                      : "hover:bg-muted/70"}
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
