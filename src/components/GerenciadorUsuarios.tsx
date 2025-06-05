
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserPlus, UserX, User, Mail, Lock } from "lucide-react";

type Usuario = {
  nome: string;
  email: string;
  senha?: string;
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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">Adicione e gerencie usuários do sistema</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lista de usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Usuários Cadastrados ({usuarios.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {usuarios.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 bg-muted rounded-full mb-3">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Nenhum usuário cadastrado</p>
                  <p className="text-sm text-muted-foreground">Adicione o primeiro usuário ao lado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {usuarios.map((user, index) => (
                    <div key={user.email}>
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user.nome}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removerUsuario(user.email)}
                          disabled={user.email === "admin@exemplo.com" || user.email === "lucasfriske@agrofarm.net.br"}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                      {index < usuarios.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Formulário para adicionar usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Adicionar Novo Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={adicionarUsuario} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nome" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome completo
                </label>
                <Input 
                  id="nome" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  placeholder="Digite o nome completo"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="usuario@exemplo.com"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="senha" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Senha
                </label>
                <Input 
                  id="senha" 
                  type="password" 
                  value={senha} 
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmSenha" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirme a senha
                </label>
                <Input 
                  id="confirmSenha" 
                  type="password" 
                  value={confirmSenha} 
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  placeholder="Digite a senha novamente"
                  className="h-11"
                />
              </div>
              
              <Button type="submit" className="w-full h-11 mt-6">
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GerenciadorUsuarios;
