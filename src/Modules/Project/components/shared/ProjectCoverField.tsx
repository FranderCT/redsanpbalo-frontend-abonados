import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  file: File | null;
  existingUrl?: string | null;
  markForRemoval?: boolean;
  onFileChange: (file: File | null) => void;
  onMarkForRemovalChange?: (next: boolean) => void;
};

export default function ProjectCoverField({
  file,
  existingUrl,
  markForRemoval = false,
  onFileChange,
  onMarkForRemovalChange,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const displayedImageUrl = previewUrl ?? (!markForRemoval ? existingUrl ?? null : null);
  const hasExistingImage = Boolean(existingUrl);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label htmlFor={inputId}>Foto de portada</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Sube una imagen horizontal para representar el proyecto.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {markForRemoval && !file && (
            <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
              Se eliminará al guardar
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mr-2 size-4" />
            {displayedImageUrl ? "Cambiar imagen" : "Subir imagen"}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-dashed bg-muted/20",
          displayedImageUrl ? "p-3" : "p-8",
        )}
      >
        {displayedImageUrl ? (
          <div className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-xl border bg-background">
              <img
                src={displayedImageUrl}
                alt="Vista previa de portada del proyecto"
                className="h-56 w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {file && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onFileChange(null);
                    if (hasExistingImage) onMarkForRemovalChange?.(false);
                  }}
                >
                  Quitar selección
                </Button>
              )}

              {!file && hasExistingImage && !markForRemoval && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onMarkForRemovalChange?.(true)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Eliminar portada actual
                </Button>
              )}

              {!file && hasExistingImage && markForRemoval && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onMarkForRemovalChange?.(false)}
                >
                  Conservar portada
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
              <ImagePlus className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Todavía no hay portada</p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG o WebP. Se recomienda una imagen panorámica.
              </p>
            </div>
          </div>
        )}
      </div>

      {file && (
        <p className="text-xs text-muted-foreground">
          Archivo seleccionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const nextFile = e.target.files?.[0] ?? null;
          onFileChange(nextFile);
          if (nextFile) onMarkForRemovalChange?.(false);
          e.currentTarget.value = "";
        }}
      />
    </div>
  );
}
