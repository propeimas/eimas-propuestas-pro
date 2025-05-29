
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="hover:bg-gray-100" />
        <div>
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="bg-secondary text-white">
          Sistema EIMAS
        </Badge>
      </div>
    </div>
  );
}
