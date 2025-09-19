import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { useCreateSupplier, useGetAllSupplier } from "../../Hooks/SupplierHooks";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { newSupplierInitialState } from "../../Models/Supplier";
import { useCreateAgentSupplier } from "../../Hooks/AgentSupplierHooks";

const steps = [
  { label: "Datos Básicos" },
  { label: "Detalles" },
  { label: "Confirmación" },
];

const CreateSupplier = () => {
  const [step, setStep] = useState(0);
  const createSupplierMutation = useCreateSupplier();
  const createAgentSupplierMutation = useCreateAgentSupplier();


  const form = useForm({
    defaultValues: newSupplierInitialState,
    onSubmit: async ({ value, formApi }) => {
      try {
        await createSupplierMutation.mutateAsync(value);
        formApi.reset();
        toast.success("¡Proveedor creado exitosamente!", { position: "top-right", autoClose: 3000 });
        setStep(0);
      } catch (err) {
        console.error("error al crear un proveedor", err);
        toast.error("¡Error al crear el proveedor!", { position: "top-right", autoClose: 3000 });
      }
    },
  });

  const renderStepFields = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-6" key="step-0">
            {/* Nombre */}
            <form.Field key="Name" name="Name">
              {(field) => (
                <>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Nombre del proveedor</span>
                  <input
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                    placeholder="Ingrese el nombre del proveedor"
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
                </>
              )}
            </form.Field>
            {/* correo electronico */}
            <form.Field key="Email" name="Email">
              {(field) => (
                <>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Correo electrónico</span>
                  <input
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Ingrese el correo electrónico del proveedor"
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
                </>
              )}
            </form.Field>
            {/* Fechas en la misma fila */}
            <form.Field key="PhoneNumber" name="PhoneNumber">
            {(field) => (
                <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[#091540]">Teléfono</span>
                <div className="px-0 py-0 border border-gray-300 focus-within:border-blue-500 transition">
                    {/* Si tu <PhoneField> ya trae su propio input, lo envolvemos para mantener el borde/estilo */}
                    <PhoneField
                    value={field.state.value ?? ""}
                    onChange={(val) => field.handleChange(val ?? "")}
                    defaultCountry="CR"
                    required
                    error={
                        field.state.meta.isTouched && field.state.meta.errors[0]
                        ? String(field.state.meta.errors[0])
                        : undefined
                    }
                    />
                </div>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                )}
                </label>
            )}
            </form.Field>
            {/* {Direccion} */}
            <form.Field key="Location" name="Location">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Dirección</span>
                  <textarea
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Ingrese la dirección del proveedor"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    rows={3}
                  />
                </label>
              )}
            </form.Field>
          </div>
        );
    //   case 1:
        // return (
        //   <div className="flex flex-col gap-6" key="step-1">
        //     {/* Objetivo */}
        //     <form.Field key="Objective" name="Objective">
        //       {(field) => (
        //         <label className="flex flex-col gap-1">
        //           <span className="text-sm font-medium text-[#091540]">Objetivo del proyecto</span>
        //           <textarea
        //             className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
        //             placeholder="Objetivo"
        //             value={field.state.value}
        //             onChange={(e) => field.handleChange(e.target.value)}
        //             rows={3}
        //             required
        //           />
        //         </label>
        //       )}
        //     </form.Field>
        //     {/* Descripción */}
        //     <form.Field key="Description" name="Description">
        //       {(field) => (
        //         <label className="flex flex-col gap-1">
        //           <span className="text-sm font-medium text-[#091540]">Descripción del proyecto</span>
        //           <textarea
        //             className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
        //             placeholder="Descripción"
        //             value={field.state.value}
        //             onChange={(e) => field.handleChange(e.target.value)}
        //             rows={3}
        //             required
        //           />
        //         </label>
        //       )}
        //     </form.Field>
        //     {/* Observación */}
        //     <form.Field key="Observation" name="Observation">
        //       {(field) => (
        //         <label className="flex flex-col gap-1">
        //           <span className="text-sm font-medium text-[#091540]">Observaciones del proyecto</span>
        //           <textarea
        //             className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
        //             placeholder="Observaciones"
        //             value={field.state.value}
        //             onChange={(e) => field.handleChange(e.target.value)}
        //             rows={3}
        //           />
        //         </label>
        //       )}
        //     </form.Field>
        //     {/* Espacio de documento */}
        //     <form.Field key="SpaceOfDocument" name="SpaceOfDocument">
        //       {(field) => (
        //         <label className="flex flex-col gap-1">
        //           <span className="text-sm font-medium text-[#091540]">Espacio de documento</span>
        //           <input
        //             className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
        //             placeholder="Espacio de documento"
        //             value={field.state.value}
        //             onChange={(e) => field.handleChange(e.target.value)}
        //           />
        //         </label>
        //       )}
        //     </form.Field>

            {/* <form.Field name="ProjectStateId">
              {(field) => (
                <>
                  <label className="grid gap-1">
                    <select
                      className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      disabled={projectStatesLoading}
                    >
                      <option value={0} disabled>
                        {projectStatesLoading ? "Cargando estados de proyecto..." : "Seleccione estado de proyecto"}
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
                </>
              )}
            </form.Field> */}

        //   </div>
        // );
    //   case 2:
    //     return (
    //       <div className="text-[#091540] space-y-2 px-2" key="step-2">
    //         <h3 className="text-lg font-semibold mb-2">Confirma los datos antes de registrar el proyecto:</h3>
    //         <form.Subscribe selector={(state) => state.values}>
    //           {(values) => (
    //             <ul className="text-base space-y-1">
    //               <li><b>Nombre:</b> {values.Name}</li>
    //               <li><b>Ubicación:</b> {values.Location}</li>
    //               <li><b>Fecha de inicio:</b> {values.InnitialDate ? new Date(values.InnitialDate).toLocaleDateString() : ""}</li>
    //               <li><b>Fecha de fin:</b> {values.EndDate ? new Date(values.EndDate).toLocaleDateString() : ""}</li>
    //               <li><b>Objetivo:</b> {values.Objective}</li>
    //               <li><b>Descripción:</b> {values.Description}</li>
    //               <li><b>Observación:</b> {values.Observation}</li>
    //               <li><b>Espacio de documento:</b> {values.SpaceOfDocument}</li>
    //             </ul>
    //           )}
    //         </form.Subscribe>
    //       </div>
    //     );
    //   default:
    //     return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-2 text-[#091540] text-center tracking-tight">
        {steps[step].label}
      </h2>
      <div className="flex items-center justify-center mb-6 gap-3">
        {steps.map((s, idx) => (
          <div key={s.label} className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${step === idx ? "bg-blue-600 border-blue-600" : "bg-white border-blue-300"}
              `}
            >
              <span className={`block w-2 h-2 rounded-full ${step === idx ? "bg-white" : "bg-blue-300"}`}></span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-8 h-0.5 bg-blue-200 mx-1"></div>
            )}
          </div>
        ))}
      </div>
      <span className="block mt-4 mb-6 text-center text-lg  tracking-wide  text-[#091540]">
        Rellene los siguientes datos para registrar un nuevo proveedor
      </span>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < steps.length - 1) {
            setStep(step + 1);
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
                  className="px-6 py-2 border border-gray-300 text-[#091540]  hover:border-blue-400 hover:text-blue-700 transition"
                  onClick={() => setStep(step - 1)}
                >
                  Atrás
                </button>
              ) : <div />}
              <button
                type="submit"
                className="px-6 py-2 border border-[#091540] bg-[#091540] text-white  hover:bg-white hover:text-[#091540] hover:border-[#091540] transition disabled:opacity-60"
                disabled={step === steps.length - 1 ? !canSubmit || isSubmitting : false}
              >
                {step === steps.length - 1
                  ? isSubmitting ? "Creando..." : "Crear Proveedor"
                  : "Siguiente"}
              </button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default CreateSupplier;
