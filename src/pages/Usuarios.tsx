import GerenciadorUsuarios from "@/components/GerenciadorUsuarios";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

const Usuarios = () => {
  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-center gap-3 mb-6">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-center">Gerenciar Usuários</h1>
      </div>

      <Card className="rounded-2xl border-0 bg-green-50 shadow-md shadow-green-100 mb-4">
        <CardContent className="p-8 flex flex-col gap-4">
          <GerenciadorUsuarios />
        </CardContent>
      </Card>
    </div>
  );
};

export default Usuarios;