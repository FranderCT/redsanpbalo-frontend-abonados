type Props = {
  open: boolean;
  initialName: string;
  onClose: () => void;
  onApply: (name: string) => void; // el contenedor aplicará la búsqueda
};

export default function CategoryFilterModal({ open, initialName, onClose, onApply }: Props) {
  if (!open) return null;
  let tmp = initialName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[360px] bg-white rounded shadow-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-[#091540] mb-3">Filtros</h3>

        <label className="block text-sm mb-1 text-[#091540]">Nombre contiene</label>
        <input
          defaultValue={initialName}
          onChange={(e) => (tmp = e.target.value)}
          className="w-full h-10 px-3 border border-gray-300 bg-gray-50 outline-none"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="h-9 px-4 border border-gray-300 bg-white rounded hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={() => { onApply(tmp); onClose(); }}
            className="h-9 px-4 bg-[#091540] text-white rounded"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
