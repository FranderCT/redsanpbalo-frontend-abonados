import React from "react";
import type { User } from "../../Models/User";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const DEFAULT_AVATAR = "/Image02.png";

type Props = {
  User?: User;
};

const UserPhotoProfile = ({ User }: Props) => {
  const fullName = [User?.Name, User?.Surname1, User?.Surname2]
    .filter(Boolean)
    .join(" ");
  const [imgError, setImgError] = React.useState(false);
  React.useEffect(() => {
    setImgError(false);
  }, [User?.ProfilePhoto]);
  const photoSrc = User?.ProfilePhoto && !imgError ? User.ProfilePhoto : DEFAULT_AVATAR;

  return (
    <Card className="user-profile-photo overflow-hidden border-border bg-card shadow-sm">
      <CardHeader className="pb-2 pt-6 text-center">
        <CardTitle className="text-lg font-semibold text-foreground">
          {fullName || "—"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-6 pt-0">
        <div
          className={cn(
            "size-36 sm:size-40 lg:size-48 rounded-full overflow-hidden",
            "ring-2 ring-border bg-muted"
          )}
        >
          <img
            src={photoSrc}
            alt={fullName ? `Foto de ${fullName}` : "Foto de perfil"}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPhotoProfile;
