
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UserPlus, UserX, User } from "lucide-react";

type Usuario = {
  nome: string;
  email: string;
  senha?: string; // Adicionando senha ao tipo
};

const GerenciadorUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  // Carregar usuários do localStorage
  useEffect(() => {
    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setUsuarios(usuariosSalvos);
  }, []);

  // Adicionar usuário
  const adicionarUsuario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !senha) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (senha !== confirmSenha) {
      toast.error("As senhas não correspondem");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Verificar se já existe usuário com o mesmo email
    if (usuarios.some(user => user.email === email)) {
      toast.error("Este email já está cadastrado");
      return;
    }

    // Adicionar novo usuário com senha
    const novosUsuarios = [...usuarios, { nome, email, senha }];
    setUsuarios(novosUsuarios);
    localStorage.setItem("usuarios", JSON.stringify(novosUsuarios));
    
    // Resetar formulário
    setNome("");
    setEmail("");
    setSenha("");
    setConfirmSenha("");
    
    toast.success("Usuário adicionado com sucesso!");
  };

  // Remover usuário
  const removerUsuario = (email: string) => {
    // Não permitir remover usuários pré-cadastrados protegidos
    if (email === "admin@exemplo.com" || email === "lucasfriske@agrofarm.net.br") {
      toast.error("Não é possível remover usuários do sistema");
      return;
    }
    
    const novosUsuarios = usuarios.filter(user => user.email !== email);
    setUsuarios(novosUsuarios);
    localStorage.setItem("usuarios", JSON.stringify(novosUsuarios));
    toast.success("Usuário removido com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Gerenciador de Usuários</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Lista de usuários */}
        <div>
          <h3 className="text-lg font-medium mb-3">Usuários Cadastrados</h3>
          <ScrollArea className="h-[260px] border rounded-md p-4">
            {usuarios.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum usuário cadastrado
              </div>
            ) : (
              <div className="space-y-2">
                {usuarios.map((user, index) => (
                  <div key={user.email} className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{user.nome}</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removerUsuario(user.email)}
                      disabled={user.email === "admin@exemplo.com" || user.email === "lucasfriske@agrofarm.net.br"}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                    {index < usuarios.length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Formulário para adicionar usuário */}
        <div>
          <h3 className="text-lg font-medium mb-3">Adicionar Novo Usuário</h3>
          <form onSubmit={adicionarUsuario} className="border rounded-md p-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="nome" className="text-sm font-medium">Nome completo</label>
              <Input 
                id="nome" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                placeholder="Nome do usuário"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="senha" className="text-sm font-medium">Senha</label>
              <Input 
                id="senha" 
                type="password" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres" 
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="confirmSenha" className="text-sm font-medium">Confirme a senha</label>
              <Input 
                id="confirmSenha" 
                type="password" 
                value={confirmSenha} 
                onChange={(e) => setConfirmSenha(e.target.value)}
                placeholder="Confirme a senha" 
              />
            </div>
            
            <Button type="submit" className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Usuário
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GerenciadorUsuarios;
