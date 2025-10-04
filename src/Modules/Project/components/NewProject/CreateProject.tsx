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
import { ProjectSchema } from "../../schemas/ProjectSchema";
import { StepSchemas } from "../../schemas/StepSchema";
import z from "zod";
import { useGetUsersByRoleAdmin } from "../../../Users/Hooks/UsersHooks";
import { ProductSelectionModal } from "./ProductSelectionModal";
import type { Product } from "../../../Products/Models/CreateProduct";
import { useNavigate } from "@tanstack/react-router";



const steps = [
  { label: "Datos Básicos" },
  { label: "Detalles" },
  { label: "Proyección" },
  { label: "Confirmación" },
];

type ProjectCreatePayload = typeof newProjectInitialState;

const CreateProject = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const createProjectMutation = useCreateProject();
  const createProjectProjectionMutation = useCreateProjectProjection();
  const createProductDetailMutation = useCreateProductDetail();
  const { userAdmin = [], isPending: UserAdminIsLoading} = useGetUsersByRoleAdmin();

  const { projectStates, projectStatesLoading } = useGetAllProjectStates();
  const { products, isPending: productsLoading, error: productsError } = useGetAllProducts();

  // Estado local para múltiples documentos
  const [projectDocuments, setProjectDocuments] = useState<File[]>([]);

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
      //onChange:ProjectSchema,
    },
    defaultValues: {
      ...newProjectInitialState,
      Observation: "",
      projection: {
        Observation: "",
      },
      productDetails: [] as Array<Pick<NewProductDetail, "ProductId" | "Quantity">>,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        // 1) Proyecto
        const projectPayload: ProjectCreatePayload = {
          Name: value.Name,
          Location: value.Location,
          InnitialDate: value.InnitialDate,
          EndDate: value.EndDate,
          Objective: value.Objective,
          Description: value.Description,
          Observation: value.Observation, // Observation del PROYECTO
          SpaceOfDocument: value.SpaceOfDocument,
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

        // 4) Éxito
        formApi.reset();
        toast.success("¡Proyecto, proyección y detalles creados!", { position: "top-right", autoClose: 3000 });
        navigate({ to: "/dashboard/projects" });
        setStep(0);
        setTempProductId(0);
        setTempQty(0);
        setProjectDocuments([]);
        
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
                      value={field.state.value ? new Date(field.state.value).toISOString().split("T")[0] : ""}
                      onChange={(e) => field.handleChange(new Date(e.target.value))}
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
                {(field) => (
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#091540]">Fecha de fin</span>
                    <input
                      type="date"
                      className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                      value={field.state.value ? new Date(field.state.value).toISOString().split("T")[0] : ""}
                      onChange={(e) => field.handleChange(new Date(e.target.value))}
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

            {/* Campo de documentos usando estado local */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-[#091540]">Documentos del proyecto</span>
              
              {/* Área de subida */}
              <div className="relative">
                <input
                  type="file"
                  id="spaceOfDocument"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const newFiles = Array.from(e.target.files);
                      setProjectDocuments(prev => [...prev, ...newFiles]);
                      // Limpiar el input para permitir seleccionar los mismos archivos de nuevo
                      e.target.value = '';
                    }
                  }}
                />
                <div className="flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg border-dashed hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                  {/* Ícono de subir archivo */}
                  <svg 
                    className="w-6 h-6 text-gray-400" 
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
                  
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Haz clic para agregar documentos</span>
                      <span className="block text-xs">o arrastra y suelta aquí (PDF, DOC, IMG)</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="px-4 py-2 text-sm bg-[#091540] text-white rounded hover:bg-[#1789FC] transition-colors"
                    onClick={() => document.getElementById('spaceOfDocument')?.click()}
                  >
                    + Agregar
                  </button>
                </div>
              </div>

              {/* Lista de documentos agregados */}
              {projectDocuments.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Documentos agregados ({projectDocuments.length})
                    </span>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:text-red-800 underline"
                      onClick={() => setProjectDocuments([])}
                    >
                      Quitar todos
                    </button>
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                    {projectDocuments.map((file: File, index: number) => (
                      <div key={`${file.name}-${index}-${file.lastModified}`} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {Math.round(file.size / 1024)} KB
                          </p>
                        </div>
                        
                        <button
                          type="button"
                          className="flex-shrink-0 ml-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          onClick={() => {
                            setProjectDocuments(prev => prev.filter((_, i) => i !== index));
                          }}
                          title="Quitar documento"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Campo oculto para mantener compatibilidad con el formulario */}
            <form.Field name="SpaceOfDocument">
              {(field) => {
                // Sincronizar el primer documento con el formulario para compatibilidad
                if (projectDocuments.length > 0 && !field.state.value) {
                  field.handleChange(projectDocuments[0]);
                } else if (projectDocuments.length === 0 && field.state.value) {
                  field.handleChange(undefined as any);
                }
                return null;
              }}
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

      // Paso 3: Confirmación
      case 3:
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
      <h2 className="text-2xl font-bold mb-2 text-[#091540] text-center tracking-tight">
        {steps[step].label}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < steps.length - 1) {
            handleNext();
          } else {
            form.handleSubmit();
          }
        }}
        className="flex flex-col gap-6"
      >
        {renderStepFields()}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
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
                disabled={step === steps.length - 1 ? !canSubmit || isSubmitting : false}
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
