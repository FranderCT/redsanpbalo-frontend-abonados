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
  DialogTrigger,
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
import { FileText, ImagePlus, X } from "lucide-react";
import { showApiErrorToast } from "@/core/api-error";
import { useCreateReportByAdmin, useUploadReportPhoto } from "../../Hooks/ReportsHooks";
import { useGetAllReportTypes } from "../../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../../Hooks/ReportLocationHooks";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { createReportValidators } from "../../schemas/ReportSchema";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

const defaultValues = {
  ReportLocationId: 0,
  ExactLocation: "",
  Description: "",
  ReportTypeId: 0,
};

export default function CreateReportModal() {
  const [open, setOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitPhase, setSubmitPhase] = useState<"idle" | "creating" | "uploading">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createReportMutation = useCreateReportByAdmin();
  const uploadPhotoMutation = useUploadReportPhoto();
  const { reportTypes = [], isLoading: typesLoading } = useGetAllReportTypes();
  const { reportLocations = [], isLoading: locationsLoading } = useGetAllReportLocations();
  const { UserProfile, isLoading: profileLoading } = useGetUserProfile();

  const form = useForm({
    defaultValues,
    validators: {
      onChange: createReportValidators,
      onSubmit: createReportValidators,
    },
    onSubmit: async ({ value }) => {
      if (!UserProfile?.Id) {
        toast.error("No se pudo obtener la informacion del usuario");
        return;
      }
      if (!photoFile) {
        toast.error("Debes agregar una foto del reporte");
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

        toast.success("Reporte creado exitosamente");
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
      ? "Creando reporte..."
      : submitPhase === "uploading"
        ? "Subiendo foto..."
        : "Crear reporte";
  const ReportField = form.Field;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) handleClose();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <FileText className="size-4" />
          Crear reporte
        </Button>
      </DialogTrigger>

      <DialogContent className="flex w-[calc(100%-1rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 max-h-[min(800px,95dvh)]">
        <DialogHeader className="shrink-0 space-y-1 border-b px-4 py-4 sm:px-6 sm:py-5">
          <DialogTitle>Crear nuevo reporte</DialogTitle>
          <DialogDescription>
            Completa la informacion del reporte para registrarlo en el sistema.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center px-6 py-10">
            <p className="text-sm text-muted-foreground">Cargando informacion...</p>
          </div>
        ) : (
          <form
            id="create-report-form"
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
                            <SelectValue placeholder="Seleccionar barrio" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportLocations.map((location) => (
                              <SelectItem key={location.Id} value={String(location.Id)}>
                                {location.Neighborhood}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                          placeholder="Ej: Calle principal, casa #123"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                        <FieldLabel htmlFor={field.name}>Descripcion del reporte</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Describe detalladamente el problema..."
                          rows={3}
                          className="resize-none"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportTypes.map((type) => (
                              <SelectItem key={type.Id} value={String(type.Id)}>
                                {type.Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />

                {/* 5. Foto (opcional) */}
                <Field className="gap-2">
                  <FieldLabel>Foto del reporte</FieldLabel>
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
                    Reporte creado por {UserProfile.Name} {UserProfile.Surname1}
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
                      form="create-report-form"
                      disabled={!canSubmit || isSubmitting || !photoFile}
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
