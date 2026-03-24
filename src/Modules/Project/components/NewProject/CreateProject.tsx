import { useState, useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Check, Plus, Trash2, FileText, Upload, Search, X } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { RichTextEditor } from "@/Components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { FieldError } from "@/Components/ui/field";
import { cn } from "@/lib/utils";

import { newProjectInitialState } from "../../Models/Project";
import { useCreateProject } from "../../Hooks/ProjectHooks";
import { useGetAllProjectStates } from "../../../Project_State/Hooks/ProjectStateHooks";
import type { NewProjectProjection } from "../../Project-projection/Models/ProjectProjection";
import { useCreateProjectProjection } from "../../Project-projection/Hooks/Project-ProjectionHooks";
import { type NewProductDetail } from "../../../Product-Detail/Models/ProductDetail";
import { useCreateProductDetail } from "../../../Product-Detail/Hooks/ProductDetailHooks";
import { StepSchemas } from "../../schemas/StepSchema";
import { useGetUsersByRoleAdmin } from "../../../Users/Hooks/UsersHooks";
import { ProductSelectionModal } from "./ProductSelectionModal";
import type { Product } from "../../../Products/Models/CreateProduct";
import { useGetAllProducts } from "../../../Products/Hooks/ProductsHooks";
import { uploadProjectFiles } from "../../../Upload-files/Services/ProjectFileServices";
import { useUploadProjectCoverImage } from "../../Hooks/ProjectHooks";
import ProjectCoverField from "../shared/ProjectCoverField";

type ProjectCreatePayload = typeof newProjectInitialState;

const STEPS = [
  { label: "Datos Básicos" },
  { label: "Detalles" },
  { label: "Proyección" },
  { label: "Documentos" },
  { label: "Confirmación" },
];

const toYMD = (d?: string | Date | null): string => {
  if (!d) return "";
  const dd = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dd.getTime())) return "";
  return dd.toISOString().split("T")[0];
};

// Extrae el primer mensaje de error de TanStack Form
const firstError = (errors: unknown[]) =>
  errors.length > 0
    ? [{ message: (errors[0] as any)?.message ?? String(errors[0]) }]
    : [];

// Garantiza que el valor del campo sea un array (evita .map is not a function)
const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export default function CreateProject() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const createProjectMutation = useCreateProject();
  const uploadProjectCoverMutation = useUploadProjectCoverImage();
  const createProjectProjectionMutation = useCreateProjectProjection();
  const createProductDetailMutation = useCreateProductDetail();

  const { userAdmin = [], isPending: userAdminLoading } = useGetUsersByRoleAdmin();
  const { projectStates = [], projectStatesLoading } = useGetAllProjectStates();
  const { products, isPending: productsLoading, error: productsError } = useGetAllProducts();

  const [productInput, setProductInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [tempProductId, setTempProductId] = useState<number>(0);
  const [tempQty, setTempQty] = useState<number>(0);

  const filteredProducts = useMemo(() => {
    const s = productInput.trim().toLowerCase();
    if (!s) return products ?? [];
    return (products ?? []).filter((p) => p.Name.toLowerCase().includes(s));
  }, [products, productInput]);

  const getProductName = (id?: number) =>
    products?.find((p) => p.Id === id)?.Name ?? "";

  const handleProductSelection = (product: Product) => {
    setProductInput(product.Name);
    setTempProductId(product.Id);
    setShowProductModal(false);
  };

  const handleNext = () => {
    const schema = StepSchemas[step];
    if (schema instanceof z.ZodAny) {
      setStep(step + 1);
      return;
    }
    const res = schema.safeParse(form.state.values);
    if (!res.success) {
      res.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (path) form.setFieldMeta(path as any, (m: any) => ({ ...m, isTouched: true }));
      });
      toast.error(res.error.issues[0].message || "Completa los campos requeridos");
      return;
    }
    setStep(step + 1);
  };

  const form = useForm({
    defaultValues: {
      ...newProjectInitialState,
      Observation: "",
      projection: { Observation: "" },
      productDetails: [] as Array<Pick<NewProductDetail, "ProductId" | "Quantity">>,
      subfolder: "",
      files: [] as File[],
      coverImage: null as File | null,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const projectPayload: ProjectCreatePayload = {
          Name: value.Name,
          Location: value.Location,
          InnitialDate: value.InnitialDate,
          EndDate: value.EndDate,
          Objective: value.Objective,
          Description: value.Description,
          Observation: value.Observation,
          ProjectStateId: value.ProjectStateId,
          UserId: value.UserId,
        };

        const projectRes = await createProjectMutation.mutateAsync(projectPayload);
        const projectId =
          (projectRes as any)?.Id ??
          (projectRes as any)?.id ??
          (projectRes as any)?.data?.Id ??
          (projectRes as any)?.data?.id;

        if (!projectId) throw new Error("No se obtuvo el Id del proyecto creado.");

        const projectionPayload: NewProjectProjection = {
          ProjectId: Number(projectId),
          Observation: value.projection?.Observation ?? "",
        };

        const projectionRes =
          await createProjectProjectionMutation.mutateAsync(projectionPayload);
        const projectProjectionId =
          (projectionRes as any)?.Id ??
          (projectionRes as any)?.id ??
          (projectionRes as any)?.data?.Id ??
          (projectionRes as any)?.data?.id;

        if (!projectProjectionId)
          throw new Error("No se obtuvo el Id de la proyección creada.");

        if (value.coverImage) {
          await uploadProjectCoverMutation.mutateAsync({
            id: Number(projectId),
            file: value.coverImage,
          });
        }

        const details = value.productDetails ?? [];
        if (details.length > 0) {
          await Promise.all(
            details
              .filter((d) => (d.ProductId ?? 0) > 0 && (d.Quantity ?? 0) > 0)
              .map((d) =>
                createProductDetailMutation.mutateAsync({
                  Quantity: Number(d.Quantity),
                  ProductId: Number(d.ProductId),
                  ProjectProjectionId: Number(projectProjectionId),
                } satisfies NewProductDetail),
              ),
          );
        }

        if (value.files && value.files.length > 0) {
          await uploadProjectFiles(
            projectId,
            value.files,
            value.subfolder || "Complementarios",
          );
          toast.success(`${value.files.length} archivo(s) subido(s) exitosamente`);
        }

        formApi.reset();
        toast.success("¡Proyecto creado exitosamente!");
        navigate({ to: "/dashboard/projects" });
        setStep(0);
        setTempProductId(0);
        setTempQty(0);
      } catch (err) {
        console.error("Error al crear proyecto", err);
      }
    },
  });

  // ── Contenido de cada paso ─────────────────────────────────────────────────

  const renderStepContent = () => {
    switch (step) {
      // ── Paso 0: Datos básicos ──────────────────────────────────────────────
      case 0:
        return (
          <div className="flex flex-col gap-5">
            <form.Field name="Name">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="Name">Nombre del proyecto</Label>
                  <Input
                    id="Name"
                    placeholder="Ej. Instalación de nuevas tuberías…"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && (
                    <FieldError errors={firstError(field.state.meta.errors)} />
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="Location">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="Location">Dirección</Label>
                  <Textarea
                    id="Location"
                    placeholder="Ej. 200m este de la plaza…"
                    rows={3}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && (
                    <FieldError errors={firstError(field.state.meta.errors)} />
                  )}
                </div>
                )}
              </form.Field>

            <form.Field name="coverImage">
              {(field) => (
                <ProjectCoverField
                  file={field.state.value}
                  onFileChange={field.handleChange}
                />
              )}
            </form.Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <form.Field name="InnitialDate">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="InnitialDate">Fecha de inicio</Label>
                    <Input
                      id="InnitialDate"
                      type="date"
                      value={toYMD(field.state.value as any)}
                      onChange={(e) => {
                        const selected = new Date(e.target.value);
                        field.handleChange(selected);
                        const current = form.state.values.EndDate;
                        if (!current || new Date(current) <= selected) {
                          form.setFieldValue("EndDate", selected);
                        }
                        form.setFieldMeta("EndDate", (prev: any) => ({
                          ...prev,
                          errors: [],
                        }));
                      }}
                    />
                    {field.state.meta.isTouched && (
                      <FieldError errors={firstError(field.state.meta.errors)} />
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="EndDate">
                {(field) => {
                  const minEnd = toYMD(form.state.values.InnitialDate as any);
                  return (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="EndDate">Fecha de fin</Label>
                      <Input
                        id="EndDate"
                        type="date"
                        min={minEnd}
                        value={toYMD(field.state.value as any)}
                        onChange={(e) => {
                          const selected = new Date(e.target.value);
                          const start = form.state.values.InnitialDate;
                          if (start && selected < new Date(start)) {
                            field.setMeta((prev: any) => ({
                              ...prev,
                              errors: [
                                "La fecha de fin no puede ser anterior a la de inicio",
                              ],
                              isTouched: true,
                            }));
                            return;
                          }
                          field.setMeta((prev: any) => ({
                            ...prev,
                            errors: [],
                            isTouched: true,
                          }));
                          field.handleChange(selected);
                        }}
                      />
                      {field.state.meta.isTouched && (
                        <FieldError errors={firstError(field.state.meta.errors)} />
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>
          </div>
        );

      // ── Paso 1: Detalles ───────────────────────────────────────────────────
      case 1:
        return (
          <div className="flex flex-col gap-5">
            <form.Field name="Objective">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Objetivo del proyecto</Label>
                  <RichTextEditor
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder="Objetivo principal del proyecto…"
                    minHeight="7rem"
                  />
                  {field.state.meta.isTouched && (
                    <FieldError errors={firstError(field.state.meta.errors)} />
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="Description">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Descripción</Label>
                  <RichTextEditor
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder="Descripción detallada del proyecto…"
                    minHeight="9rem"
                  />
                  {field.state.meta.isTouched && (
                    <FieldError errors={firstError(field.state.meta.errors)} />
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="Observation">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label>
                    Observaciones{" "}
                    <span className="text-muted-foreground font-normal">(opcional)</span>
                  </Label>
                  <RichTextEditor
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder="Observaciones adicionales…"
                    minHeight="6rem"
                  />
                  {field.state.meta.isTouched && (
                    <FieldError errors={firstError(field.state.meta.errors)} />
                  )}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <form.Field name="ProjectStateId">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label>Estado del proyecto</Label>
                    <Select
                      value={field.state.value ? String(field.state.value) : ""}
                      onValueChange={(v) => field.handleChange(Number(v))}
                      disabled={projectStatesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            projectStatesLoading ? "Cargando…" : "Seleccione estado"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStates.map((s) => (
                          <SelectItem key={s.Id} value={String(s.Id)}>
                            {s.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.isTouched && (
                      <FieldError errors={firstError(field.state.meta.errors)} />
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="UserId">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label>Encargado</Label>
                    <Select
                      value={field.state.value ? String(field.state.value) : ""}
                      onValueChange={(v) => field.handleChange(Number(v))}
                      disabled={userAdminLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            userAdminLoading
                              ? "Cargando…"
                              : "Seleccione encargado"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {userAdmin.map((u) => (
                          <SelectItem key={u.Id} value={String(u.Id)}>
                            {u.Name} {u.Surname1} {u.Surname2}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.isTouched && (
                      <FieldError errors={firstError(field.state.meta.errors)} />
                    )}
                  </div>
                )}
              </form.Field>
            </div>
          </div>
        );

      // ── Paso 2: Proyección + productos ────────────────────────────────────
      case 2:
        return (
          <div className="flex flex-col gap-6">
            <form.Field name="projection.Observation">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label>
                    Observación de la proyección{" "}
                    <span className="text-muted-foreground font-normal">(opcional)</span>
                  </Label>
                  <RichTextEditor
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder="Notas para la proyección del proyecto…"
                    minHeight="6rem"
                  />
                  {field.state.meta.isTouched && (
                    <FieldError errors={firstError(field.state.meta.errors)} />
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="productDetails">
              {(field) => (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Productos de la proyección
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {/* Selector de producto */}
                    <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-12">
                      <div className="flex flex-col gap-1.5 md:col-span-7">
                        <Label>Producto</Label>
                        <div className="relative">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Escribe para buscar o usa 'Ver Lista'…"
                              value={productInput}
                              onChange={(e) => {
                                setProductInput(e.target.value);
                                setShowSuggestions(true);
                                setTempProductId(0);
                              }}
                              onFocus={() => setShowSuggestions(true)}
                              onBlur={() =>
                                setTimeout(() => setShowSuggestions(false), 120)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Escape") setShowSuggestions(false);
                                else if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                                  e.preventDefault();
                                  setShowProductModal(true);
                                }
                              }}
                              disabled={productsLoading || !!productsError}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                              onClick={() => setShowProductModal(true)}
                              disabled={productsLoading || !!productsError}
                              title="Buscar en lista completa (Ctrl+K)"
                            >
                              <Search className="mr-1 size-4" />
                              Ver Lista
                            </Button>
                          </div>

                          {/* Sugerencias inline */}
                          {showSuggestions && filteredProducts.length > 0 && (
                            <ul className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-md border bg-popover shadow-md">
                              {filteredProducts.slice(0, 8).map((p) => (
                                <li
                                  key={p.Id}
                                  className="cursor-pointer px-3 py-2 text-sm hover:bg-accent"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setProductInput(p.Name);
                                    setTempProductId(p.Id);
                                    setShowSuggestions(false);
                                  }}
                                >
                                  {p.Name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {productsError && (
                          <p className="text-xs text-destructive">
                            No se pudieron cargar los productos.
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 md:col-span-3">
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          min={0}
                          value={tempQty}
                          onChange={(e) => setTempQty(Number(e.target.value))}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Button
                          type="button"
                          className="w-full"
                          disabled={!tempProductId || tempQty <= 0}
                          onClick={() => {
                            const current = asArray<any>(field.state.value);
                            const idx = current.findIndex(
                              (d: any) => d.ProductId === tempProductId,
                            );
                            let next = [...current];
                            if (idx >= 0) {
                              next[idx] = {
                                ...next[idx],
                                Quantity:
                                  Number(next[idx].Quantity ?? 0) + Number(tempQty),
                              };
                            } else {
                              next.push({ ProductId: tempProductId, Quantity: tempQty });
                            }
                            field.handleChange(next);
                            setTempProductId(0);
                            setTempQty(0);
                            setProductInput("");
                          }}
                        >
                          <Plus className="mr-1 size-4" />
                          Agregar
                        </Button>
                      </div>
                    </div>

                    {/* Lista de productos agregados */}
                    {asArray(field.state.value).length > 0 ? (
                      <ul className="divide-y rounded-md border">
                        {asArray<any>(field.state.value).map((d, i) => (
                          <li
                            key={`${d.ProductId}-${i}`}
                            className="flex items-center justify-between gap-3 px-3 py-2.5"
                          >
                            <span className="flex-1 text-sm font-medium">
                              {getProductName(d.ProductId)}
                            </span>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min={0}
                                className="h-8 w-24 text-sm"
                                value={d.Quantity ?? 0}
                                onChange={(e) => {
                                  const next = [...asArray<any>(field.state.value)];
                                  next[i] = {
                                    ...next[i],
                                    Quantity: Number(e.target.value),
                                  };
                                  field.handleChange(next);
                                }}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  field.handleChange(
                                    asArray<any>(field.state.value).filter(
                                      (_: any, idx: number) => idx !== i,
                                    ),
                                  )
                                }
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        No hay productos agregados.
                      </p>
                    )}

                    {field.state.meta.isTouched && (
                      <FieldError errors={firstError(field.state.meta.errors)} />
                    )}
                  </CardContent>
                </Card>
              )}
            </form.Field>
          </div>
        );

      // ── Paso 3: Documentos ─────────────────────────────────────────────────
      case 3:
        return (
          <div className="flex flex-col gap-6">
            <form.Field name="files">
              {(field) => (
                <div className="flex flex-col gap-4">
                  {/* Zona drag & drop */}
                  <div
                    className={cn(
                      "rounded-xl border-2 border-dashed p-12 text-center transition-colors",
                      "border-border hover:border-primary/40 hover:bg-accent/20",
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = Array.from(e.dataTransfer.files);
                      field.handleChange([...(field.state.value || []), ...files]);
                    }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Arrastra archivos aquí o{" "}
                          <label className="cursor-pointer text-primary underline underline-offset-2 hover:text-primary/80">
                            selecciona archivos
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.zip,.rar"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                field.handleChange([
                                  ...(field.state.value || []),
                                  ...files,
                                ]);
                              }}
                            />
                          </label>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          PDF, DOC, DOCX, XLS, XLSX, imágenes · Máx. 10 MB por archivo
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de archivos */}
                  {asArray(field.state.value).length > 0 && (
                    <div className="rounded-xl border bg-muted/30 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          {asArray(field.state.value).length} archivo(s) seleccionado(s)
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-destructive hover:text-destructive"
                          onClick={() => field.handleChange([])}
                        >
                          Limpiar todo
                        </Button>
                      </div>

                      <div className="grid max-h-64 gap-2 overflow-y-auto">
                        {asArray<File>(field.state.value).map((file, idx) => (
                          <div
                            key={`${file.name}-${idx}`}
                            className="flex items-center gap-3 rounded-lg border bg-background p-3"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                field.handleChange(
                                  asArray<File>(field.state.value).filter(
                                    (_, i) => i !== idx,
                                  ),
                                )
                              }
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        );

      // ── Paso 4: Confirmación ───────────────────────────────────────────────
      case 4:
        return (
          <form.Subscribe selector={(s) => s.values}>
            {(values) => (
              <div className="flex flex-col gap-4">

                {/* ── Datos básicos ── */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Datos básicos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm md:grid-cols-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">Nombre</span>
                      <span className="text-muted-foreground">{values.Name || "—"}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">Estado</span>
                      <span className="text-muted-foreground">
                        {projectStates.find((s) => s.Id === values.ProjectStateId)?.Name ?? "—"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">Fecha inicio</span>
                      <span className="text-muted-foreground">
                        {values.InnitialDate
                          ? new Date(values.InnitialDate).toLocaleDateString("es-CR")
                          : "—"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">Fecha fin</span>
                      <span className="text-muted-foreground">
                        {values.EndDate
                          ? new Date(values.EndDate).toLocaleDateString("es-CR")
                          : "—"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 md:col-span-2">
                      <span className="font-medium">Encargado</span>
                      <span className="text-muted-foreground">
                        {(() => {
                          const u = userAdmin.find((u) => u.Id === values.UserId);
                          return u ? `${u.Name} ${u.Surname1} ${u.Surname2}` : "—";
                        })()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 md:col-span-2">
                      <span className="font-medium">Ubicación</span>
                      <span className="text-muted-foreground whitespace-pre-wrap">
                        {values.Location || "—"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* ── Objetivo ── */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Objetivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: values.Objective ?? "" }}
                    />
                  </CardContent>
                </Card>

                {/* ── Descripción ── */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Descripción
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: values.Description ?? "" }}
                    />
                  </CardContent>
                </Card>

                {/* ── Observaciones (opcional) ── */}
                {values.Observation && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Observaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: values.Observation }}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* ── Observación de proyección (opcional) ── */}
                {values.projection?.Observation && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Observación de proyección
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: values.projection.Observation }}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* ── Productos ── */}
                {asArray(values.productDetails).length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Productos ({asArray(values.productDetails).length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="divide-y text-sm">
                        {asArray<any>(values.productDetails).map((d, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between py-1.5"
                          >
                            <span>{getProductName(d.ProductId)}</span>
                            <Badge variant="secondary">×{d.Quantity}</Badge>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* ── Documentos ── */}
                {values.coverImage && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Portada
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="size-3.5 shrink-0" />
                        {values.coverImage.name} - {(values.coverImage.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </CardContent>
                  </Card>
                )}

                {asArray(values.files).length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Documentos ({asArray(values.files).length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {asArray<File>(values.files).map((f, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-muted-foreground"
                          >
                            <FileText className="size-3.5 shrink-0" />
                            {f.name} — {(f.size / 1024 / 1024).toFixed(2)} MB
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </form.Subscribe>
        );

      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full max-w-3xl p-8">
      <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
        Crear Nuevo Proyecto
      </h2>

      {/* ── Stepper ── */}
      <div className="mb-8 flex items-center justify-center">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200",
                  i < step && "bg-primary/80 text-primary-foreground",
                  i === step &&
                    "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  i > step && "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "mt-2 max-w-[4.5rem] text-center text-xs font-medium leading-tight",
                  i === step && "text-primary",
                  i < step && "text-primary/70",
                  i > step && "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 mb-5 h-0.5 w-10 transition-colors duration-200",
                  i < step ? "bg-primary/60" : "bg-border",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <Separator className="mb-6" />

      {/* ── Formulario ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < STEPS.length - 1) handleNext();
          else form.handleSubmit();
        }}
        className="flex flex-col gap-6"
      >
        {renderStepContent()}

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="flex justify-between pt-2">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Atrás
                </Button>
              ) : (
                <div />
              )}
              <Button
                type="submit"
                disabled={
                  step === STEPS.length - 1 ? !canSubmit || !!isSubmitting : false
                }
              >
                {step === STEPS.length - 1
                  ? isSubmitting
                    ? "Creando…"
                    : "Crear Proyecto"
                  : "Siguiente"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>

      {/* Modal de selección de productos */}
      <ProductSelectionModal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        products={products ?? []}
        onSelectProduct={handleProductSelection}
        isLoading={productsLoading}
        selectedProductIds={
          asArray<any>(form.state.values.productDetails).map((d) => d.ProductId ?? 0)
        }
      />
    </div>
  );
}
