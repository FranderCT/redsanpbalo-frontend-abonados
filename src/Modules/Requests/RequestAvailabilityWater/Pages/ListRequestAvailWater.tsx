import { useForm } from "@tanstack/react-form";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Upload, UserRound } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useGetAllUsers } from "../../../Users/Hooks/UsersHooks";
import type { User } from "../../../Users/Models/User";
import { useGetAllRequestStates } from "../../StateRequest/Hooks/RequestStateHook";
import { useGetAllReqAvailWater } from "../Hooks/ReqAvailWaterHooks";
import type { ReqAvailWater } from "../Models/ReqAvailWater";
import ReqAvailWaterHeaderBar from "../Components/PaginationReqAvailabilityWater/ReqAvailWaterHeaderBar";
import ReqAvailWaterCards from "../Components/ReqAvailabilityWaterCards/ReqAvailWaterCards";
import { useCreateAvailabilityWaterRq } from "../../../Request-Abonados/Hooks/AvailabilityWater/AvailabilityWaterHooks";
import { uploadRequestAvailabilityWaterFile } from "../../../Upload-files/Services/ProjectFileServices";
import { CreateAvailabilityWaterRequestSchema } from "../schemas/CreateAvailabilityWaterRequestSchema";
import { uploadWithRetry } from "../utils/requestAvailabilityWaterUpload";

const getFieldErrorMessage = (error: unknown) =>
  typeof error === "object" && error !== null && "message" in error
    ? String((error as { message?: string }).message ?? "Valor inválido")
    : String(error);

function FileField({
  files,
  label,
  description,
  onSelect,
  onRemove,
}: {
  files: File[];
  label: string;
  description: string;
  onSelect: (files: FileList | null) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block text-sm font-medium text-slate-900">{label}</Label>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

      <label className="block cursor-pointer border-2 border-dashed border-slate-300 p-8 text-center transition-all hover:border-[#1789FC] hover:bg-sky-50/30">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-500">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Seleccionar archivos</p>
            <p className="mt-1 text-xs text-slate-500">PDF, DOC, JPG, PNG (Máx. 10MB c/u)</p>
          </div>
        </div>
        <input
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          onChange={(event) => onSelect(event.target.files)}
        />
      </label>

      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center justify-between border border-slate-200 bg-slate-50 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-none text-red-600 hover:text-red-700"
                onClick={() => onRemove(index)}
              >
                Quitar
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function filterUsers(users: User[], query: string) {
  const text = query.trim().toLowerCase();
  if (!text) return users.slice(0, 20);

  return users
    .filter((user) => {
      const fullName = `${user.Name ?? ""} ${user.Surname1 ?? ""} ${user.Surname2 ?? ""}`.toLowerCase().trim();
      const nis = Array.isArray(user.Nis) ? user.Nis.join(", ") : "";
      return (
        fullName.includes(text) ||
        String(user.IDcard ?? "").toLowerCase().includes(text) ||
        nis.toLowerCase().includes(text) ||
        String(user.Email ?? "").toLowerCase().includes(text)
      );
    })
    .slice(0, 20);
}

function CreateAvailabilityWaterAdminView({ onSuccess }: { onSuccess: () => void }) {
  const createMutation = useCreateAvailabilityWaterRq();
  const { usersProfiles = [], isPending: usersLoading } = useGetAllUsers();
  const [userSearch, setUserSearch] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const form = useForm({
    defaultValues: {
      UserId: 0,
      Justification: "",
      fotocopiaCedula: [] as File[],
      copiaPlano: [] as File[],
      permisoMatricula: [] as File[],
      permisoMunicipal: [] as File[],
      _selectedUser: null as User | null,
    },
    validators: {
      onChange: CreateAvailabilityWaterRequestSchema,
      onSubmit: CreateAvailabilityWaterRequestSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const requestResult = await createMutation.mutateAsync({
          Justification: value.Justification.trim(),
          UserId: Number(value.UserId) || 0,
        });
        const requestId = requestResult?.Id;

        if (!requestId) {
          throw new Error("No se obtuvo el ID de la solicitud creada.");
        }

        const uploadTasks = [
          {
            name: "Fotocopia de Cédula",
            files: value.fotocopiaCedula,
            subfolder: "Fotocopia-Cedula",
          },
          {
            name: "Copia del Plano",
            files: value.copiaPlano,
            subfolder: "Copia-Plano",
          },
          {
            name: "Permiso de Construcción",
            files: value.permisoMatricula,
            subfolder: "Permiso-Construcción",
          },
          {
            name: "Permiso Municipal",
            files: value.permisoMunicipal,
            subfolder: "Permiso-Municipal",
          },
        ].filter((task) => task.files.length > 0);

        if (uploadTasks.length > 0) {
          setIsUploading(true);
          let completedUploads = 0;

          for (let index = 0; index < uploadTasks.length; index++) {
            const task = uploadTasks[index];

            try {
              setUploadProgress(`Subiendo ${task.name}... (${index + 1}/${uploadTasks.length})`);
              await uploadWithRetry(() =>
                uploadRequestAvailabilityWaterFile(
                  requestId,
                  task.files,
                  task.subfolder,
                  Number(value.UserId) || 0,
                ),
              );
              completedUploads++;
            } catch (uploadError) {
              console.error(`Error subiendo ${task.name}:`, uploadError);
              toast.error(`Error al subir ${task.name}. El documento no se guardó.`);
            }
          }

          toast.success(
            `Solicitud creada y ${completedUploads}/${uploadTasks.length} tipo(s) de documentos subidos exitosamente`,
          );
        } else {
          toast.success("Solicitud de disponibilidad de agua creada exitosamente");
        }

        formApi.reset();
        setUserSearch("");
        onSuccess();
      } catch (error) {
        console.error("Error al crear la solicitud de disponibilidad de agua", error);
        toast.error("No se pudo crear la solicitud.");
      } finally {
        setIsUploading(false);
        setUploadProgress("");
      }
    },
  });

  const selectedUser = form.state.values._selectedUser;
  const filteredUsers = useMemo(
    () => filterUsers((usersProfiles as User[]) ?? [], userSearch),
    [usersProfiles, userSearch],
  );

  const handleFileSelect = (
    fieldName: "fotocopiaCedula" | "copiaPlano" | "permisoMatricula" | "permisoMunicipal",
    files: FileList | null,
  ) => {
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`El archivo "${file.name}" excede el tamaño máximo de 10MB`);
        return false;
      }
      return true;
    });

    form.setFieldValue(fieldName, validFiles as never);
  };

  const handleRemoveFile = (
    fieldName: "fotocopiaCedula" | "copiaPlano" | "permisoMatricula" | "permisoMunicipal",
    index: number,
  ) => {
    const currentFiles = form.getFieldValue(fieldName) as File[];
    form.setFieldValue(
      fieldName,
      currentFiles.filter((_, fileIndex) => fileIndex !== index) as never,
    );
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <Card className="rounded-none border-slate-200 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-[#091540]">Datos del solicitante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form.Field name="UserId">
            {(field) => (
              <div className="relative">
                <Label className="mb-2 block">
                  Usuario solicitante <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2 border border-input bg-background px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
                  <Input
                    type="text"
                    value={
                      selectedUser
                        ? `${selectedUser.IDcard ?? ""} - ${selectedUser.Name ?? ""} ${selectedUser.Surname1 ?? ""}`
                        : userSearch
                    }
                    onChange={(event) => {
                      setUserSearch(event.target.value);
                      setShowUserList(true);
                      if (selectedUser) {
                        form.setFieldValue("_selectedUser", null);
                        field.handleChange(0);
                      }
                    }}
                    onFocus={() => setShowUserList(true)}
                    placeholder="Buscar por nombre, cédula, correo o NIS"
                    className="h-auto border-0 px-0 py-0 shadow-none focus-visible:ring-0"
                  />
                  {field.state.value ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="rounded-none text-xs"
                      onClick={() => {
                        field.handleChange(0);
                        form.setFieldValue("_selectedUser", null);
                        setUserSearch("");
                      }}
                    >
                      Limpiar
                    </Button>
                  ) : null}
                </div>

                {showUserList ? (
                  <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto border border-slate-200 bg-white shadow-lg">
                    {usersLoading ? <div className="p-3 text-sm text-slate-500">Cargando usuarios…</div> : null}
                    {!usersLoading && filteredUsers.length === 0 ? (
                      <div className="p-3 text-sm text-slate-500">
                        {userSearch.trim() ? "Sin resultados" : "Escriba para buscar"}
                      </div>
                    ) : null}
                    {!usersLoading
                      ? filteredUsers.map((user) => (
                          <button
                            key={user.Id}
                            type="button"
                            onClick={() => {
                              field.handleChange(user.Id);
                              form.setFieldValue("_selectedUser", user);
                              setUserSearch(user.IDcard || "");
                              setShowUserList(false);
                            }}
                            className="w-full border-b border-slate-100 px-3 py-2 text-left hover:bg-slate-50 last:border-0"
                          >
                            <div className="text-sm font-medium text-slate-900">
                              {user.Name} {user.Surname1} {user.Surname2}
                            </div>
                            <div className="text-xs text-slate-500">
                              Cédula: {user.IDcard ?? "—"}
                              {Array.isArray(user.Nis) && user.Nis.length ? ` • NIS: ${user.Nis.join(", ")}` : ""}
                            </div>
                          </button>
                        ))
                      : null}
                  </div>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="UserId">
            {(field) =>
              field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                <p className="text-sm text-red-500">{getFieldErrorMessage(field.state.meta.errors[0])}</p>
              ) : null
            }
          </form.Field>

          {selectedUser ? (
            <div className="flex items-start gap-3 border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center bg-[#091540]/10 text-[#091540]">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="space-y-1 text-sm">
                <div className="font-medium text-slate-900">
                  {selectedUser.Name} {selectedUser.Surname1} {selectedUser.Surname2}
                </div>
                <div className="text-slate-600">
                  Cédula: <span className="font-mono">{selectedUser.IDcard ?? "—"}</span>
                  {Array.isArray(selectedUser.Nis) && selectedUser.Nis.length ? (
                    <>
                      {" "}
                      • NIS: <span className="font-mono">{selectedUser.Nis.join(", ")}</span>
                    </>
                  ) : null}
                </div>
                {selectedUser.Email ? <div className="text-slate-600">Correo: {selectedUser.Email}</div> : null}
                {selectedUser.PhoneNumber ? <div className="text-slate-600">Teléfono: {selectedUser.PhoneNumber}</div> : null}
                {selectedUser.Address ? <div className="text-slate-600">Dirección: {selectedUser.Address}</div> : null}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-none border-slate-200 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-[#091540]">Contenido de la solicitud</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.Field name="Justification">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="request-availability-water-admin-justification">
                  Justificación <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="request-availability-water-admin-justification"
                  className="min-h-[180px] rounded-none resize-none"
                  placeholder="Describa el motivo y la necesidad del servicio de agua."
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-red-500">{getFieldErrorMessage(field.state.meta.errors[0])}</p>
                ) : null}
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      <Card className="rounded-none border-slate-200 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-[#091540]">Documentos de respaldo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <form.Subscribe selector={(state) => state.values.fotocopiaCedula}>
            {(files) => (
              <FileField
                files={files}
                label="1. Fotocopia de Cédula"
                description="Fotocopia clara de la cédula del solicitante (ambas caras)."
                onSelect={(selectedFiles) => handleFileSelect("fotocopiaCedula", selectedFiles)}
                onRemove={(index) => handleRemoveFile("fotocopiaCedula", index)}
              />
            )}
          </form.Subscribe>
          <form.Subscribe selector={(state) => state.values.copiaPlano}>
            {(files) => (
              <FileField
                files={files}
                label="2. Copia del Plano"
                description="Plano de la propiedad o construcción donde se instalará el servicio."
                onSelect={(selectedFiles) => handleFileSelect("copiaPlano", selectedFiles)}
                onRemove={(index) => handleRemoveFile("copiaPlano", index)}
              />
            )}
          </form.Subscribe>
          <form.Subscribe selector={(state) => state.values.permisoMatricula}>
            {(files) => (
              <FileField
                files={files}
                label="3. Permiso de Construcción"
                description="Documento que autoriza la construcción en el terreno."
                onSelect={(selectedFiles) => handleFileSelect("permisoMatricula", selectedFiles)}
                onRemove={(index) => handleRemoveFile("permisoMatricula", index)}
              />
            )}
          </form.Subscribe>
          <form.Subscribe selector={(state) => state.values.permisoMunicipal}>
            {(files) => (
              <FileField
                files={files}
                label="4. Permiso Municipal"
                description="Autorización municipal para la instalación del servicio."
                onSelect={(selectedFiles) => handleFileSelect("permisoMunicipal", selectedFiles)}
                onRemove={(index) => handleRemoveFile("permisoMunicipal", index)}
              />
            )}
          </form.Subscribe>
        </CardContent>
      </Card>

      {isUploading ? (
        <div className="border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          {uploadProgress || "Subiendo documentos..."}
        </div>
      ) : null}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <div className="flex justify-end border-t border-slate-200 pt-4">
            <Button
              type="submit"
              className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]"
              disabled={!canSubmit || isSubmitting || isUploading || createMutation.isPending}
            >
              {isSubmitting || isUploading || createMutation.isPending
                ? uploadProgress || "Creando solicitud..."
                : "Crear Solicitud"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default function ListReqAvailWater() {
  const [viewMode, setViewMode] = useState<"create" | "list">("list");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [StateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  const handleStateRequestChange = (id?: number) => {
    setStateRequestId(id);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setStateRequestId(undefined);
    setPage(1);
  };

  const { requestStates = [], isPending: requestStatesLoading } = useGetAllRequestStates();
  const { reqavailwater, isPending: isLoading, error } = useGetAllReqAvailWater();
  const allRows = useMemo<ReqAvailWater[]>(() => reqavailwater ?? [], [reqavailwater]);
  const filteredRows = useMemo(() => {
    const normalizedSearch = search
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    return allRows.filter((row) => {
      const matchesState = StateRequestId ? row.StateRequest?.Id === StateRequestId : true;

      if (!matchesState) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        row.Justification,
        row.StateRequest?.Name,
        row.User?.Name,
        row.User?.Surname1,
        row.User?.Surname2,
        row.User?.IDcard,
        row.User?.Email,
        row.User?.Address,
        row.Date ? String(row.Date) : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return searchableText.includes(normalizedSearch);
    });
  }, [allRows, search, StateRequestId]);

  const total = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * limit;
  const rows = filteredRows.slice(start, start + limit);

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="border border-slate-200 bg-white text-[#091540] shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {viewMode === "create"
                ? "Nueva solicitud de disponibilidad de agua"
                : "Solicitudes de disponibilidad de agua"}
            </h1>
            <p className="text-sm text-[#091540]/70">
              {viewMode === "create"
                ? "Registre una solicitud para cualquier usuario y adjunte los documentos requeridos."
                : "Revise el listado, filtre resultados y gestione el estado de cada solicitud."}
            </p>
          </div>

          <div className="inline-flex items-center self-start border border-slate-200 bg-slate-100 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("create")}
              aria-pressed={viewMode === "create"}
              className={`h-10 px-4 text-sm font-medium transition-all ${viewMode === "create" ? "bg-[#091540] text-white shadow" : "bg-transparent text-[#091540] hover:bg-white"}`}
            >
              Nueva solicitud
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              className={`h-10 px-4 text-sm font-medium transition-all ${viewMode === "list" ? "bg-[#091540] text-white shadow" : "bg-transparent text-[#091540] hover:bg-white"}`}
            >
              Ver solicitudes
            </button>
          </div>
        </div>
      </section>

      {viewMode === "create" ? (
        <CreateAvailabilityWaterAdminView onSuccess={() => setViewMode("list")} />
      ) : (
        <>
          <ReqAvailWaterHeaderBar
            limit={limit}
            total={total}
            search={search}
            requestStateId={StateRequestId}
            states={requestStates}
            statesLoading={requestStatesLoading}
            onStateRequestChange={handleStateRequestChange}
            onLimitChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
            onSearchChange={handleSearchChange}
            onCleanFilters={handleCleanFilters}
          />

          <div>
            {isLoading ? (
              <div className="border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                Cargando solicitudes…
              </div>
            ) : error ? (
              <div className="border border-red-200 bg-red-50 p-8 text-center text-red-600">
                Ocurrió un error al cargar las solicitudes.
              </div>
            ) : (
              <ReqAvailWaterCards
                data={rows}
                total={total}
                page={safePage}
                pageSize={limit}
                pageCount={pageCount}
                onPageChange={setPage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
