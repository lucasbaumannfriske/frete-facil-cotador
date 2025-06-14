
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuditLogInfo = () => (
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
);

export default AuditLogInfo;
