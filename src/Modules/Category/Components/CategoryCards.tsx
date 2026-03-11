import { useState } from "react";
import type { Category } from "../Models/Category";
import { Card, CardContent } from "@/Components/ui/card";
import { DataPagination } from "@/Components/ui/data-pagination";
import CategoryCard from "./CategoryCard";
import UpdateCategoryModal from "./UpdateCategoryModal";
import DeleteCategoryButton from "./DeleteCategoryModal";

type Props = {
  data: Category[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

type CategoryModalState = {
  mode: "edit" | "delete";
  category: Category;
} | null;

type CategoryActionHandler = (category: Category) => void;

export default function CategoryCards({
  data,
  total,
  page,
  pageCount,
  onPageChange,
}: Props) {
  const [activeModal, setActiveModal] = useState<CategoryModalState>(null);
  const handleEditCategory: CategoryActionHandler = (category) => {
    setActiveModal({ mode: "edit", category });
  };
  const handleDeleteCategory: CategoryActionHandler = (category) => {
    setActiveModal({ mode: "delete", category });
  };

  return (
    <section className="flex w-full flex-col gap-4">
      <UpdateCategoryModal
        category={activeModal?.category ?? null}
        open={activeModal?.mode === "edit"}
        onClose={() => setActiveModal(null)}
        onSuccess={() => setActiveModal(null)}
      />
      <DeleteCategoryButton
        categorySelected={activeModal?.category ?? null}
        open={activeModal?.mode === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            setActiveModal(null);
          }
        }}
        onSuccess={() => setActiveModal(null)}
      />

      {data.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-semibold text-slate-900">No hay categorías para mostrar</p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Ajusta los filtros o registra una nueva categoría para empezar a gestionar este módulo.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {data.map((category) => (
            <CategoryCard
              key={category.Id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>
      )}

      <Card className="border-none shadow-none">
        <CardContent className="pt-6">
          <DataPagination
            page={page}
            pageCount={pageCount}
            total={total ?? data.length}
            onPageChange={onPageChange}
            labels={{ totalItems: "categorías" }}
            compact
          />
        </CardContent>
      </Card>
    </section>
  );
}
