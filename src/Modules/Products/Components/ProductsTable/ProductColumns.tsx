import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { createColumnHelper, type Column } from "@tanstack/react-table";
import { Badge } from "@/Components/ui/badge";
import type { Product } from "../../Models/CreateProduct";
import { getProductSupplierNames } from "../../Models/CreateProduct";
import ProductRowActions from "../ProductRowActions";

const columnHelper = createColumnHelper<Product>();

function SortableHeader({
  label,
  column,
  className = "",
}: {
  label: string;
  column: Column<Product, unknown>;
  className?: string;
}) {
  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting()}
      className={`flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : sorted === "desc" ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
      )}
    </button>
  );
}

export const ProductColumns = (
  onEdit: (product: Product) => void,
  onView: (product: Product) => void,
  onDelete: (product: Product) => void
) => [
  columnHelper.accessor("Name", {
    header: ({ column }) => <SortableHeader label="Producto" column={column} />,
    cell: ({ row, getValue }) => (
      <div className="flex min-w-[180px] flex-col gap-1">
        <span className="font-medium text-foreground">{getValue()}</span>
        <span className="text-xs text-muted-foreground">{row.original.Type}</span>
      </div>
    ),
    meta: {
      headerClassName: "min-w-[220px]",
      cellClassName: "min-w-[220px]",
    },
  }),
  columnHelper.accessor("Category.Name", {
    id: "category",
    header: ({ column }) => <SortableHeader label="Categoría" column={column} />,
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{getValue() || "—"}</span>
    ),
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
    },
  }),
  columnHelper.accessor("Material.Name", {
    id: "material",
    header: ({ column }) => <SortableHeader label="Material" column={column} />,
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{getValue() || "—"}</span>
    ),
    meta: {
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
    },
  }),
  columnHelper.accessor("UnitMeasure.Name", {
    id: "unit",
    header: ({ column }) => <SortableHeader label="Unidad" column={column} />,
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{getValue() || "—"}</span>
    ),
    meta: {
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
    },
  }),
  columnHelper.accessor((row) => getProductSupplierNames(row).join(", "), {
    id: "suppliers",
    header: "Proveedores",
    cell: ({ row }) => {
      const names = getProductSupplierNames(row.original);

      return (
        <div className="flex min-w-[220px] flex-wrap gap-1.5">
          {names.length > 0 ? names.slice(0, 2).map((name) => (
            <Badge key={name} variant="outline" className="max-w-[170px] truncate">
              {name}
            </Badge>
          )) : (
            <span className="text-sm text-muted-foreground">Sin proveedores</span>
          )}
          {names.length > 2 ? <Badge variant="secondary">+{names.length - 2}</Badge> : null}
        </div>
      );
    },
    enableSorting: false,
    meta: {
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
    },
  }),
  columnHelper.accessor("IsActive", {
    id: "status",
    header: ({ column }) => <SortableHeader label="Estado" column={column} />,
    cell: ({ getValue }) => (
      <Badge variant={getValue() ? "default" : "destructive"}>
        {getValue() ? "Activo" : "Inactivo"}
      </Badge>
    ),
    meta: {
      headerClassName: "min-w-[110px]",
      cellClassName: "min-w-[110px]",
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <ProductRowActions
        product={row.original}
        mode="menu"
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
      />
    ),
    meta: {
      headerClassName: "w-[72px]",
      cellClassName: "w-[72px]",
    },
  }),
];
