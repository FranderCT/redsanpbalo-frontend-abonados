import { BrushCleaning } from 'lucide-react';

type Props = {
    limit: number;
    total: number;
    read?: string;
    onLimitChange: (n: number) => void;
    onFilterClick: (text: string) => void;
    onCleanFilters: () => void, // <- aplica al escribir (el container decide)
};

export default function CommentHeaderBar({
    limit,
    read,
    onLimitChange,
    onFilterClick,
    onCleanFilters,
}: Props) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Filas por página */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-[#091540]">Filas por página:</span>
                <select
                className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                >
                {[5,10, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>{n}</option>
                ))}
                </select>
            </div>

            {/* Filtrar */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-[#091540]">Estado:</span>
                <select
                className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
                value={read}
                onChange={(e) => onFilterClick(e.target.value || "")}
                >
                <option value="">Todos</option>
                <option value="1">Leídos</option>
                <option value="0">Sin ver</option>
                </select>
            </div>

            
            <div className="inline-flex items-center gap-2">        
                <button
                    onClick={onCleanFilters}
                    className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm hover:bg-gray-50 shrink-0"
                    type="button"
                    title="Limpiar filtros"
                >
                    <BrushCleaning className="size-[23px]" />
                </button>
            </div>
        </div>
    );
}
