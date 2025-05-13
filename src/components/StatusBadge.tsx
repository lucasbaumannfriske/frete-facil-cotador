
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Define a cor de fundo baseada no status
  const getBackgroundColor = () => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800 border-green-200";
      case "Recusado":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pendente":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        getBackgroundColor(),
        className
      )}
    >
      {status}
    </span>
  );
}
