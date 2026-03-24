import { useState } from "react";
import { ZoomIn, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/Components/ui/dialog";

type Props = {
  src: string;
  alt?: string;
  /** Altura del thumbnail, default h-48 */
  thumbnailClass?: string;
};

export default function ReportPhotoLightbox({
  src,
  alt = "Foto del reporte",
  thumbnailClass = "h-48",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail clicable */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative w-full overflow-hidden rounded-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${thumbnailClass}`}
        aria-label="Ver foto completa"
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
          <div className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <ZoomIn className="size-3.5" />
            Ver foto completa
          </div>
        </div>
      </button>

      {/* Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-screen max-w-screen-lg border-0 bg-black/95 p-0 shadow-none [&>button]:text-white [&>button]:hover:bg-white/20">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative flex max-h-screen items-center justify-center p-4">
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-full rounded object-contain"
            />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cerrar foto"
          >
            <X className="size-5" />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
