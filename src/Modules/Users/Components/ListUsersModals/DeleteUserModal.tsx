import { useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { useDeleteUser } from "../../Hooks/UsersHooks";
import type { User } from "../../Models/User";

type Props = {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeleteUserModal({ user, open, onClose, onSuccess }: Props) {
  const deleteMutation = useDeleteUser();
  const [confirmText, setConfirmText] = useState("");

  const confirm = "confirmar".trim();
  const fullName = `${user.Name ?? ""} ${user.Surname1 ?? ""} ${user.Surname2 ?? ""}`.trim();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(user.Id);
      toast.success("¡Usuario desactivado!", { position: "top-right", autoClose: 3000 });
      onClose();
      onSuccess();
      setConfirmText("");
    } catch (err) {
      console.error("Error desactivando usuario:", err);
      toast.error("No se pudo desactivar el usuario", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const canDelete =
    confirmText.trim().toLowerCase() === confirm.toLowerCase() ||
    confirmText.trim().toLowerCase() === (user.Email ?? "").toLowerCase();

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setConfirmText("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Desactivar usuario</DialogTitle>
          <DialogDescription>
            Esta acción desactivará la cuenta del usuario. No se eliminarán registros.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto overflow-x-hidden px-6 py-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Usuario a desactivar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              <p className="text-sm text-foreground">
                Estás a punto de{" "}
                <span className="font-semibold text-destructive">desactivar</span> al usuario:
              </p>
              <p className="break-words text-base font-semibold">
                {fullName || user.Email || "—"}
              </p>
              <p className="text-xs text-muted-foreground">Cédula: {user.IDcard ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Correo: {user.Email ?? "—"}</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/50 bg-destructive/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-destructive">Aviso</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-destructive">
                Esta acción solo desactivará la cuenta. No se eliminarán registros para preservar la
                integridad de la base de datos.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-1">
            <label className="text-sm font-medium text-foreground">
              Escribe <span className="font-semibold">{confirm || user.Email}</span> para
              confirmar
            </label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Escribe "${confirm || user.Email}"`}
            />
            <span className="text-xs text-muted-foreground">
              También puedes escribir el correo <span className="font-medium">{user.Email}</span>.
            </span>
          </div>
        </div>

        <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
          <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row-reverse">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={!canDelete || deleteMutation.isPending}
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              {deleteMutation.isPending ? "Desactivando…" : "Desactivar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
