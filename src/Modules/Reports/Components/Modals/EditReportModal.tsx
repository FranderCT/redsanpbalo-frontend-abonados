import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import { useUpdateReport } from "../../Hooks/ReportsHooks";
import { useGetAllReportStates } from "../../Hooks/ReportStatesHooks";
import { useGetAllReportTypes } from "../../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../../Hooks/ReportLocationHooks";
import { useGetUsersByRoleFontanero } from "../../../Users/Hooks/UsersHooks";
import type { Report } from "../../Models/Report";
import { updateReportValidators } from "../../schemas/ReportSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditReportModalProps {
  report: Report;
  open: boolean;
  onClose: () => void;
}

export default function EditReportModal({
  report,
  open,
  onClose,
}: EditReportModalProps) {
  const updateReportMutation = useUpdateReport();

  const { reportStates = [], isLoading: statesLoading } = useGetAllReportStates();
  const { reportTypes = [], isLoading: typesLoading } = useGetAllReportTypes();
  const { reportLocations = [], isLoading: locationsLoading } =
    useGetAllReportLocations();
  const { fontaneros = [], isPending: fontanerosLoading } =
    useGetUsersByRoleFontanero();

  const form = useForm({
    defaultValues: {
      Location: report.Location || "",
      Description: report.Description || "",
      LocationId: report.ReportLocation?.Id || 0,
      ReportTypeId: report.ReportType?.Id || 0,
      ReportStateId: report.ReportState?.IdReportState || 0,
      UserInChargeId: report.UserInCharge?.Id || 0,
      AdditionalInfo: report.AdditionalInfo || "",
    },
    validators: {
      onChange: updateReportValidators,
      onSubmit: updateReportValidators,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        Location: value.Location,
        Description: value.Description,
        LocationId: Number(value.LocationId) || undefined,
        ReportTypeId: Number(value.ReportTypeId) || undefined,
        ReportStateId: Number(value.ReportStateId) || undefined,
        UserInChargeId: Number(value.UserInChargeId) || undefined,
        AdditionalInfo: value.AdditionalInfo || undefined,
      };

      try {
        await updateReportMutation.mutateAsync({
          reportId: report.Id.toString(),
          payload,
        });
        toast.success("¡Reporte actualizado exitosamente!");
        form.reset();
        onClose();
      } catch (error) {
        toast.error("Error al actualizar el reporte");
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (open && report) {
      form.setFieldValue("Location", report.Location || "");
      form.setFieldValue("Description", report.Description || "");
      form.setFieldValue("LocationId", report.ReportLocation?.Id || 0);
      form.setFieldValue("ReportTypeId", report.ReportType?.Id || 0);
      form.setFieldValue("ReportStateId", report.ReportState?.IdReportState || 0);
      form.setFieldValue("UserInChargeId", report.UserInCharge?.Id || 0);
      form.setFieldValue("AdditionalInfo", report.AdditionalInfo || "");
    }
  }, [open, report]);

  const isLoading =
    statesLoading || typesLoading || locationsLoading || fontanerosLoading;

  const formatErrors = (errors: unknown[]) =>
    errors?.map((e) =>
      typeof e === "object" && e !== null && "message" in e
        ? { message: (e as { message: string }).message }
        : { message: String(e) }
    );

  const ReportField = form.Field;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          form.reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Editar reporte #{report.Id}</DialogTitle>
          <DialogDescription>
            Modifica la información del reporte según sea necesario.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center px-6 py-10">
            <p className="text-sm text-muted-foreground">
              Cargando información...
            </p>
          </div>
        ) : (
          <form
            id="edit-report-form"
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto overflow-x-hidden px-6 py-4">
              <FieldGroup className="gap-4">
                <ReportField
                  name="Location"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Ubicación</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Ej: Calle principal, casa #123"
                        />
                        {isInvalid && (
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="Description"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Describe detalladamente el problema..."
                          rows={3}
                          className="resize-none"
                        />
                        {isInvalid && (
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="LocationId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Barrio</FieldLabel>
                        <Select
                          value={
                            field.state.value === 0
                              ? ""
                              : String(field.state.value)
                          }
                          onValueChange={(v) => field.handleChange(Number(v))}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue placeholder="Seleccionar barrio" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportLocations.map((loc) => (
                              <SelectItem
                                key={loc.Id}
                                value={String(loc.Id)}
                              >
                                {loc.Neighborhood}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="ReportTypeId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>
                          Tipo de reporte
                        </FieldLabel>
                        <Select
                          value={
                            field.state.value === 0
                              ? ""
                              : String(field.state.value)
                          }
                          onValueChange={(v) => field.handleChange(Number(v))}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportTypes.map((type) => (
                              <SelectItem
                                key={type.Id}
                                value={String(type.Id)}
                              >
                                {type.Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="ReportStateId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
                        <Select
                          value={
                            field.state.value === 0
                              ? ""
                              : String(field.state.value)
                          }
                          onValueChange={(v) => field.handleChange(Number(v))}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportStates.map((state) => (
                              <SelectItem
                                key={state.IdReportState}
                                value={String(state.IdReportState)}
                              >
                                {state.Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="UserInChargeId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>
                          Fontanero encargado (opcional)
                        </FieldLabel>
                        <Select
                          value={String(field.state.value)}
                          onValueChange={(v) => field.handleChange(Number(v))}
                          disabled={fontanerosLoading}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue
                              placeholder={
                                fontanerosLoading
                                  ? "Cargando..."
                                  : "Sin asignar"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Sin asignar</SelectItem>
                            {fontaneros.map((f) => (
                              <SelectItem key={f.Id} value={String(f.Id)}>
                                {f.Name} {f.Surname1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="AdditionalInfo"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>
                          Información adicional
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value)
                          }
                          aria-invalid={isInvalid}
                          placeholder="Información adicional sobre el reporte..."
                          rows={2}
                          className="resize-none"
                        />
                        {isInvalid && (
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              <div className="rounded-lg border bg-muted/40 px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  Reportado por: {report.User.Name} {report.User.Surname1}
                </p>
                <p className="text-xs text-muted-foreground">
                  {report.User.Email}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fecha de creación:{" "}
                  {new Date(report.CreatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row-reverse">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      form="edit-report-form"
                      disabled={!canSubmit || isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting
                        ? "Actualizando..."
                        : "Actualizar reporte"}
                    </Button>
                  </div>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
