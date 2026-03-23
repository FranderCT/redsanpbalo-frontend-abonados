import React from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
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

type ProfilePhotoPickerProps = {
  previewSrc: string | null;
  currentPhotoSrc?: string;
  hasSelectedPhoto: boolean;
  onApply: (file: File, previewUrl: string) => void;
  onClear: () => void;
};

export default function ProfilePhotoPicker({
  previewSrc,
  currentPhotoSrc,
  hasSelectedPhoto,
  onApply,
  onClear,
}: ProfilePhotoPickerProps) {
  const [cropDialogOpen, setCropDialogOpen] = React.useState(false);
  const [cropSource, setCropSource] = React.useState<string | null>(null);
  const [cropFileName, setCropFileName] = React.useState("foto-perfil");
  const [cropFileType, setCropFileType] = React.useState("image/jpeg");
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [isApplyingCrop, setIsApplyingCrop] = React.useState(false);
  const croppedAreaPixelsRef = React.useRef<Area | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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

  const handleClear = () => {
    onClear();
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
      onApply(croppedFile, nextPreview);
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

  return (
    <>
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <div className="relative shrink-0">
          <div className="size-24 overflow-hidden rounded-full bg-muted ring-2 ring-border">
            {previewSrc ? (
              <img
                src={previewSrc}
                alt="Vista previa"
                className="h-full w-full object-cover"
              />
            ) : currentPhotoSrc ? (
              <img
                src={currentPhotoSrc}
                alt="Foto actual"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                Sin foto
              </div>
            )}
          </div>

          {hasSelectedPhoto && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground hover:bg-destructive/90"
              aria-label="Quitar foto"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-1">
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
    </>
  );
}
