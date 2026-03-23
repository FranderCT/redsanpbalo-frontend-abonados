import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FileText, Upload, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useCreateAssociatedRequest } from "../../../Request-Abonados/Hooks/Associated/AssociatedRqHooks";
import ListReqAssociateUser from "../../../Request-Abonados/Pages/Associated-rq/ListRequestAssociatedUsers";
import { UploadAssociatedFiles } from "../../../Upload-files/Services/ProjectFileServices";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { CreateAssociatedRequestAbonadoSchema } from "../schemas/CreateAssociatedRequestAbonadoSchema";
import { getAssociatedRequestPrimaryNis } from "../utils/associatedRequestForm";

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
          ? parseInt(retryAfter, 10) * 1000
          : Math.min(baseDelay * Math.pow(2, attempt), 10000);

        if (attempt < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.max(delayMs, 500)),
          );
          continue;
        }
      }

      throw error;
    }
  }

  throw new Error("No se pudo completar la subida de archivos.");
};

export function UserRequestAssociated() {
  const createAssociatedRequestMutation = useCreateAssociatedRequest();
  const { UserProfile } = useGetUserProfile();
  const [viewMode, setViewMode] = useState<"create" | "list">("create");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const form = useForm({
    defaultValues: {
      Justification: "",
      NIS: getAssociatedRequestPrimaryNis(UserProfile ?? null),
      evidenciaBoletaFirmada: [] as File[],
      UserId: Number(UserProfile?.Id) || 0,
    },
    validators: {
      onChange: CreateAssociatedRequestAbonadoSchema,
      onSubmit: CreateAssociatedRequestAbonadoSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const requestData = {
          Justification: value.Justification.trim(),
          NIS: Number(value.NIS) || 0,
          UserId: Number(value.UserId) || 0,
        };

        if (requestData.UserId <= 0) {
          toast.error("No se pudo identificar el abonado actual.");
          return;
        }

        const requestResult =
          await createAssociatedRequestMutation.mutateAsync(requestData);
        const requestId = requestResult?.Id;

        if (!requestId) {
          throw new Error("No se obtuvo el ID de la solicitud creada.");
        }

        if (value.evidenciaBoletaFirmada.length > 0) {
          setIsUploading(true);
          setUploadProgress("Subiendo evidencia...");

          try {
            await uploadWithRetry(() =>
              UploadAssociatedFiles(
                requestId,
                value.evidenciaBoletaFirmada,
                "Evidencia-Boleta-Firmada",
                UserProfile?.Id,
              ),
            );

            toast.success(
              "Solicitud creada y evidencia de boleta firmada subida exitosamente",
              {
                position: "top-right",
                autoClose: 3000,
              },
            );
          } catch (uploadError) {
            console.error("Error subiendo evidencia:", uploadError);
            toast.error(
              "Solicitud creada, pero hubo un error al subir la evidencia. Intente subirla más tarde.",
              {
                position: "top-right",
                autoClose: 5000,
              },
            );
          }
        } else {
          toast.success("Solicitud de asociado creada exitosamente", {
            position: "top-right",
            autoClose: 3000,
          });
        }

        formApi.reset();
        setUploadProgress("");
        setViewMode("list");
      } catch (error) {
        console.error("Error al crear la solicitud de asociado", error);
        toast.error("Error al crear la solicitud. Intente nuevamente.", {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setIsUploading(false);
        setUploadProgress("");
      }
    },
  });

  useEffect(() => {
    if (!UserProfile) return;

    const nextUserId = Number(UserProfile.Id) || 0;
    const nextNis = getAssociatedRequestPrimaryNis(UserProfile);

    if (nextUserId > 0 && form.getFieldValue("UserId") !== nextUserId) {
      form.setFieldValue("UserId", nextUserId);
    }

    if (nextNis > 0 && form.getFieldValue("NIS") !== nextNis) {
      form.setFieldValue("NIS", nextNis);
    }
  }, [UserProfile, form]);

  const handleClose = () => {
    toast.warning("Solicitud cancelada", {
      position: "top-right",
      autoClose: 3000,
    });
    form.reset();
    setIsUploading(false);
    setUploadProgress("");
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="border border-slate-200 bg-white text-[#091540] shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {viewMode === "create"
                ? "Solicitud de asociación"
                : "Mis solicitudes de asociación"}
            </h1>
            <p className="text-sm text-[#091540]/70">
              {viewMode === "create"
                ? "Complete la justificación y adjunte evidencia si corresponde."
                : "Revise el historial y el estado actual de sus solicitudes."}
            </p>
          </div>

          <div className="inline-flex items-center self-start border border-slate-200 bg-slate-100 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("create")}
              aria-pressed={viewMode === "create"}
              className={`h-10 px-4 text-sm font-medium transition-all ${
                viewMode === "create"
                  ? "bg-[#091540] text-white shadow"
                  : "bg-transparent text-[#091540] hover:bg-white"
              }`}
            >
              Nueva solicitud
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              className={`h-10 px-4 text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "bg-[#091540] text-white shadow"
                  : "bg-transparent text-[#091540] hover:bg-white"
              }`}
            >
              Ver mis solicitudes
            </button>
          </div>
        </div>
      </section>

      {viewMode === "list" ? (
        <ListReqAssociateUser />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-[#091540]">
                Datos del abonado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {UserProfile ? (
                <div className="flex items-start gap-3 border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#091540]/10 text-[#091540]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-slate-900">
                      {UserProfile.Name} {UserProfile.Surname1}{" "}
                      {UserProfile.Surname2}
                    </div>
                    <div className="text-slate-600">
                      Cédula:{" "}
                      <span className="font-mono">
                        {UserProfile.IDcard ?? "—"}
                      </span>
                      {Array.isArray(UserProfile.Nis) &&
                      UserProfile.Nis.length > 0 ? (
                        <>
                          {" "}
                          • NIS:{" "}
                          <span className="font-mono">
                            {UserProfile.Nis.join(", ")}
                          </span>
                        </>
                      ) : null}
                    </div>
                    {UserProfile.Email ? (
                      <div className="text-slate-600">
                        Correo: {UserProfile.Email}
                      </div>
                    ) : null}
                    {UserProfile.Address ? (
                      <div className="text-slate-600">
                        Dirección: {UserProfile.Address}
                      </div>
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
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 ? (
                    <p className="text-sm text-red-500">
                      {getFieldErrorMessage(field.state.meta.errors[0])}
                    </p>
                  ) : null
                }
              </form.Field>
              <form.Field name="NIS">
                {(field) =>
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 ? (
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
              <CardTitle className="text-base text-[#091540]">
                Contenido de la solicitud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.Field name="Justification">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="request-associated-user-justification">
                      Justificación de la solicitud de asociado{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="request-associated-user-justification"
                      autoFocus
                      className="min-h-[180px] resize-none rounded-none"
                      placeholder="Describa el motivo de su solicitud para ser asociado"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                    {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 ? (
                      <p className="text-sm text-red-500">
                        {getFieldErrorMessage(field.state.meta.errors[0])}
                      </p>
                    ) : null}
                    <p className="text-xs text-slate-500">
                      Proporcione una justificación clara y detallada para su
                      solicitud.
                    </p>
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-[#091540]">
                Documentos de respaldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.Field name="evidenciaBoletaFirmada">
                {(field) => (
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">
                        Evidencia de boleta firmada{" "}
                        <span className="text-xs text-slate-500">
                          (Opcional)
                        </span>
                      </Label>
                      <label className="block cursor-pointer border-2 border-dashed border-slate-300 p-8 text-center transition-all hover:border-[#1789FC] hover:bg-sky-50/30">
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-500">
                            <Upload className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              Seleccionar archivos
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              PDF, DOC, JPG, PNG (Máx. 10MB c/u)
                            </p>
                          </div>
                        </div>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => {
                            if (!e.target.files) return;
                            const validFiles = Array.from(
                              e.target.files,
                            ).filter((file) => {
                              if (file.size > 10 * 1024 * 1024) {
                                toast.error(
                                  `El archivo "${file.name}" excede el tamaño máximo de 10MB`,
                                );
                                return false;
                              }
                              return true;
                            });
                            field.handleChange(validFiles);
                          }}
                        />
                      </label>
                    </div>

                    {field.state.value.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">
                          Archivos seleccionados
                        </p>
                        {field.state.value.map((file: File, index: number) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between border border-slate-200 bg-slate-50 p-3"
                          >
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900">
                                  {file.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="rounded-none text-red-600 hover:text-red-700"
                              onClick={() =>
                                field.handleChange(
                                  field.state.value.filter(
                                    (_: File, i: number) => i !== index,
                                  ),
                                )
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]"
                  disabled={!canSubmit || isSubmitting || isUploading}
                >
                  {isSubmitting || isUploading
                    ? uploadProgress || "Procesando..."
                    : "Crear Solicitud"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      )}
    </div>
  );
}
