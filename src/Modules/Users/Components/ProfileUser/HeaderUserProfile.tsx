import { useNavigate } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { Button } from "@/Components/ui/button";

const HeaderUserProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Perfil
        </h1>
        <p className="text-sm text-muted-foreground">
          Observe todos los detalles de su perfil
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0"
        onClick={() => navigate({ to: "/dashboard/users/edit" })}
      >
        <Pencil className="size-4" />
        Editar
      </Button>
    </div>
  );
};

export default HeaderUserProfile;