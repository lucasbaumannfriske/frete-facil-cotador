
import React, { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileTextIcon, ActivityIcon } from "lucide-react";
import { AuditLog, useAuditLogs } from "@/hooks/useAuditLogs";
import AuditLogInfo from "./AuditLogInfo";
import AuditLogCard from "./AuditLogCard";
import AuditLogFilters from "./AuditLogFilters";

const LogsAuditoria = () => {
  const { logs, loading } = useAuditLogs();

  // Estados dos filtros
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");

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

  // Funções utilitárias (mantidas aqui para compartilhar facilmente com AuditLogCard)
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
      // eslint-disable-next-line
      return require("date-fns").format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
        locale: require("date-fns/locale").ptBR,
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
      <AuditLogInfo />

      {/* Filtros */}
      <AuditLogFilters
        logs={logs}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
      />

      <ScrollArea className="h-[500px] pr-0">
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
            {filteredLogs.map((log) => (
              <AuditLogCard
                key={log.id}
                log={log}
                formatChanges={formatChanges}
                getActionColor={getActionColor}
                getActionText={getActionText}
                getTableText={getTableText}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default LogsAuditoria;
