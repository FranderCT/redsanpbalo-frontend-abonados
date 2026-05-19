import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { User, LogOut } from "lucide-react";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { disconnectAppSocket } from "@/Sockets/appSocket";

const DEFAULT_AVATAR = "/Image02.png";

type Props = {
  setProfileOpen?: (v: boolean) => void;
};

export default function ProfileUserMenu({ setProfileOpen }: Props) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { UserProfile } = useGetUserProfile();
  const photoSrc = UserProfile?.ProfilePhoto || DEFAULT_AVATAR;
  const showFallbackIcon = imgError;

  const handleProfile = () => {
    navigate({ to: "/dashboard/users/profile" });
    setProfileOpen?.(false);
  };

  const handleLogout = () => {
    disconnectAppSocket();
    localStorage.removeItem("token");
    localStorage.removeItem("activeRole");
    queryClient.clear();
    navigate({ to: "/login" });
    setProfileOpen?.(false);
  };

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted transition hover:ring-2 hover:ring-ring sm:h-12 sm:w-12 md:h-14 md:w-14",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="Abrir menú de perfil"
          >
            {showFallbackIcon ? (
              <User className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
            ) : (
              <img
                src={photoSrc}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[10rem]">
          <DropdownMenuItem onClick={handleProfile}>
            <User className="mr-2 h-4 w-4" />
            Mi perfil
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
