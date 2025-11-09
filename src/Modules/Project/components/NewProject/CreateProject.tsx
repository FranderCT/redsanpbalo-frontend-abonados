import { useState, useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { newProjectInitialState } from "../../Models/Project";
import { useCreateProject } from "../../Hooks/ProjectHooks";
import { useGetAllProjectStates } from "../../../Project_State/Hooks/ProjectStateHooks";
import { toast } from "react-toastify";
import type { NewProjectProjection } from "../../Project-projection/Models/ProjectProjection";
import { useCreateProjectProjection } from "../../Project-projection/Hooks/Project-ProjectionHooks";
import {  type NewProductDetail } from "../../../Product-Detail/Models/ProductDetail";
import { useGetAllProducts } from "../../../Products/Hooks/ProductsHooks";
import { useCreateProductDetail } from "../../../Product-Detail/Hooks/ProductDetailHooks";
import { StepSchemas } from "../../schemas/StepSchema";
import z from "zod";
import { useGetUsersByRoleAdmin } from "../../../Users/Hooks/UsersHooks";
import { ProductSelectionModal } from "./ProductSelectionModal";
import type { Product } from "../../../Products/Models/CreateProduct";
import { useNavigate } from "@tanstack/react-router";
import { uploadProjectFiles } from "../../../Upload-files/Services/ProjectFileServices";
import { ProjectSchema } from "../../schemas/ProjectSchema";



const steps = [
  { label: "Datos Básicos" },
  { label: "Detalles" },
  { label: "Proyección" },
  { label: "Documentos" },
  { label: "Confirmación" },
];

type ProjectCreatePayload = typeof newProjectInitialState;

const CreateProject = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  // Helper: format a Date|string into yyyy-mm-dd for <input type="date"> without timezone shifts
  const formatDateForInput = (d?: Date | string | null) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    // Use local date components to avoid toISOString timezone shift
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const parseDateFromInput = (value: string) => {
    if (!value) return null;
    const [y, m, d] = value.split("-").map((s) => Number(s));
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const createProjectMutation = useCreateProject();
  const createProjectProjectionMutation = useCreateProjectProjection();
  const createProductDetailMutation = useCreateProductDetail();
  const { userAdmin = [], isPending: UserAdminIsLoading} = useGetUsersByRoleAdmin();

  const { projectStates, projectStatesLoading } = useGetAllProjectStates();
  const { products, isPending: productsLoading, error: productsError } = useGetAllProducts();

  // Estado local para múltiples documentos


  // UI local para el picker de detalles
  // 👇 NUEVO: autocomplete
    const [productInput, setProductInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);

    // cantidad y selección actual
    const [tempProductId, setTempProductId] = useState<number>(0);
    const [tempQty, setTempQty] = useState<number>(0);

    // filtra cuando se escribe escribe
    const filteredProducts = useMemo(() => {
      const s = productInput.trim().toLowerCase();
      if (!s) return products ?? [];
      return (products ?? []).filter(p => p.Name.toLowerCase().includes(s));
    }, [products, productInput]);

    const getProductName = (id?: number) =>
      products?.find(p => p.Id === id)?.Name ?? "";

    // Función para manejar la selección de producto desde el modal
    const handleProductSelection = (product: Product) => {
      setProductInput(product.Name);
      setTempProductId(product.Id);
      setShowProductModal(false);
      // Enfocar el campo de cantidad después de seleccionar
      setTimeout(() => {
        const qtyInput = document.querySelector('input[type="number"]') as HTMLInputElement;
        if (qtyInput) qtyInput.focus();
      }, 100);
    };
  
  //Funcion para validar que se cumplan los campos requeridos para poder pasar al siguiente
  const handleNext = () => {
    const schema = StepSchemas[step];
    // Paso sin validación extra (confirmación)
    if (schema instanceof z.ZodAny) {
      setStep(step + 1);
      return;
    }

    const res = schema.safeParse(form.state.values);
    if (!res.success) {
      // Marca como "touched" los campos con error del paso, para que se muestren mensajes
      res.error.issues.forEach((iss) => {
        const path = iss.path.join("."); // ej: "projection.Observation"
        if (path) {
          form.setFieldMeta(path as any, (m: any) => ({ ...m, isTouched: true }));
        }
      });
      toast.error("Completa los campos requeridos");
      return;
    }

    //válido → avanza
    setStep(step + 1);
  };

  const form = useForm({
    validators:{
      // ProjectSchema is a Zod schema — cast to any to satisfy the form validator type
      onChange: ProjectSchema as any,
    },
    defaultValues: {
      ...newProjectInitialState,
      Observation: "",
      projection: {
        Observation: "",
      },
      productDetails: [] as Array<Pick<NewProductDetail, "ProductId" | "Quantity">>,
      subfolder: "",
      files: [] as File[],
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        console.debug('[CreateProject] useForm.onSubmit called', { value });
        // Final validation: asegurarse que EndDate >= InnitialDate antes de enviar
        if (value.InnitialDate && value.EndDate) {
          const start = value.InnitialDate instanceof Date ? value.InnitialDate : new Date(value.InnitialDate);
          const end = value.EndDate instanceof Date ? value.EndDate : new Date(value.EndDate);
          if (end < start) {
            toast.error('La fecha de fin no puede ser anterior a la fecha de inicio.', { position: 'top-right', autoClose: 3000 });
            return;
          }
        }
        // 1) Proyecto
        const projectPayload: ProjectCreatePayload = {
          Name: value.Name,
          Location: value.Location,
          InnitialDate: value.InnitialDate,
          EndDate: value.EndDate,
          Objective: value.Objective,
          Description: value.Description,
          Observation: value.Observation, // Observation del PROYECTO
          ProjectStateId: value.ProjectStateId,
          UserId : value.UserId
        };

        const projectRes = await createProjectMutation.mutateAsync(projectPayload);
        const projectId =
          (projectRes as any)?.Id ??
          (projectRes as any)?.id ??
          (projectRes as any)?.data?.Id ??
          (projectRes as any)?.data?.id;

        if (!projectId) throw new Error("No se obtuvo el Id del proyecto creado.");

        // 2) Proyección
        const projectionPayload: NewProjectProjection = {
          ProjectId: Number(projectId),
          Observation: value.projection?.Observation ?? "", // Observation de la PROYECCIÓN
        };

        const projectionRes = await createProjectProjectionMutation.mutateAsync(projectionPayload);
        const projectProjectionId =
          (projectionRes as any)?.Id ??
          (projectionRes as any)?.id ??
          (projectionRes as any)?.data?.Id ??
          (projectionRes as any)?.data?.id;

        if (!projectProjectionId) throw new Error("No se obtuvo el Id de la proyección creada.");

        // 3) Detalles de producto (ARREGLO)
        const details = value.productDetails ?? [];
        if (details.length > 0) {
          await Promise.all(
            details
              .filter(d => (d.ProductId ?? 0) > 0 && (d.Quantity ?? 0) > 0)
              .map(d =>
                createProductDetailMutation.mutateAsync({
                  Quantity: Number(d.Quantity),
                  ProductId: Number(d.ProductId),
                  ProjectProjectionId: Number(projectProjectionId),
                } satisfies NewProductDetail)
              )
          );
        }

        // 4) Subir archivos si existen
        if (value.files && value.files.length > 0) {
          await uploadProjectFiles(projectId, value.files, value.subfolder || 'Complementarios');
          toast.success(`${value.files.length} archivo(s) subido(s) exitosamente`, { position: "top-right", autoClose: 2000 });
        }

        // 5) Éxito
        formApi.reset();
        toast.success("¡Proyecto, proyección y detalles creados!", { position: "top-right", autoClose: 3000 });
        navigate({ to: "/dashboard/projects" });
        setStep(0);
        setTempProductId(0);
        setTempQty(0);

        
      } catch (err) {
        console.error("Error al crear proyecto/proyección/detalles", err);
        toast.error("¡Error al crear el proyecto, su proyección o los detalles!", { position: "top-right", autoClose: 3000 });
        console.log(value.UserId)
        console.log(value.Name)
      }
    },
  });

  const renderStepFields = () => {
    switch (step) {
      // Paso 0: Básicos
      case 0:
        return (
          <div className="flex flex-col gap-6" key="step-0">
            <form.Field name="Name">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Nombre del proyecto</span>
                  <input
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                    placeholder="Ej. Instalación de nuevas tuberías…"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            <form.Field name="Location">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Dirección</span>
                  <textarea
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Ej. 200m este de la plaza…"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    required
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field name="InnitialDate">
                {(field) => (
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#091540]">Fecha de inicio</span>
                    <input
                      type="date"
                      className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                      name="InnitialDate"
                      value={formatDateForInput(field.state.value)}
                      onChange={(e) => {
                        const selectedStartDate = parseDateFromInput(e.target.value);
                        if (!selectedStartDate) return;
                        field.handleChange(selectedStartDate as any);

                        // SIEMPRE actualizar la fecha de fin cuando cambie la fecha de inicio
                        const currentEndDate = form.state.values.EndDate;

                        if (currentEndDate) {
                          const endDate = currentEndDate instanceof Date ? currentEndDate : new Date(currentEndDate);
                          // Si la fecha de fin es menor, actualizar a la fecha de inicio
                          if (endDate < selectedStartDate) {
                            form.setFieldValue('EndDate', selectedStartDate as any);
                          }
                        } else {
                          // Si no hay fecha de fin, establecer la fecha de inicio como fecha de fin
                          form.setFieldValue('EndDate', selectedStartDate as any);
                        }
                      }}
                      required
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                    )}
                  </label>
                )}
              </form.Field>

              <form.Field name="EndDate">
                {(field) => {
                  // Obtener la fecha de inicio para validación (se actualiza automáticamente)
                  const startDate = form.state.values.InnitialDate;
                  const minEndDate = startDate ? formatDateForInput(startDate) : "";
                  
                  return (
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-[#091540]">Fecha de fin</span>
                      <input
                        type="date"
                        className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                        name="EndDate"
                        value={formatDateForInput(field.state.value)}
                        min={minEndDate} // Se actualiza automáticamente cuando cambia startDate
                        onChange={(e) => {
                          const selectedDate = parseDateFromInput(e.target.value);

                          if (!selectedDate) return;

                          // Validación continua cada vez que se selecciona una fecha
                          if (startDate && selectedDate < (startDate instanceof Date ? startDate : new Date(startDate))) {
                            // Mostrar error si la fecha es menor
                            field.setMeta((prev: any) => ({
                              ...prev,
                              errors: ["La fecha de fin no puede ser anterior a la fecha de inicio"],
                              isTouched: true
                            }));
                            // No actualizar el valor si es inválido
                            return;
                          }

                          // Limpiar errores y actualizar valor si la fecha es válida
                          field.setMeta((prev: any) => ({
                            ...prev,
                            errors: [],
                            isTouched: true
                          }));
                          field.handleChange(selectedDate as any);
                        }}
                        onFocus={() => {
                          // Al hacer focus, asegurar que el min se actualice
                          const input = document.querySelector('input[name="EndDate"]') as HTMLInputElement;
                          if (input && minEndDate) {
                            input.setAttribute('min', minEndDate);
                          }
                        }}
                        required
                      />
                      {startDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Fecha mínima permitida: {new Date(startDate).toLocaleDateString('es-ES', {
                            weekday: 'short',
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </label>
                  );
                }}
              </form.Field>
            </div>
          </div>
        );

      // Paso 1: Detalles de Proyecto
      case 1:
        return (
          <div className="flex flex-col gap-6" key="step-1">
            <form.Field name="Objective">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Objetivo del proyecto</span>
                  <textarea
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Objetivo"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    required
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            <form.Field name="Description">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Descripción</span>
                  <textarea
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Descripción del proyecto"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    required
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            <form.Field name="Observation">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Observaciones del proyecto</span>
                  <textarea
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Observaciones del proyecto (opcional)"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            <form.Field name="ProjectStateId">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-[#091540]">Estado del Proyecto</span>
                  <select
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    disabled={projectStatesLoading}
                  >
                    <option value={0} disabled>
                      {projectStatesLoading ? "Cargando estados…" : "Seleccione estado"}
                    </option>
                    {projectStates.map((s) => (
                      <option key={s.Id} value={s.Id}>
                        {s.Name}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            <form.Field name="UserId">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm font-medium text-[#091540]">Encargado del Proyecto</span>
                <select
                  className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition rounded"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  disabled={UserAdminIsLoading}
                >
                  <option value="" disabled>
                    {UserAdminIsLoading
                      ? "Cargando administradores..."
                      : "Seleccione encargado del proyecto"}
                  </option>

                  {userAdmin.map((u) => (
                    <option key={u.Id} value={u.Id}>
                      {u.Name} {u.Surname1} {u.Surname2}
                    </option>
                  ))}
                </select>

                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          </div>
        );

      // Paso 2: Proyección + Cajita de detalles
      case 2:
        return (
          <div className="flex flex-col gap-6" key="step-2">
              {/* Observación de la PROYECCIÓN */}
              <form.Field name="projection.Observation">
                {(field) => (
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#091540]">Observación de la proyección</span>
                    <textarea
                      className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                      placeholder="Notas u observaciones para la proyección del proyecto"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={3}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                    )}
                  </label>
                )}
              </form.Field>

              {/* Cajita bonita para manejar ARREGLO de detalles */}
              <form.Field name="productDetails">
                {(field) => (
                  <div className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none">
                    <h4 className="font-semibold text-[#091540] mb-3">Agregar Productos a este Proyecto</h4>

                    {/* Autocomplete: un solo input con sugerencias en vivo */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-7">
                        <label className="text-sm text-gray-600">Producto</label>
                        <div className="mt-1 relative">
                          <div className="flex gap-2">
                            <input
                              className="flex-1 px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                              placeholder="Escribe para buscar o Ctrl+K para lista completa…"
                              value={productInput}
                              onChange={(e) => {
                                setProductInput(e.target.value);
                                setShowSuggestions(true);
                                setTempProductId(0); // hasta seleccionar
                              }}
                              onFocus={() => setShowSuggestions(true)}
                              onBlur={() => {
                                // pequeño delay para permitir click en sugerencia
                                setTimeout(() => setShowSuggestions(false), 120);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                  setShowSuggestions(false);
                                } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                                  e.preventDefault();
                                  setShowProductModal(true);
                                }
                              }}
                              disabled={productsLoading || !!productsError}
                            />
                            <button
                              type="button"
                              onClick={() => setShowProductModal(true)}
                              className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition disabled:opacity-50 whitespace-nowrap"
                              disabled={productsLoading || !!productsError}
                              title="Buscar en lista completa (Ctrl+K)"
                            >
                              Ver Lista
                            </button>
                          </div>
                          {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                          {/* Sugerencias */}
                          {showSuggestions && filteredProducts.length > 0 && (
                            <ul className="absolute z-10 mt-1 w-full max-h-56 overflow-auto bg-white border border-gray-200 shadow-lg">
                              {filteredProducts.slice(0, 8).map((p) => (
                                <li
                                  key={p.Id}
                                  className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
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
                          <span className="text-xs text-red-600 mt-1 block">
                            No se pudieron cargar los productos.
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-3">
                        <label className="text-sm text-gray-600">Cantidad</label>
                        <input
                          type="number"
                          min={0}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                          value={tempQty}
                          onChange={(e) => setTempQty(Number(e.target.value))}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <button
                          type="button"
                          className="w-full h-10 mt-6  bg-[#091540] text-white hover:opacity-90 disabled:opacity-50"
                          disabled={!tempProductId || tempQty <= 0}
                          onClick={() => {
                            const current = field.state.value ?? [];
                            // si ya existe el producto en la lista, acumula la cantidad
                            const idx = current.findIndex((d: any) => d.ProductId === tempProductId);
                            let next = [...current];
                            if (idx >= 0) {
                              next[idx] = {
                                ...next[idx],
                                Quantity: Number(next[idx].Quantity ?? 0) + Number(tempQty),
                              };
                            } else {
                              next.push({ ProductId: tempProductId, Quantity: tempQty });
                            }
                            field.handleChange(next);

                            // limpiar inputs
                            setTempProductId(0);
                            setTempQty(0);
                            setProductInput("");
                          }}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                      {/* Lista de detalles agregados (sin mostrar ID) */}
                      <ul className="mt-4 divide-y divide-gray-100">
                        {(field.state.value ?? []).map((d: any, i: number) => (
                          <li key={`${d.ProductId}-${i}`} className="py-3 flex items-center justify-between">
                            <div className="text-sm font-medium text-[#091540]">
                              {getProductName(d.ProductId)}
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={0}
                                className="w-24 px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={d.Quantity ?? 0}
                                onChange={(e) => {
                                  const qty = Number(e.target.value);
                                  const next = [...(field.state.value ?? [])];
                                  next[i] = { ...next[i], Quantity: qty };
                                  field.handleChange(next);
                                }}
                              />
                              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                              <p className="text-sm text-red-500 mt-1">
                                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                              </p>
                              )}
                              <button
                                type="button"
                                className="px-3 py-1  border border-gray-300 hover:bg-gray-50"
                                onClick={() => {
                                  const next = (field.state.value ?? []).filter((_: any, idx: number) => idx !== i);
                                  field.handleChange(next);
                                }}
                              >
                                Quitar
                              </button>
                            </div>
                          </li>
                        ))}

                        {(!field.state.value || field.state.value.length === 0) && (
                          <li className="py-2 text-sm text-gray-500">No hay productos agregados.</li>
                        )}
                      </ul>
                    </div>
                  )}
            </form.Field>
          </div>
        );

      // Paso 3: Documentos
      case 3:
        return (
          <div className="flex flex-col gap-6" key="step-3">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#091540] mb-2">
                Documentos del Proyecto
              </h3>
              <p className="text-gray-600 mb-6">
                Adjunta documentos complementarios para el proyecto (opcional)
              </p>
            </div>

            <form.Field name="files">
              {(field) => (
                <div className="space-y-4">
                  {/* Zona de drag & drop mejorada */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 group"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = Array.from(e.dataTransfer.files);
                      const currentFiles = field.state.value || [];
                      field.handleChange([...currentFiles, ...files]);
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          Arrastra archivos aquí o{" "}
                          <label className="text-blue-600 cursor-pointer hover:text-blue-700 underline">
                            selecciona archivos
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                const currentFiles = field.state.value || [];
                                field.handleChange([...currentFiles, ...files]);
                              }}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.zip,.rar"
                            />
                          </label>
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF, DOC, DOCX, XLS, XLSX, imágenes, archivos de texto
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Máximo 10MB por archivo
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de archivos seleccionados mejorada */}
                  {field.state.value && field.state.value.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">
                          Archivos seleccionados ({field.state.value.length})
                        </h4>
                        <button
                          type="button"
                          onClick={() => field.handleChange([])}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Limpiar todo
                        </button>
                      </div>
                      
                      <div className="grid gap-3 max-h-64 overflow-y-auto">
                        {field.state.value.map((file: File, index: number) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center gap-4 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = field.state.value.filter((_: File, i: number) => i !== index);
                                field.handleChange(newFiles);
                              }}
                              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
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

      // Paso 4: Confirmación
      case 4:
        return (
          <div className="text-[#091540] space-y-2 px-2" key="step-3">
            <h3 className="text-lg font-semibold mb-2">Confirma los datos:</h3>
            <form.Subscribe selector={(state) => state.values}>
              {(values) => (
                <div className="space-y-2">
                  <ul className="text-base space-y-1">
                    <li><b>Nombre:</b> {values.Name}</li>
                    <li><b>Ubicación:</b> {values.Location}</li>
                    <li><b>Fecha inicio:</b> {values.InnitialDate ? new Date(values.InnitialDate).toLocaleDateString() : ""}</li>
                    <li><b>Fecha fin:</b> {values.EndDate ? new Date(values.EndDate).toLocaleDateString() : ""}</li>
                    <li><b>Objetivo:</b> {values.Objective}</li>
                    <li><b>Descripción:</b> {values.Description}</li>
                    <li><b>Obs. Proyecto:</b> {values.Observation}</li>
                    <li><b>Obs. Proyección:</b> {values.projection?.Observation}</li>
                  </ul>

                  <div className="mt-4">
                    <div className="font-semibold">Productos:</div>
                    <ul className="list-disc pl-5">
                      {(values.productDetails ?? []).map((d: any, i: number) => (
                        <li key={i}>
                          {getProductName(d.ProductId)} — Cantidad: {d.Quantity}
                        </li>
                      ))}
                      {(values.productDetails ?? []).length === 0 && (
                        <li className="text-sm text-gray-500 list-none">Sin detalles.</li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <div className="font-semibold">Documentos:</div>
                    {values.files && values.files.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {values.files.map((file: File, i: number) => (
                          <li key={i} className="text-sm">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 pl-5">Sin documentos adjuntos.</p>
                    )}
                  </div>
                </div>
              )}
            </form.Subscribe>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#091540] text-center tracking-tight">
        Crear Nuevo Proyecto
      </h2>

      {/* Indicador de pasos con pelotitas */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          {steps.map((stepItem, index) => (
            <div key={index} className="flex items-center">
              {/* Pelotita del paso */}
              <div className="flex flex-col items-center">
                <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-200 ${
                      index < step
                        ? 'bg-[#1789FC] text-white'     // color completado
                        : index === step
                        ? 'bg-[#091540] text-white'     // color actual
                        : 'bg-gray-200 text-gray-500'   // pendiente
                    }`}
                  >
                  {index < step ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center max-w-20 ${
                    index === step
                      ? 'text-[#091540]'
                      : index < step
                      ? 'text-[#1789FC]'
                      : 'text-gray-500'
                  }`}
                >
                  {stepItem.label}
                </span>
              </div>

              {/* Línea conectora */}
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-12 mx-2 transition-colors duration-200 ${
                    index < step ? 'bg-[#1789FC]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Título del paso actual */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#091540]">
            {steps[step].label}
          </h3>
        </div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            console.debug('[CreateProject] form onSubmit, step=', step);
            if (step < steps.length - 1) {
              console.debug('[CreateProject] advancing step', step + 1);
              handleNext();
            } else {
              console.debug('[CreateProject] awaiting form.handleSubmit()');
              // Await the form's handleSubmit to ensure submit flow completes before any navigation
              await form.handleSubmit();
            }
          } catch (err) {
            console.error('[CreateProject] onSubmit handler error', err);
          }
        }}
        className="flex flex-col gap-6"
      >
        {renderStepFields()}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([, isSubmitting]) => (
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 text-[#091540] hover:border-blue-400 hover:text-blue-700 transition"
                  onClick={() => setStep(step - 1)}
                >
                  Atrás
                </button>
              ) : (
                <div />
              )}
              <button
                type="submit"
                className="px-6 py-2 border border-[#091540] bg-[#091540] text-white hover:text-[#f5f5f5] hover:border-[#091540] transition disabled:opacity-60"
                disabled={isSubmitting}
              >
                {step === steps.length - 1 ? (isSubmitting ? "Creando..." : "Crear Proyecto") : "Siguiente"}
              </button>
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
        selectedProductIds={form.state.values.productDetails?.map(d => d.ProductId ?? 0) ?? []}
      />
    </div>
  );
};

export default CreateProject;
