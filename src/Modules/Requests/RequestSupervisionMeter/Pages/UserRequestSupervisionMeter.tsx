import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { UserRound } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { useCreateSupervisionMeterRequest } from "../../../Request-Abonados/Hooks/Supervision-Meter/SupervionMeterHooks";
import ListReqSupervisionMeterUser from "../../../Request-Abonados/Pages/SupervisionMeter/ListReqSupervisionMeterUser";
import { CreateSupervisionMeterRequestAbonadoSchema } from "../schemas/CreateSupervisionMeterRequestAbonadoSchema";

const getFieldErrorMessage = (error: unknown) =>
  typeof error === "object" && error !== null && "message" in error
    ? String((error as { message?: string }).message ?? "Valor inválido")
    : String(error);

export default function UserRequestSupervisionMeter() {
  const [viewMode, setViewMode] = useState<"create" | "list">("create");
  const createMutation = useCreateSupervisionMeterRequest();
  const { UserProfile } = useGetUserProfile();

  const form = useForm({
    defaultValues: {
      Location: "",
      NIS: 0,
      Justification: "",
      UserId: Number(UserProfile?.Id) || 0,
    },
    validators: {
      onChange: CreateSupervisionMeterRequestAbonadoSchema,
      onSubmit: CreateSupervisionMeterRequestAbonadoSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createMutation.mutateAsync({
          Location: value.Location.trim(),
          NIS: Number(value.NIS) || 0,
          Justification: value.Justification.trim(),
          UserId: Number(value.UserId) || 0,
        });
        formApi.reset();
      } catch (error) {
        console.error(
          "Error al crear la solicitud de supervisión de medidor",
          error,
        );
      }
    },
  });

  useEffect(() => {
    const nisArray = Array.isArray(UserProfile?.Nis) ? UserProfile.Nis : [];
    form.setFieldValue("UserId", Number(UserProfile?.Id) || 0);

    if (nisArray.length === 1) {
      form.setFieldValue("NIS", Number(nisArray[0]) || 0);
    } else if (nisArray.length === 0) {
      form.setFieldValue("NIS", 0);
    }
  }, [UserProfile, form]);

  const handleClose = () => {
    toast.warning("Solicitud cancelada");
    form.reset();
  };

  const availableNis = Array.isArray(UserProfile?.Nis) ? UserProfile.Nis : [];

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="border border-slate-200 bg-white text-[#091540] shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {viewMode === "create"
                ? "Solicitud de revisión de medidor"
                : "Mis solicitudes de revisión de medidor"}
            </h1>
            <p className="text-sm text-[#091540]/70">
              {viewMode === "create"
                ? "Complete la ubicación, seleccione el NIS y justifique la solicitud."
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
        <ListReqSupervisionMeterUser />
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
                      {availableNis.length > 0 ? (
                        <>
                          {" "}
                          • NIS:{" "}
                          <span className="font-mono">
                            {availableNis.join(", ")}
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
            </CardContent>
          </Card>

          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-[#091540]">
                Contenido de la solicitud
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form.Field name="Location">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="request-supervision-meter-location">
                      Ubicación del medidor <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="request-supervision-meter-location"
                      autoFocus
                      className="min-h-[120px] resize-none rounded-none"
                      placeholder="Ej. 200m este de la plaza central, casa color verde..."
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                    {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 ? (
                      <p className="text-sm text-red-500">
                        {getFieldErrorMessage(field.state.meta.errors[0])}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              {availableNis.length <= 1 ? (
                <form.Field name="NIS">
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="request-supervision-meter-nis">NIS</Label>
                      <input
                        id="request-supervision-meter-nis"
                        type="text"
                        value={
                          availableNis.length === 1
                            ? String(availableNis[0])
                            : "No tiene NIS registrado"
                        }
                        readOnly
                        disabled
                        className="h-10 border border-input bg-muted px-3 text-sm text-slate-600"
                      />
                      {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 ? (
                        <p className="text-sm text-red-500">
                          {getFieldErrorMessage(field.state.meta.errors[0])}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>
              ) : (
                <form.Field name="NIS">
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="request-supervision-meter-nis-select">
                        Seleccione NIS <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="request-supervision-meter-nis-select"
                        className="h-10 border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-ring"
                        value={field.state.value || ""}
                        onChange={(event) =>
                          field.handleChange(Number(event.target.value))
                        }
                      >
                        <option value="">Seleccione una opción</option>
                        {availableNis.map((nis) => (
                          <option key={nis} value={nis}>
                            {nis}
                          </option>
                        ))}
                      </select>
                      {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 ? (
                        <p className="text-sm text-red-500">
                          {getFieldErrorMessage(field.state.meta.errors[0])}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>
              )}

              <form.Field name="Justification">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="request-supervision-meter-justification">
                      Justificación <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="request-supervision-meter-justification"
                      className="min-h-[180px] resize-none rounded-none"
                      placeholder="Describa el motivo por el cual solicita la supervisión del medidor."
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 ? (
                      <p className="text-sm text-red-500">
                        {getFieldErrorMessage(field.state.meta.errors[0])}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="submit"
                  className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]"
                  disabled={!canSubmit || isSubmitting || createMutation.isPending}
                >
                  {isSubmitting || createMutation.isPending
                    ? "Creando solicitud..."
                    : "Crear Solicitud"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none"
                  onClick={handleClose}
                  disabled={isSubmitting || createMutation.isPending}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      )}
    </div>
  );
}
