
import React, { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLog, useAuditLogs } from "@/hooks/useAuditLogs";
import {
  FileTextIcon,
  ActivityIcon,
  UserIcon,
  CalendarIcon,
  DatabaseIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const actionTypes = [
  { value: "all", label: "Todas as Ações" },
  { value: "CREATE", label: "Criação" },
  { value: "UPDATE", label: "Edição" },
  { value: "DELETE", label: "Exclusão" },
];

const LogsAuditoria = () => {
  const { logs, loading } = useAuditLogs();

  // Estados dos filtros
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");

  // Listar usuários únicos a partir dos logs
  const userOptions = useMemo(() => {
    const emails = new Set<string>();
    logs.forEach((log) => {
      if (log.user_email) emails.add(log.user_email);
    });
    return Array.from(emails);
  }, [logs]);

  // Filtragem dos logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const userFilter =
        selectedUser === "all" || log.user_email === selectedUser;
      const actionFilter =
        selectedAction === "all" || log.action === selectedAction;
      return userFilter && actionFilter;
    });
  }, [logs, selectedUser, selectedAction]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800 border-green-200";
      case "UPDATE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case "CREATE":
        return "Criação";
      case "UPDATE":
        return "Edição";
      case "DELETE":
        return "Exclusão";
      default:
        return action;
    }
  };

  const getTableText = (tableName: string) => {
    switch (tableName) {
      case "cotacoes":
        return "Cotações";
      case "produtos":
        return "Produtos";
      case "transportadoras":
        return "Transportadoras";
      default:
        return tableName;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };

  const formatChanges = (oldData: any, newData: any, tableName: string) => {
    if (!oldData || !newData) return null;

    const changes: string[] = [];
    const fieldsToShow = {
      cotacoes: ["cliente", "origem", "destino", "fazenda"],
      transportadoras: [
        "nome",
        "valor_unitario",
        "valor_total",
        "status",
        "proposta_final",
      ],
      produtos: ["nome", "quantidade", "peso"],
    };

    const fieldsToCheck =
      fieldsToShow[tableName as keyof typeof fieldsToShow] ||
      Object.keys(newData);

    fieldsToCheck.forEach((field) => {
      if (oldData[field] !== newData[field]) {
        const fieldName =
          field === "valor_unitario"
            ? "Valor Unitário"
            : field === "valor_total"
            ? "Valor Total"
            : field === "proposta_final"
            ? "Proposta Final"
            : field.charAt(0).toUpperCase() + field.slice(1);

        changes.push(
          `${fieldName}: ${oldData[field] || "vazio"} → ${
            newData[field] || "vazio"
          }`
        );
      }
    });

    return changes.length > 0 ? changes.join(", ") : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <ActivityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50 animate-pulse" />
          <p className="text-muted-foreground">
            Carregando logs de auditoria...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Explicação didática */}
      <Card className="mb-6 bg-muted/30 border-primary/10">
        <CardHeader className="pb-1">
          <CardTitle className="text-xl">O que são logs de auditoria?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Os logs de auditoria registram todas as ações importantes feitas por usuários dentro do sistema. 
            Cada registro mostra quem fez a alteração, o tipo de operação (criação, edição ou exclusão), a data e o que foi alterado.
            Utilize os filtros para rapidamente identificar e acompanhar quais usuários fizeram alterações e quais tipos de modificações foram realizadas.
          </p>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end mb-5">
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs text-muted-foreground mb-1 block">Usuário</label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os usuários</SelectItem>
              {userOptions.map((email) => (
                <SelectItem value={email} key={email}>
                  {email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground mb-1 block">Ação</label>
          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {actionTypes.map(({ value, label }) => (
                <SelectItem value={value} key={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(selectedUser !== "all" || selectedAction !== "all") && (
          <Button
            variant="outline"
            className="mt-1 md:mt-0"
            onClick={() => {
              setSelectedUser("all");
              setSelectedAction("all");
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      <ScrollArea className="h-[500px] pr-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              Nenhum log de auditoria encontrado com esses filtros.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              As atividades do sistema aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const changes =
                log.action === "UPDATE"
                  ? formatChanges(log.old_data, log.new_data, log.table_name)
                  : null;

              return (
                <Card
                  key={log.id}
                  className="border-l-4 border-l-primary/20 shadow-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getActionColor(log.action)}>
                          {getActionText(log.action)}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <DatabaseIcon className="h-3 w-3" />
                          {getTableText(log.table_name)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(log.created_at)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <UserIcon className="h-3 w-3" />
                      <span className="font-medium">
                        {log.user_email || "Usuário desconhecido"}
                      </span>
                    </div>
                  </CardHeader>

                  {log.description && (
                    <CardContent className="pt-0">
                      <p className="text-sm bg-muted/30 p-3 rounded border-l-2 border-l-primary/30">
                        {log.description}
                      </p>
                    </CardContent>
                  )}

                  {changes && (
                    <CardContent className="pt-0">
                      <div className="text-sm">
                        <h4 className="font-medium text-muted-foreground mb-2">
                          Alterações:
                        </h4>
                        <p className="bg-blue-50 border border-blue-200 p-3 rounded text-xs">
                          {changes}
                        </p>
                      </div>
                    </CardContent>
                  )}

                  {log.action === "CREATE" && log.new_data && (
                    <CardContent className="pt-0">
                      <div className="text-sm">
                        <h4 className="font-medium text-muted-foreground mb-2">
                          Registro Criado:
                        </h4>
                        <p className="bg-green-50 border border-green-200 p-3 rounded text-xs">
                          {log.table_name === "cotacoes" &&
                            `Cliente: ${log.new_data.cliente}`}
                          {log.table_name === "transportadoras" &&
                            `Transportadora: ${log.new_data.nome}`}
                          {log.table_name === "produtos" &&
                            `Produto: ${log.new_data.nome}`}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default LogsAuditoria;

