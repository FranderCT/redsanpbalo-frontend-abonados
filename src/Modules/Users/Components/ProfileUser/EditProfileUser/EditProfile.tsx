import React from "react";
import { useForm } from "@tanstack/react-form";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "react-toastify";
import { useGetUserProfile, useUpdateUserProfile } from "../../../Hooks/UsersHooks";
import { EditProfileSchema, type EditProfileInput } from "../../../schemas/EditProfileSchema";
import ConfirmActionModal from "../../../../../Components/Modals/ConfirmActionModal";
import { updateUserMeInitialState } from "../../../Models/User";
import PhoneField from "../../../../../Components/PhoneNumber/PhoneField";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

const MAX_PHOTO_MB = 5;
const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif";
const CROPPED_IMAGE_SIZE = 512;

const createImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    image.src = src;
  });

const getCanvasOutputType = (fileType: string) => {
  if (fileType === "image/jpeg" || fileType === "image/png" || fileType === "image/webp") {
    return fileType;
  }
  return "image/png";
};

const getFileExtension = (fileType: string) => {
  switch (fileType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "png";
  }
};

const buildCroppedFile = async (
  imageSrc: string,
  croppedAreaPixels: Area,
  fileName: string,
  originalFileType: string
) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("No se pudo preparar el recorte");
  }

  canvas.width = CROPPED_IMAGE_SIZE;
  canvas.height = CROPPED_IMAGE_SIZE;

  context.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    CROPPED_IMAGE_SIZE,
    CROPPED_IMAGE_SIZE
  );

  const outputType = getCanvasOutputType(originalFileType);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, outputType, outputType === "image/jpeg" ? 0.92 : 1);
  });

  if (!blob) {
    throw new Error("No se pudo generar la imagen recortada");
  }

  return new File([blob], `${fileName}.${getFileExtension(outputType)}`, {
    type: outputType,
    lastModified: Date.now(),
  });
};

const EditProfile = () => {
  const { UserProfile } = useGetUserProfile();
  const updateProfile = useUpdateUserProfile();

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = React.useState(false);
  const [cropSource, setCropSource] = React.useState<string | null>(null);
  const [cropFileName, setCropFileName] = React.useState("foto-perfil");
  const [cropFileType, setCropFileType] = React.useState("image/jpeg");
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [isApplyingCrop, setIsApplyingCrop] = React.useState(false);
  const pendingValuesRef = React.useRef<EditProfileInput | null>(null);
  const croppedAreaPixelsRef = React.useRef<Area | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const hydratedUserIdRef = React.useRef<number | null>(null);

  const form = useForm({
    defaultValues: updateUserMeInitialState,
    validators: { onChange: EditProfileSchema },
    onSubmit: async ({ value }) => {
      pendingValuesRef.current = value;
      setOpenConfirm(true);
    },
  });

  const revokePhotoPreview = React.useCallback((preview: string | null) => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  }, []);

  const closeCropDialog = React.useCallback(() => {
    setCropDialogOpen(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    croppedAreaPixelsRef.current = null;
    setCropSource((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      toast.error(`La foto no puede superar ${MAX_PHOTO_MB} MB`, {
        position: "top-right",
        autoClose: 3000,
      });
      e.target.value = "";
      return;
    }

    if (file.type === "image/gif") {
      toast.info("Los GIF se guardarán como PNG al aplicar el recorte.", {
        position: "top-right",
        autoClose: 3500,
      });
    }

    closeCropDialog();
    setCropFileName(file.name.replace(/\.[^/.]+$/, "") || "foto-perfil");
    setCropFileType(file.type || "image/jpeg");
    setCropSource(URL.createObjectURL(file));
    setCropDialogOpen(true);
    e.target.value = "";
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    revokePhotoPreview(photoPreview);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const applyCroppedPhoto = async () => {
    if (!cropSource || !croppedAreaPixelsRef.current) {
      toast.error("Primero ajuste el encuadre de la foto.", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }

    try {
      setIsApplyingCrop(true);
      const croppedFile = await buildCroppedFile(
        cropSource,
        croppedAreaPixelsRef.current,
        cropFileName,
        cropFileType
      );
      const nextPreview = URL.createObjectURL(croppedFile);

      setPhotoFile(croppedFile);
      setPhotoPreview((currentPreview) => {
        revokePhotoPreview(currentPreview);
        return nextPreview;
      });
      closeCropDialog();
    } catch {
      toast.error("No se pudo recortar la imagen seleccionada.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsApplyingCrop(false);
    }
  };

  React.useEffect(() => {
    if (!UserProfile) return;
    if (hydratedUserIdRef.current === UserProfile.Id) return;

    form.reset({
      Birthdate: UserProfile.Birthdate ? new Date(UserProfile.Birthdate) : undefined,
      PhoneNumber: UserProfile.PhoneNumber ?? "",
      Address: UserProfile.Address ?? "",
    });
    hydratedUserIdRef.current = UserProfile.Id;

    // `form` cambia durante interacciones locales; solo rehidratamos al cargar/cambiar de usuario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserProfile]);

  React.useEffect(() => {
    return () => {
      revokePhotoPreview(photoPreview);
    };
  }, [photoPreview, revokePhotoPreview]);

  const buildPatch = (values: EditProfileInput) => {
    const patch: Partial<EditProfileInput> = {};
    const meta = form.state.fieldMeta as Record<string, { isDirty?: boolean }>;
    for (const [key, m] of Object.entries(meta)) {
      if (!m?.isDirty) continue;
      const v = (values as Record<string, unknown>)[key];
      if (v === "" || v === undefined || v === null) continue;
      if (v instanceof Date && Number.isNaN(v.getTime())) continue;
      (patch as Record<string, unknown>)[key] = v;
    }
    return patch;
  };

  const handleConfirmUpdate = async () => {
    if (!pendingValuesRef.current) return;
    try {
      const patch = buildPatch(pendingValuesRef.current);
      const hasFormChanges = Object.keys(patch).length > 0;
      const hasPhoto = !!photoFile;
      if (!hasFormChanges && !hasPhoto) {
        toast.info("No hay cambios para guardar.", { position: "top-right", autoClose: 2500 });
        setOpenConfirm(false);
        pendingValuesRef.current = null;
        return;
      }
      await updateProfile.mutateAsync({
        payload: patch as EditProfileInput,
        photo: photoFile ?? undefined,
      });
      form.reset(form.state.values);
      clearPhoto();
      toast.success("¡Actualización exitosa!", { position: "top-right", autoClose: 3000 });
    } catch {
      toast.error("¡Error al actualizar el perfil!", { position: "top-right", autoClose: 3000 });
    } finally {
      setOpenConfirm(false);
      pendingValuesRef.current = null;
    }
  };

  const handleCancelUpdate = () => {
    setOpenConfirm(false);
    toast.info("¡Actualización cancelada!", { position: "top-right", autoClose: 2500 });
    pendingValuesRef.current = null;
  };

  const hasChanges =
    form.state.isDirty || photoFile !== null;

  const fullName = [UserProfile?.Name, UserProfile?.Surname1, UserProfile?.Surname2]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="min-h-full w-full bg-background">
      <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Editar información
          </h1>
          <p className="text-sm text-muted-foreground">
            Modifique los datos de su perfil
          </p>
        </div>

        <Separator className="mb-8 bg-border" />

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              Edición de perfil
            </CardTitle>
            <CardDescription>
              {fullName || "Usuario"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <FieldGroup className="gap-4">
                <Field className="gap-2">
                  <FieldLabel>Foto de perfil</FieldLabel>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="size-24 rounded-full overflow-hidden ring-2 ring-border bg-muted">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Vista previa"
                            className="h-full w-full object-cover"
                          />
                        ) : UserProfile?.ProfilePhoto ? (
                          <img
                            src={UserProfile.ProfilePhoto}
                            alt="Foto actual"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                            Sin foto
                          </div>
                        )}
                      </div>
                      {photoFile && (
                        <button
                          type="button"
                          onClick={clearPhoto}
                          className="absolute -top-1 -right-1 rounded-full bg-destructive text-destructive-foreground size-6 flex items-center justify-center text-xs hover:bg-destructive/90"
                          aria-label="Quitar foto"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPT_IMAGES}
                        onChange={handlePhotoChange}
                        className="cursor-pointer file:mr-2 file:text-sm file:font-medium"
                      />
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, WebP o GIF. Máx. {MAX_PHOTO_MB} MB.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Al seleccionar una imagen podrá moverla y ajustar el encuadre antes de guardarla.
                      </p>
                    </div>
                  </div>
                </Field>

                <form.Field name="Birthdate">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor="edit-birthdate">
                          Fecha de nacimiento
                        </FieldLabel>
                        <Input
                          id="edit-birthdate"
                          type="date"
                          value={
                            field.state.value instanceof Date &&
                            !Number.isNaN(field.state.value.getTime())
                              ? field.state.value.toISOString().slice(0, 10)
                              : ""
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            field.handleChange(val ? new Date(val) : undefined);
                          }}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="PhoneNumber">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <PhoneField
                          value={field.state.value ?? ""}
                          onChange={(val) => field.handleChange(val ?? "")}
                          defaultCountry="CR"
                          error={
                            isInvalid && field.state.meta.errors[0]
                              ? String(
                                  (field.state.meta.errors[0] as { message?: string })?.message ??
                                    field.state.meta.errors[0]
                                )
                              : undefined
                          }
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="Address">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor="edit-address">Dirección</FieldLabel>
                        <Textarea
                          id="edit-address"
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={UserProfile?.Address ?? "Su dirección"}
                          rows={3}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              <div className="flex justify-end pt-2">
                <form.Subscribe
                  selector={(s) => [s.isSubmitting]}
                >
                  {([isSubmitting]) => (
                    <Button
                      type="submit"
                      disabled={!hasChanges || isSubmitting || updateProfile.isPending}
                    >
                      {isSubmitting || updateProfile.isPending
                        ? "Guardando…"
                        : "Confirmar cambios"}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {openConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={handleCancelUpdate}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ConfirmActionModal
              onConfirm={handleConfirmUpdate}
              onCancel={handleCancelUpdate}
              onClose={handleCancelUpdate}
            />
          </div>
        </div>
      )}

      <Dialog
        open={cropDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCropDialog();
          }
        }}
      >
        <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-hidden border-border bg-card p-0">
          <DialogHeader className="shrink-0 border-b border-border px-6 py-5">
            <DialogTitle>Ajustar foto de perfil</DialogTitle>
            <DialogDescription>
              Mueva la imagen y use el zoom para elegir exactamente el encuadre que desea guardar.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-6 py-5">
              <div className="relative mx-auto h-[320px] w-full overflow-hidden rounded-xl bg-slate-950 sm:h-[420px]">
                  {cropSource ? (
                    <Cropper
                      image={cropSource}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      showGrid
                      cropShape="rect"
                      objectFit="horizontal-cover"
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={(_, croppedAreaPixels) => {
                        croppedAreaPixelsRef.current = croppedAreaPixels;
                      }}
                    />
                  ) : null}
              </div>

              <label className="mx-auto block w-full max-w-xl space-y-2">
                <span className="text-sm font-medium text-foreground">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </label>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border bg-card px-6 py-4">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
              <Button type="button" onClick={applyCroppedPhoto} disabled={isApplyingCrop}>
                {isApplyingCrop ? "Aplicando…" : "Usar esta foto"}
              </Button>
              <Button type="button" variant="outline" onClick={closeCropDialog}>
                Cancelar
              </Button>
            </div>
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </main>
  );
};

export default EditProfile;
