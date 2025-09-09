import SafrasGestao from "@/components/SafrasGestao";
import GruposGestao from "@/components/GruposGestao";
import { Settings } from "lucide-react";

const Configuracoes = () => {
  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SafrasGestao />
        <GruposGestao />
      </div>
    </div>
  );
};

export default Configuracoes;