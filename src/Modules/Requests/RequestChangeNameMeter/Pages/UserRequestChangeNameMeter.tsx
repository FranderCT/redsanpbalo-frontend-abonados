import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { FileText, Upload, UserRound } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useChangeNameMeterRq } from "../../../Request-Abonados/Hooks/ChangeNameMeter/ChangeNameMeter";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { UploadChangeNameMeterFiles } from "../../../Upload-files/Services/ProjectFileServices";
import ListReqChangeNameMeterUser from "../../../Request-Abonados/Pages/ChangeNameMeter/ListChangeNameMeterUser";
import { CreateChangeNameMeterRequestAbonadoSchema } from "../schemas/CreateChangeNameMeterRequestAbonadoSchema";
import { getChangeNameMeterAvailableNis, getChangeNameMeterPrimaryNis } from "../utils/changeNameMeterForm";

type RetryableError = {
  response?: {
    status?: number;
    headers?: Record<string, string | undefined>;
  };
};

const getFieldErrorMessage = (error: unknown) =>
  typeof error === "object" && error !== null && "message" in error
    ? String((error as { message?: string }).message ?? "Valor inválido")
    : String(error);

const uploadWithRetry = async (
  uploadFn: () => Promise<unknown>,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<unknown> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await uploadFn();
    } catch (error) {
      const requestError = error as RetryableError;
      attempt++;
      if (requestError.response?.status === 429) {
        const retryAfter = requestError.response.headers?.["retry-after"];
        const delayMs = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.min(baseDelay * Math.pow(2, attempt), 10000);
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, Math.max(delayMs, 500)));
          continue;
        }
      }
      throw error;
    }
  }
  throw new Error("No se pudo completar la subida de archivos.");
};

export default function UserRequestChangeNameMeter() {
  const [viewMode, setViewMode] = useState<"create" | "list">("create");
  const createMutation = useChangeNameMeterRq();
  const { UserProfile } = useGetUserProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const form = useForm({
    defaultValues: {
      Justification: "",
      NIS: getChangeNameMeterPrimaryNis(UserProfile ?? null),
      fotocopiaCedula: [] as File[],
      copiaPlano: [] as File[],
      literalCerfication: [] as File[],
      UserId: Number(UserProfile?.Id) || 0,
    },
    validators: {
      onChange: CreateChangeNameMeterRequestAbonadoSchema,
      onSubmit: CreateChangeNameMeterRequestAbonadoSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const requestPayload = {
          Justification: value.Justification.trim(),
          UserId: Number(value.UserId) || 0,
        };

        if (requestPayload.UserId <= 0) {
          toast.error("No se pudo identificar el abonado actual.");
          return;
        }

        const requestResult = await createMutation.mutateAsync(requestPayload);
        const requestId = requestResult?.Id;

        if (!requestId) {
          throw new Error("No se obtuvo el ID de la solicitud creada.");
        }

        const uploadTasks = [
          {
            label: "Fotocopia de cédula",
            files: value.fotocopiaCedula,
            subfolder: "Fotocopia-Cedula",
          },
          {
            label: "Copia del plano",
            files: value.copiaPlano,
            subfolder: "Copia-Plano",
          },
          {
            label: "Certificación literal",
            files: value.literalCerfication,
            subfolder: "Certificacion-Literal",
          },
        ].filter((task) => task.files.length > 0);

        if (uploadTasks.length > 0) {
          setIsUploading(true);
          let completedUploads = 0;

          for (const task of uploadTasks) {
            try {
              setUploadProgress(`Subiendo ${task.label}... (${completedUploads + 1}/${uploadTasks.length})`);
              await uploadWithRetry(() =>
                UploadChangeNameMeterFiles(requestId, task.files, task.subfolder, UserProfile?.Id),
              );
              completedUploads++;
            } catch (error) {
              console.error(error);
              toast.error(`Error al subir ${task.label}. El documento no se guardó.`);
            }
          }

          toast.success(
            `Solicitud creada y ${completedUploads}/${uploadTasks.length} tipo(s) de documentos subidos exitosamente`,
          );
        } else {
          toast.success("Solicitud creada exitosamente");
        }

        formApi.reset();
        setUploadProgress("");
      } catch (error) {
        console.error(error);
        toast.error("Error al crear la solicitud. Intente nuevamente.");
      } finally {
        setIsUploading(false);
        setUploadProgress("");
      }
    },
  });

  const handleClose = () => {
    toast.warning("Solicitud cancelada");
    form.reset();
    setIsUploading(false);
    setUploadProgress("");
  };

  const availableNis = getChangeNameMeterAvailableNis(UserProfile ?? null);

  useEffect(() => {
    if (!UserProfile?.Id) return;
    form.setFieldValue("UserId", Number(UserProfile.Id) || 0);
    form.setFieldValue("NIS", getChangeNameMeterPrimaryNis(UserProfile ?? null));
  }, [UserProfile, form]);

  const handleFileChange = (
    files: FileList | null,
    onChange: (files: File[]) => void,
  ) => {
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`El archivo "${file.name}" excede el tamaño máximo de 10MB`);
        return false;
      }
      return true;
    });

    onChange(validFiles);
  };

  const FileField = ({
    name,
    label,
    description,
  }: {
    name: "fotocopiaCedula" | "copiaPlano" | "literalCerfication";
    label: string;
    description: string;
  }) => (
    <form.Field name={name}>
      {(field) => (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">{label}</Label>
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
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFileChange(event.target.files, field.handleChange)
              }
            />
          </label>

          {field.state.value.length > 0 ? (
            <div className="space-y-2">
              {field.state.value.map((file: File, index: number) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-none text-red-600 hover:text-red-700"
                    onClick={() =>
                      field.handleChange(field.state.value.filter((_: File, currentIndex: number) => currentIndex !== index))
                    }
                  >
                    Quitar
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </form.Field>
  );

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="border border-slate-200 bg-white text-[#091540] shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {viewMode === "create"
                ? "Solicitud de cambio de nombre del medidor"
                : "Mis solicitudes de cambio de nombre del medidor"}
            </h1>
            <p className="text-sm text-[#091540]/70">
              {viewMode === "create"
                ? "Complete la justificación y adjunte la documentación correspondiente."
                : "Revise el historial y el estado actual de sus solicitudes."}
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
              Ver mis solicitudes
            </button>
          </div>
        </div>
      </section>

      {viewMode === "list" ? (
        <ListReqChangeNameMeterUser />
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-[#091540]">Datos del abonado</CardTitle>
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
                      {availableNis.length > 0 ? (
                        <>
                          {" "}
                          • NIS disponibles: <span className="font-mono">{availableNis.join(", ")}</span>
                        </>
                      ) : null}
                    </div>
                    {UserProfile.Email ? (
                      <div className="text-slate-600">Correo: {UserProfile.Email}</div>
                    ) : null}
                    {UserProfile.Address ? (
                      <div className="text-slate-600">Dirección: {UserProfile.Address}</div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  No se pudo cargar la información del abonado.
                </div>
              )}

              <form.Field name="UserId">
                {(field) =>
                  field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                    <p className="text-sm text-red-500">
                      {getFieldErrorMessage(field.state.meta.errors[0])}
                    </p>
                  ) : null
                }
              </form.Field>
            </CardContent>
          </Card>

          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-[#091540]">Contenido de la solicitud</CardTitle>
            </CardHeader>
            <CardContent>
              <form.Field name="Justification">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="request-change-name-user-justification">
                      Justificación de la solicitud <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="request-change-name-user-justification"
                      autoFocus
                      className="min-h-[180px] resize-none rounded-none"
                      placeholder="Describa el motivo de su solicitud de cambio de nombre del medidor"
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      required
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                      <p className="text-sm text-red-500">
                        {getFieldErrorMessage(field.state.meta.errors[0])}
                      </p>
                    ) : null}
                    <p className="text-xs text-slate-500">
                      Proporcione una justificación clara y detallada para su solicitud.
                    </p>
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-[#091540]">Documentos de respaldo</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FileField
                name="fotocopiaCedula"
                label="1. Fotocopia de cédula"
                description="Fotocopia clara de la cédula del solicitante."
              />
              <FileField
                name="copiaPlano"
                label="2. Copia del plano"
                description="Plano de la propiedad o construcción relacionada."
              />
              <div className="md:col-span-2">
                <FileField
                  name="literalCerfication"
                  label="3. Certificación literal"
                  description="Documento emitido por el Registro que certifique la titularidad."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]"
                  disabled={!canSubmit || isSubmitting || isUploading}
                >
                  {isSubmitting || isUploading ? uploadProgress || "Procesando..." : "Crear Solicitud"}
                </Button>
              )}
            </form.Subscribe>
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            
          </div>
        </form>
      )}
    </div>
  );
}
