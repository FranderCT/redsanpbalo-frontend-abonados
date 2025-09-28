import { useEffect, useState } from 'react';

type Props = {
  ProjectId?: number;
  ButtonName: string;
  closeOnEsc?: boolean;       // default: true
  closeOnOutside?: boolean;   // default: true
}

const CreateProjectTraceModal = ({
  ProjectId,
  ButtonName,
  closeOnOutside = true,
  closeOnEsc = true,
}: Props) => {
  const [open, setOpen] = useState(false);

  // Cerrar con ESC
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeOnEsc]);




  

  return (
    <>
      {/* Botón de apertura */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2  bg-[#1789FC] text-white hover:opacity-90"
      >
        {ButtonName}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trace-modal-title"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeOnOutside ? () => setOpen(false) : undefined}
          />

          {/* Contenido */}
          <div
            className="
              relative mx-auto mt-24 w-full max-w-xl
              bg-white text-[#091540]
              border border-[#091540] rounded-none
              shadow-lg
            "
            // Evita cerrar al hacer click dentro
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between px-4 py-3 border-b border-[#D9DBE9]">
              <h2 id="trace-modal-title" className="text-lg font-semibold">
                Agregar seguimiento
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="
                  px-2 py-1
                  text-[#091540]
                  border border-transparent
                  hover:border-[#091540]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1789FC]
                "
              >
                ✕
              </button>
            </header>

            {/* aqui empieza el contenido dentro del formulario*/}

            <div className="p-4">
              <p className="text-sm text-[#4B5563]">
                Proyecto ID: <span className="font-medium">{ProjectId ?? '—'}</span>
              </p>
              {/* Aquí va tu formulario / contenido del seguimiento */}
              <div className="mt-3 text-sm text-[#4B5563]">
                (Formulario de seguimiento pendiente…)
              </div>
            </div>



            {/* aqui termina el contenido dentro del formulario*/}

            <footer className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[#D9DBE9]">
              <button
                onClick={() => setOpen(false)}
                className="
                  inline-flex items-center justify-center
                  px-3 py-2
                  bg-transparent text-[#091540]
                  border border-[#091540]
                  rounded-none
                  hover:bg-[#091540] hover:text-white
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1789FC]
                  transition-colors
                "
              >
                Cancelar
              </button>
              <button
                className="
                  inline-flex items-center justify-center
                  px-4 py-2
                  bg-[#1789FC] text-white
                  border border-[#1789FC]
                  rounded-none
                  hover:bg-[#0F6FD0] hover:border-[#0F6FD0]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1789FC]
                  transition-colors
                "
              >
                Guardar
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProjectTraceModal;
