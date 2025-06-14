
import React from "react";
import { Button } from "@/components/ui/button";
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
  return (
    <select
      className="w-full border border-secondary rounded-md px-3 py-2 text-sm bg-background disabled:opacity-60"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.nome}
        </option>
      ))}
    </select>
  );
};

