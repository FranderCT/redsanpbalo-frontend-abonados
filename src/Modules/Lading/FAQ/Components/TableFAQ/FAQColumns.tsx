import type { ColumnDef } from "@tanstack/react-table";
import { Edit2 } from "lucide-react";
import type { FAQ } from "../../Models/FAQ";
import DeleteFAQButton from "../ModalsFAQ/DeleteFAQModal";

export const FAQColumns = (
  onEdit: (faq: FAQ) => void,
): ColumnDef<FAQ>[] => [
  { 
    accessorKey: "Question", 
    header: "Pregunta",
    cell: ({ row }) => (
      <div className="max-w-md">
        {row.original.Question}
      </div>
    )
  },
  { 
    accessorKey: "Answer", 
    header: "Respuesta",
    cell: ({ row }) => (
      <div className="max-w-lg text-sm text-gray-600">
        {row.original.Answer}
      </div>
    )
  },
  { 
    accessorKey: "IsActive", 
    header: "Estado",  
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        row.original.IsActive 
          ? "bg-green-100 text-green-800" 
          : "bg-red-100 text-red-800"
      }`}>
        {row.original.IsActive ? "Activo" : "Inactivo"}
      </span>
    ),
  },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const faq = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(faq)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
              text-[#1789FC] border-[#1789FC]
              hover:bg-[#1789FC] hover:text-white transition"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          <DeleteFAQButton faqSelected={faq} />
        </div>
      );
    },
  },
];
