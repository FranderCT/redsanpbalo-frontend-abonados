import { useState } from "react";
import { Upload, FolderOpen, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../../../Components/ui/button";
import { getProjectFolderLink, uploadProjectFiles } from "../../../../Upload-files/Services/ProjectFileServices";

type Props = { projectId: number };

export default function ProjectDocumentsSection({ projectId }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingLink, setIsFetchingLink] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (list: FileList) =>
    setFiles((prev) => [...prev, ...Array.from(list)]);

  const removeFile = (i: number) =>
    setFiles((prev) => prev.filter((_, j) => j !== i));

  const handleUpload = async () => {
    if (!files.length) return;
    setIsUploading(true);
    try {
      await uploadProjectFiles(projectId, files);
      toast.success("Archivos subidos exitosamente");
      setFiles([]);
    } catch {
      toast.error("Error al subir los archivos");
    } finally {
      setIsUploading(false);
    }
  };

  const openFolder = async () => {
    setIsFetchingLink(true);
    try {
      const folderLink = await getProjectFolderLink(projectId);

      if (folderLink && folderLink.includes("dropbox.com")) {
        window.open(folderLink, "_blank", "noopener,noreferrer");
      } else {
        toast.error("No se pudo obtener el enlace de la carpeta");
      }
    } catch {
      toast.error("Error al abrir la carpeta del proyecto");
    } finally {
      setIsFetchingLink(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4 print:hidden">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Documentos del proyecto
      </h3>

      {/* Drop zone */}
      <label
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-8 cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground/40 hover:bg-muted/20"
        }`}
      >
        <Upload className="size-7 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">
            Arrastra archivos aquí
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            o{" "}
            <span className="text-foreground underline underline-offset-2 cursor-pointer">
              selecciónalos desde tu dispositivo
            </span>
          </p>
        </div>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="rounded-md border divide-y overflow-hidden">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 text-sm bg-card hover:bg-muted/20 transition-colors">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-sm">{f.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(f.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeFile(i)}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleUpload}
          disabled={!files.length || isUploading}
          size="sm"
          className="flex-1"
        >
          <Upload className="size-3.5 mr-2" />
          {isUploading
            ? "Subiendo…"
            : `Subir${files.length ? ` (${files.length})` : ""}`}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={openFolder}
          disabled={isFetchingLink}
          className="flex-1"
        >
          <FolderOpen className="size-3.5 mr-2" />
          {isFetchingLink ? "Obteniendo…" : "Ver carpeta del proyecto"}
        </Button>
      </div>
    </div>
  );
}
