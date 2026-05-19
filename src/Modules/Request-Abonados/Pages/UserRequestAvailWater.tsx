import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Can } from "../../Auth/Components/Can";
import { Role } from "../../Users/Models/Roles";
import { Upload, UserRound } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useGetUserProfile } from "../../Users/Hooks/UsersHooks";
import { useCreateAvailabilityWaterRq } from "../Hooks/AvailabilityWater/AvailabilityWaterHooks";
import ListRequestAvailWaterUser from "./ListRequestAvailWaterUser";
import { uploadRequestAvailabilityWaterFile } from "../../Upload-files/Services/ProjectFileServices";
import { uploadWithRetry } from "../../Requests/RequestAvailabilityWater/utils/requestAvailabilityWaterUpload";
import { CreateAvailabilityWaterRequestAbonadoSchema } from "../../Requests/RequestAvailabilityWater/schemas/CreateAvailabilityWaterRequestAbonadoSchema";

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

export default function UserRequestAvailWater() {
  const [viewMode, setViewMode] = useState<"create" | "list">("list");
  const createMutation = useCreateAvailabilityWaterRq();
  const { UserProfile } = useGetUserProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const form = useForm({
    defaultValues: {
      Justification: "",
      fotocopiaCedula: [] as File[],
      copiaPlano: [] as File[],
      permisoMatricula: [] as File[],
      permisoMunicipal: [] as File[],
      UserId: Number(UserProfile?.Id) || 0,
    },
    validators: {
      onChange: CreateAvailabilityWaterRequestAbonadoSchema,
      onSubmit: CreateAvailabilityWaterRequestAbonadoSchema,
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
        setViewMode("list");
      } catch (error) {
        console.error("Error al crear la solicitud:", error);
        toast.error("Error al crear la solicitud. Intente nuevamente.");
      } finally {
        setIsUploading(false);
        setUploadProgress("");
      }
    },
  });

  useEffect(() => {
    form.setFieldValue("UserId", Number(UserProfile?.Id) || 0);
  }, [UserProfile, form]);

  const handleCancel = () => {
    form.reset();
    setIsUploading(false);
    setUploadProgress("");
    toast.warning("Solicitud cancelada");
  };

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
    <div className="flex flex-col gap-6 p-4">
      <section className="border border-slate-200 bg-white text-[#091540] shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {viewMode === "create"
                ? "Solicitud de disponibilidad de agua"
                : "Mis solicitudes de disponibilidad de agua"}
            </h1>
            <p className="text-sm text-[#091540]/70">
              {viewMode === "create"
                ? "Complete la justificación y adjunte los documentos requeridos."
                : "Revise el historial y el estado actual de sus solicitudes."}
            </p>
          </div>

          <div className="inline-flex items-center self-start border border-slate-200 bg-slate-100 p-1 shadow-sm">
            <Can rule={{ none: [Role.BOD] }}>
              <button
                type="button"
                onClick={() => setViewMode("create")}
                aria-pressed={viewMode === "create"}
                className={`h-10 px-4 text-sm font-medium transition-all ${viewMode === "create" ? "bg-[#091540] text-white shadow" : "bg-transparent text-[#091540] hover:bg-white"}`}
              >
                Nueva solicitud
              </button>
            </Can>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              className={`h-10 px-4 text-sm font-medium transition-all ${viewMode === "list" ? "bg-[#091540] text-white shadow" : "bg-transparent text-[#091540] hover:bg-white"}`}
            >
              Ver mis solicitudes
            </button>
          </div>
        </div>
      </section>

      {viewMode === "list" ? (
        <ListRequestAvailWaterUser />
      ) : (
        <Can rule={{ none: [Role.BOD] }} fallback={<ListRequestAvailWaterUser />}>
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
              {UserProfile ? (
                <div className="flex items-start gap-3 border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#091540]/10 text-[#091540]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-slate-900">
                      {UserProfile.Name} {UserProfile.Surname1} {UserProfile.Surname2}
                    </div>
                    <div className="text-slate-600">
                      Cédula: <span className="font-mono">{UserProfile.IDcard ?? "—"}</span>
                    </div>
                    {UserProfile.Email ? <div className="text-slate-600">Correo: {UserProfile.Email}</div> : null}
                    {UserProfile.PhoneNumber ? <div className="text-slate-600">Teléfono: {UserProfile.PhoneNumber}</div> : null}
                    {UserProfile.Address ? <div className="text-slate-600">Dirección: {UserProfile.Address}</div> : null}
                  </div>
                </div>
              ) : (
                <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  No se pudo cargar la información del usuario.
                </div>
              )}

              <form.Field name="UserId">
                {(field) =>
                  field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                    <p className="text-sm text-red-500">{getFieldErrorMessage(field.state.meta.errors[0])}</p>
                  ) : null
                }
              </form.Field>
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
                    <Label htmlFor="request-availability-water-justification">
                      Justificación <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="request-availability-water-justification"
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
              <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="submit"
                  className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]"
                  disabled={!canSubmit || isSubmitting || isUploading || createMutation.isPending}
                >
                  {isSubmitting || isUploading || createMutation.isPending
                    ? uploadProgress || "Creando solicitud..."
                    : "Crear Solicitud"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none"
                  onClick={handleCancel}
                  disabled={isSubmitting || isUploading || createMutation.isPending}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
        </Can>
      )}
    </div>
  );
}
