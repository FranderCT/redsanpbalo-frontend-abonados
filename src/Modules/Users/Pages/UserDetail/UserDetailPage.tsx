import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { userDetailRoute } from "../../Routes/UsersRoutes";
import { useGetUserById } from "../../Hooks/UsersHooks";
import UserDetailCard from "../../Components/UserDetail/UserDetailCard";

const UserDetailPage = () => {
  const { userId } = userDetailRoute.useParams();
  const navigate = useNavigate();
  const id = useMemo(() => Number(userId), [userId]);

  const { user, isLoading, error } = useGetUserById(
    Number.isFinite(id) && id > 0 ? id : 0
  );

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!Number.isFinite(id) || id <= 0 || error || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">
          {error ? "No se pudo cargar la información del usuario." : "Usuario no encontrado."}
        </p>
        <Button variant="outline" onClick={() => navigate({ to: "/dashboard/users" })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a usuarios
        </Button>
      </div>
    );
  }

  return <UserDetailCard user={user} />;
};

export default UserDetailPage;
