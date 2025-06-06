
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserPlus, UserX, User, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type SystemUser = {
  id: string;
  nome: string;
  email: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

const GerenciadorUsuarios = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const queryClient = useQueryClient();

  // Buscar usuários do sistema do Supabase
  const { data: systemUsers = [], isLoading } = useQuery({
    queryKey: ['system-users'],
    queryFn: async () => {
      console.log('Buscando usuários do sistema...');
      const { data, error } = await supabase
        .from('system_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }
      
      console.log('Usuários encontrados:', data);
      return data as SystemUser[];
    }
  });

  // Verificar e sincronizar usuário atual
  useEffect(() => {
    const syncCurrentUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser) {
          console.log('Usuário atual:', currentUser);
          
          // Verificar se o usuário atual já existe na tabela system_users
          const { data: existingUser } = await supabase
            .from('system_users')
            .select('*')
            .eq('email', currentUser.email)
            .single();

          if (!existingUser) {
            console.log('Adicionando usuário atual à tabela system_users...');
            
            // Adicionar o usuário atual à tabela system_users
            const { error: insertError } = await supabase
              .from('system_users')
              .insert({
                nome: currentUser.user_metadata?.nome || currentUser.email?.split('@')[0] || 'Usuário',
                email: currentUser.email!,
                created_by: currentUser.id
              });

            if (insertError) {
              console.error('Erro ao sincronizar usuário atual:', insertError);
            } else {
              console.log('Usuário atual sincronizado com sucesso');
              queryClient.invalidateQueries({ queryKey: ['system-users'] });
            }
          }
        }
      } catch (error) {
        console.error('Erro ao sincronizar usuário atual:', error);
      }
    };

    syncCurrentUser();
  }, [queryClient]);

  // Mutation para adicionar usuário
  const addUserMutation = useMutation({
    mutationFn: async ({ nome, email, senha }: { nome: string; email: string; senha: string }) => {
      console.log('Tentando criar usuário:', { nome, email });
      
      // 1. Obter usuário atual autenticado para usar como created_by
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // 2. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome: nome
          },
          emailRedirectTo: undefined
        }
      });

      if (authError) {
        console.error('Erro no Supabase Auth:', authError);
        throw new Error(`Erro ao criar usuário: ${authError.message}`);
      }

      console.log('Usuário criado no Auth:', authData);

      // 3. Adicionar à tabela system_users
      const { data: systemUserData, error: systemUserError } = await supabase
        .from('system_users')
        .insert([{
          nome,
          email,
          created_by: currentUser.id
        }])
        .select()
        .single();

      if (systemUserError) {
        console.error('Erro ao criar usuário do sistema:', systemUserError);
        throw new Error(`Erro ao registrar usuário no sistema: ${systemUserError.message}`);
      }

      console.log('Usuário criado no sistema:', systemUserData);
      return systemUserData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmSenha("");
      toast.success("Usuário adicionado com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Erro ao adicionar usuário:', error);
      toast.error(error.message || "Erro ao adicionar usuário");
    }
  });

  // Mutation para remover usuário
  const removeUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Primeiro, buscar o email do usuário para não permitir remover usuários protegidos
      const { data: userData } = await supabase
        .from('system_users')
        .select('email')
        .eq('id', userId)
        .single();

      if (userData?.email === "lucasfriske@agrofarm.net.br") {
        throw new Error("Não é possível remover este usuário do sistema");
      }

      const { error } = await supabase
        .from('system_users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      toast.success("Usuário removido com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Erro ao remover usuário:', error);
      toast.error(error.message || "Erro ao remover usuário");
    }
  });

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
    if (systemUsers.some(user => user.email === email)) {
      toast.error("Este email já está cadastrado");
      return;
    }

    addUserMutation.mutate({ nome, email, senha });
  };

  // Remover usuário
  const removerUsuario = (userId: string, email: string) => {
    if (email === "lucasfriske@agrofarm.net.br") {
      toast.error("Não é possível remover este usuário do sistema");
      return;
    }
    
    removeUserMutation.mutate(userId);
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
              Usuários Cadastrados ({systemUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Carregando usuários...</p>
                </div>
              ) : systemUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 bg-muted rounded-full mb-3">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Nenhum usuário cadastrado</p>
                  <p className="text-sm text-muted-foreground">Adicione o primeiro usuário ao lado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {systemUsers.map((user, index) => (
                    <div key={user.id}>
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
                          onClick={() => removerUsuario(user.id, user.email)}
                          disabled={user.email === "lucasfriske@agrofarm.net.br" || removeUserMutation.isPending}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                      {index < systemUsers.length - 1 && <Separator className="my-2" />}
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
                  disabled={addUserMutation.isPending}
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
                  disabled={addUserMutation.isPending}
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
                  disabled={addUserMutation.isPending}
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
                  disabled={addUserMutation.isPending}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 mt-6"
                disabled={addUserMutation.isPending}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {addUserMutation.isPending ? "Adicionando..." : "Adicionar Usuário"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GerenciadorUsuarios;
