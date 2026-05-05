import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { RegisterUserInitialState, TypeDNI } from '../Models/RegisterUser';

import { RegisterSchema } from '../schemas/RegisterSchemas';
import { toast } from 'sonner';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCreateAbonado } from '../Hooks/AuthHooks';
import PhoneField from '../../../Components/PhoneNumber/PhoneField';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { ChevronLeft } from 'lucide-react';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/Components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';

const ID_LABELS: Record<string, { label: string; placeholder: string }> = {
  [TypeDNI.Cedula]:    { label: 'Cédula',                      placeholder: 'Ingresa tu cédula' },
  [TypeDNI.Pasaporte]: { label: 'Número de pasaporte',          placeholder: 'Ingresa tu número de pasaporte' },
  [TypeDNI.Otro]:      { label: 'Número de identificación',     placeholder: 'Ingresa tu número de identificación' },
};

const RegisterAbonados = () => {
  const [tempNis, setTempNis] = useState('');
  const createUserMutation = useCreateAbonado();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: RegisterUserInitialState,
    validators: { onChange: RegisterSchema },
    onSubmit: async ({ value }) => {
      try {
        const { IsAbonado, ...userData } = value;
        await createUserMutation.mutateAsync(userData);
        toast.success('¡Registro exitoso!', { position: 'top-right', duration: 3000 });
        navigate({ to: '/login' });
        form.reset();
      } catch (error: any) {
        console.log('error', error);
        toast.error('¡Registro denegado!', { position: 'top-right', duration: 3000 });
        form.reset();
      }
    },
  });

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg border border-slate-200">
        <CardHeader className="relative pb-3">
          <div className="flex absolute top-3 left-3">
            <Link
              to="/"
              className="hover:underline underline-offset-4 inline-flex items-center gap-2 text-xs px-3 py-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Volver</span>
            </Link>
          </div>

          <div className="mt-8 flex justify-center items-center">
            <img
              src="/LogoRedSanPabloHG.png"
              alt="Logo ASADA"
              className="h-16 w-auto object-contain"
            />
          </div>

          <CardTitle className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Crear cuenta
          </CardTitle>
          <p className="text-center text-sm text-slate-600 mt-2">
            Completa el formulario para registrarte
          </p>
        </CardHeader>

        <CardContent className="pt-2">
          <form
            id="register-form"
            onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
            className="space-y-4"
          >
            <FieldGroup className="gap-4">

              {/* Tipo de identificación */}
              <form.Field name="TypeDNI">
                {(field) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor="type-dni">
                      Tipo de identificación
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) => {
                        field.handleChange(v as TypeDNI);
                        // Limpiar campos al cambiar tipo
                        form.setFieldValue('IDcard', '');
                        form.setFieldValue('Name', '');
                        form.setFieldValue('Surname1', '');
                        form.setFieldValue('Surname2', '');
                      }}
                    >
                      <SelectTrigger id="type-dni" className="h-10">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TypeDNI.Cedula}>Cédula</SelectItem>
                        <SelectItem value={TypeDNI.Pasaporte}>Pasaporte</SelectItem>
                        <SelectItem value={TypeDNI.Otro}>Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      {field.state.value === TypeDNI.Cedula
                        ? 'Tu nombre se cargará automáticamente al ingresar la cédula.'
                        : 'Deberás ingresar tu nombre y apellidos manualmente.'}
                    </p>
                  </Field>
                )}
              </form.Field>

              {/* IDcard + Nombre/Apellidos (condicional según TypeDNI) */}
              <form.Subscribe selector={(s) => s.values.TypeDNI}>
                {(typeDNI) => {
                  const isCedula = typeDNI === TypeDNI.Cedula;
                  const idMeta = ID_LABELS[typeDNI] ?? ID_LABELS[TypeDNI.Cedula];

                  return (
                    <>
                      {/* Número de identificación */}
                      <form.Field name="IDcard">
                        {(field) => {
                          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid} className="gap-2">
                              <FieldLabel htmlFor="idcard">
                                {idMeta.label}
                              </FieldLabel>
                              <Input
                                id="idcard"
                                placeholder={idMeta.placeholder}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={async (e) => {
                                  const value = e.target.value;
                                  field.handleChange(value);

                                  // Solo buscar en la API para cédulas costarricenses
                                  if (isCedula && value.length >= 9) {
                                    try {
                                      const res = await fetch(`https://apis.gometa.org/cedulas/${value}`);
                                      if (!res.ok) throw new Error('No se encontró este número de cédula');
                                      const data = await res.json();

                                      if (data?.results && data.results.length > 0) {
                                        const person = data.results[0];
                                        const apellido1 = person.lastname1 || '';
                                        const apellido2 = person.lastname2 || '';
                                        const fn1 = (person.firstname || '').trim().replace(/\s+/g, ' ');
                                        const fn2 = (person.firstname2 || '').trim();
                                        const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                        const nombre = fn2 && new RegExp(`\\b${esc(fn2)}\\b`, 'i').test(fn1)
                                          ? fn1
                                          : [fn1, fn2].filter(Boolean).join(' ').trim();

                                        form.setFieldValue('Name', nombre);
                                        form.setFieldValue('Surname1', apellido1);
                                        form.setFieldValue('Surname2', apellido2);
                                      }
                                    } catch (err) {
                                      console.warn('Error buscando cédula:', err);
                                      form.setFieldValue('Name', '');
                                      form.setFieldValue('Surname1', '');
                                      form.setFieldValue('Surname2', '');
                                    }
                                  }
                                }}
                                aria-invalid={isInvalid}
                                className="h-10"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>

                      {/* Nombre */}
                      <form.Field name="Name">
                        {(field) => {
                          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid} className="gap-2">
                              <FieldLabel htmlFor="name">
                                Nombre{!isCedula && <span className="text-red-500 ml-0.5">*</span>}
                              </FieldLabel>
                              <Input
                                id="name"
                                placeholder={isCedula ? 'Se cargará automáticamente' : 'Ingresa tu nombre'}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                disabled={isCedula}
                                aria-invalid={isInvalid}
                                className={`h-10 ${isCedula ? 'bg-slate-50 text-slate-500' : ''}`}
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>

                      {/* Apellidos */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <form.Field name="Surname1">
                          {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid} className="gap-2">
                                <FieldLabel htmlFor="surname1">
                                  Apellido 1{!isCedula && <span className="text-red-500 ml-0.5">*</span>}
                                </FieldLabel>
                                <Input
                                  id="surname1"
                                  placeholder={isCedula ? 'Se cargará automáticamente' : 'Ingresa tu primer apellido'}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  disabled={isCedula}
                                  aria-invalid={isInvalid}
                                  className={`h-10 ${isCedula ? 'bg-slate-50 text-slate-500' : ''}`}
                                />
                                {isInvalid && (
                                  <FieldError errors={field.state.meta.errors} />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>

                        <form.Field name="Surname2">
                          {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid} className="gap-2">
                                <FieldLabel htmlFor="surname2">
                                  Apellido 2
                                </FieldLabel>
                                <Input
                                  id="surname2"
                                  placeholder={isCedula ? 'Se cargará automáticamente' : 'Ingresa tu segundo apellido (opcional)'}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  disabled={isCedula}
                                  aria-invalid={isInvalid}
                                  className={`h-10 ${isCedula ? 'bg-slate-50 text-slate-500' : ''}`}
                                />
                                {isInvalid && (
                                  <FieldError errors={field.state.meta.errors} />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>
                      </div>
                    </>
                  );
                }}
              </form.Subscribe>

              {/* Soy abonado */}
              <form.Field name="IsAbonado">
                {(field) => (
                  <label className="group flex items-center cursor-pointer select-none mt-2">
                    <input
                      type="checkbox"
                      checked={!!field.state.value}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        field.handleChange(checked);
                        if (!checked) {
                          form.setFieldValue('Nis', []);
                          setTempNis('');
                        }
                      }}
                      className="hidden peer"
                    />
                    <span className="relative w-4 h-4 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md transition-all duration-300 peer-checked:border-blue-500 peer-checked:bg-blue-500" />
                    <span className="ml-3 text-gray-700 font-medium duration-300">
                      Soy abonado
                    </span>
                  </label>
                )}
              </form.Field>

              {/* NIS - Array de números */}
              <form.Subscribe selector={(s) => s.values.IsAbonado ?? false}>
                {(isAbonado) => (
                  <form.Field name="Nis">
                    {(field) => {
                      const nisList: number[] = field.state.value ?? [];

                      const addNis = () => {
                        const trimmed = tempNis.trim();
                        if (!trimmed || !/^\d{1,10}$/.test(trimmed)) {
                          toast.error('El NIS debe tener entre 1 y 10 dígitos numéricos');
                          return;
                        }
                        const nisNum = Number(trimmed);
                        if (nisList.includes(nisNum)) {
                          toast.warning('Este NIS ya está agregado');
                          return;
                        }
                        field.handleChange([...nisList, nisNum]);
                        setTempNis('');
                      };

                      const removeNis = (nis: number) => {
                        field.handleChange(nisList.filter(n => n !== nis));
                      };

                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid && isAbonado;

                      return (
                        <Field data-invalid={isInvalid} className="gap-2">
                          <FieldLabel>NIS (Números de identificación)</FieldLabel>

                          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50 border border-slate-200 rounded-md">
                            {nisList.length === 0 && (
                              <span className="text-xs text-gray-400">
                                {isAbonado ? 'Agregue al menos un NIS' : 'Sin NIS asignados'}
                              </span>
                            )}
                            {nisList.map((nis) => (
                              <span
                                key={nis}
                                className="inline-flex items-center gap-2 bg-blue-700 text-white px-3 py-1 text-sm rounded"
                              >
                                {nis}
                                <button
                                  type="button"
                                  onClick={() => removeNis(nis)}
                                  disabled={!isAbonado}
                                  className="hover:text-red-300 font-bold disabled:opacity-50"
                                  title="Eliminar NIS"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>

                          {isAbonado && (
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                value={tempNis}
                                onChange={(e) => setTempNis(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addNis();
                                  }
                                }}
                                placeholder="Ingresa un NIS y presiona Enter"
                                className="flex-1 h-10"
                              />
                              <Button
                                type="button"
                                onClick={addNis}
                                className="px-4 bg-blue-600 hover:bg-blue-700"
                              >
                                Agregar
                              </Button>
                            </div>
                          )}

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                )}
              </form.Subscribe>

              {/* Email */}
              <form.Field name="Email">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor="email">
                        Correo electrónico
                      </FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="h-10"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Teléfono */}
              <form.Field name="PhoneNumber">
                {(field) => (
                  <div>
                    <PhoneField
                      value={field.state.value}
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
                )}
              </form.Field>

              {/* Fecha de nacimiento */}
              <form.Field name="Birthdate">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor="birthdate">
                        Fecha de nacimiento
                      </FieldLabel>
                      <Input
                        id="birthdate"
                        type="date"
                        value={
                          field.state.value instanceof Date && !Number.isNaN(field.state.value.getTime())
                            ? field.state.value.toISOString().slice(0, 10)
                            : typeof field.state.value === 'string'
                            ? field.state.value
                            : ''
                        }
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(new Date(e.target.value));
                        }}
                        aria-invalid={isInvalid}
                        className="h-10"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Dirección */}
              <form.Field name="Address">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor="address">
                        Dirección
                      </FieldLabel>
                      <Textarea
                        id="address"
                        placeholder="Ingresa tu dirección..."
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        rows={3}
                        aria-invalid={isInvalid}
                        className="resize-none"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Contraseña */}
              <form.Field name="Password">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor="password">
                        Contraseña
                      </FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="h-10"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Confirmar contraseña */}
              <form.Field name="ConfirmPassword">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor="confirm-password">
                        Confirmar contraseña
                      </FieldLabel>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="h-10"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-3 pt-2 pb-6">
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                form="register-form"
                className="w-full h-10 font-semibold bg-blue-700 hover:bg-blue-800"
                disabled={!canSubmit}
              >
                {isSubmitting ? "Registrando..." : "Registrar"}
              </Button>
            )}
          </form.Subscribe>

          <div className="flex w-full items-center justify-center text-sm">
            <span className="text-slate-600">¿Ya tienes una cuenta?{' '}</span>
            <Link
              to="/login"
              className="ml-1 hover:underline underline-offset-4"
            >
              Iniciar sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterAbonados;
