import { useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/Components/ui/field";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { ImagePlus, X } from "lucide-react";
import { showApiErrorToast } from "@/core/api-error";
import { useCreateReportByUser, useUploadReportPhoto } from "../../Hooks/ReportsHooks";
import { useGetAllReportTypes } from "../../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../../Hooks/ReportLocationHooks";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { createReportUserValidators } from "../../schemas/ReportSchema";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const defaultValues = {
  ReportLocationId: 0,
  ExactLocation: "",
  Description: "",
  ReportTypeId: 0,
};

export default function CreateReportUserModal({ open, setOpen }: Props) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitPhase, setSubmitPhase] = useState<"idle" | "creating" | "uploading">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createReportMutation = useCreateReportByUser();
  const uploadPhotoMutation = useUploadReportPhoto();
  const { reportTypes = [], isLoading: typesLoading } = useGetAllReportTypes();
  const { reportLocations = [], isLoading: locationsLoading } = useGetAllReportLocations();
  const { UserProfile, isLoading: profileLoading } = useGetUserProfile();

  const form = useForm({
    defaultValues,
    validators: {
      onChange: createReportUserValidators,
      onSubmit: createReportUserValidators,
    },
    onSubmit: async ({ value }) => {
      if (!UserProfile?.Id) {
        toast.error("Debes estar logueado para crear un reporte");
        return;
      }
      if (!photoFile) {
        toast.error("Debes agregar una foto del problema");
        return;
      }

      let phase: "creating" | "uploading" = "creating";
      try {
        setSubmitPhase("creating");
        const created = await createReportMutation.mutateAsync({
          ExactLocation: value.ExactLocation,
          Description: value.Description,
          UserId: UserProfile.Id,
          ReportLocationId: Number(value.ReportLocationId),
          ReportTypeId: Number(value.ReportTypeId),
        });

        setSubmitPhase("uploading");
        phase = "uploading";
        await uploadPhotoMutation.mutateAsync({ reportId: created.Id, photo: photoFile });

        toast.success("Reporte enviado. Sera revisado por nuestro equipo.");
        handleClose();
      } catch (error) {
        if (phase === "uploading") {
          toast.error(
            "El reporte se creo pero no se pudo subir la foto. Editalo para intentar de nuevo.",
          );
        } else {
          showApiErrorToast(error);
        }
      } finally {
        setSubmitPhase("idle");
      }
    },
  });

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Formato no permitido. Use JPEG, PNG o WebP");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`La foto no puede superar ${MAX_SIZE_MB} MB`);
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleClose() {
    form.reset();
    removePhoto();
    setSubmitPhase("idle");
    setOpen(false);
  }

  const isLoading = typesLoading || locationsLoading || profileLoading;
  const isSubmitting = submitPhase !== "idle";
  const submitLabel =
    submitPhase === "creating"
      ? "Enviando reporte..."
      : submitPhase === "uploading"
        ? "Subiendo foto..."
        : "Enviar reporte";
  const formatErrors = (errors: unknown[]) =>
    errors?.map((error) =>
      typeof error === "object" && error !== null && "message" in error
        ? { message: (error as { message: string }).message }
        : { message: String(error) }
    );
  const ReportField = form.Field;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) handleClose();
        else setOpen(true);
      }}
    >
      <DialogContent className="flex w-[calc(100%-1rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 max-h-[min(800px,95dvh)]">
        <DialogHeader className="shrink-0 space-y-1 border-b px-4 py-4 sm:px-6 sm:py-5">
          <DialogTitle>Crear nuevo reporte</DialogTitle>
          <DialogDescription>
            Reporta un problema en tu zona. Nuestro equipo lo atenderá a la brevedad.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center px-6 py-10">
            <p className="text-sm text-muted-foreground">Cargando informacion...</p>
          </div>
        ) : !UserProfile?.Id ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 px-6 py-10">
            <p className="text-center text-sm text-muted-foreground">
              Debes estar logueado para crear un reporte
            </p>
          </div>
        ) : (
          <form
            id="create-report-user-form"
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-4">
            <FieldGroup className="gap-4">

                {/* 1. Barrio */}
                <ReportField
                  name="ReportLocationId"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Barrio</FieldLabel>
                        <Select
                          value={field.state.value === 0 ? "" : String(field.state.value)}
                          onValueChange={(value) => field.handleChange(Number(value))}
                        >
                          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                            <SelectValue placeholder="Selecciona tu barrio" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportLocations.map((location) => (
                              <SelectItem key={location.Id} value={String(location.Id)}>
                                {location.Neighborhood}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && <FieldError errors={formatErrors(field.state.meta.errors)} />}
                      </Field>
                    );
                  }}
                />

                {/* 2. Dirección exacta */}
                <ReportField
                  name="ExactLocation"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Direccion exacta</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Ej: Calle principal, casa #123, frente al parque"
                        />
                        <p className="text-xs text-muted-foreground">
                          Proporciona la direccion exacta donde esta el problema
                        </p>
                        {isInvalid && <FieldError errors={formatErrors(field.state.meta.errors)} />}
                      </Field>
                    );
                  }}
                />

                {/* 3. Descripción */}
                <ReportField
                  name="Description"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Descripcion del problema</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Describe detalladamente el problema presentado..."
                          rows={3}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Incluye todos los detalles posibles para ayudarnos a resolverlo
                        </p>
                        {isInvalid && <FieldError errors={formatErrors(field.state.meta.errors)} />}
                      </Field>
                    );
                  }}
                />

                {/* 4. Tipo de reporte */}
                <ReportField
                  name="ReportTypeId"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Tipo de reporte</FieldLabel>
                        <Select
                          value={field.state.value === 0 ? "" : String(field.state.value)}
                          onValueChange={(value) => field.handleChange(Number(value))}
                        >
                          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                            <SelectValue placeholder="Seleccione tipo de reporte" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportTypes.map((type) => (
                              <SelectItem key={type.Id} value={String(type.Id)}>
                                {type.Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && <FieldError errors={formatErrors(field.state.meta.errors)} />}
                      </Field>
                    );
                  }}
                />

                {/* 5. Foto (opcional) */}
                <Field className="gap-2">
                  <FieldLabel>Foto del problema</FieldLabel>
                  {photoPreview ? (
                    <div className="relative w-full overflow-hidden rounded-lg border">
                      <img
                        src={photoPreview}
                        alt="Vista previa"
                        className="h-32 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 text-muted-foreground transition-colors hover:border-muted-foreground/60 hover:bg-muted/40"
                    >
                      <ImagePlus className="size-6" />
                      <span className="text-sm">Agregar foto del problema</span>
                      <span className="text-xs">JPEG, PNG o WebP · máx. 5 MB</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </Field>

              </FieldGroup>

              {UserProfile ? (
                <div className="mt-4 rounded-lg border bg-muted/40 px-4 py-3">
                  <p className="text-sm font-medium text-foreground">
                    Reporte enviado como: {UserProfile.Name} {UserProfile.Surname1}
                  </p>
                  <p className="text-xs text-muted-foreground">{UserProfile.Email}</p>
                </div>
              ) : null}
            </div>

            <DialogFooter className="shrink-0 border-t bg-background px-4 py-4 sm:px-6 sm:py-4">
              <form.Subscribe selector={(state) => state.canSubmit}>
                {(canSubmit) => (
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      form="create-report-user-form"
                      disabled={!canSubmit || isSubmitting || !UserProfile?.Id || !photoFile}
                      className="w-full sm:w-auto"
                    >
                      {submitLabel}
                    </Button>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                  </div>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
