import { useId } from "react";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import PhoneInput, { type Value } from "react-phone-number-input";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  value?: string; // E.164: "+50688887777"
  onChange: (val?: string) => void;
  styles?: string;
  defaultCountry?: string; // "CR" por defecto
  error?: string;
  required?: boolean;
  /** Para integrar con Field: cuando el campo está inválido (ej. data-invalid del padre) */
  "data-invalid"?: boolean;
  className?: string;
};

export default function PhoneField({
  label = "Teléfono",
  value,
  onChange,
  defaultCountry = "CR",
  required,
  error,
  "data-invalid": dataInvalid,
  className,
}: Props) {
  const id = useId();
  const valid = !value || isPossiblePhoneNumber(value);
  const isInvalid = dataInvalid ?? (!!error || (value !== undefined && value !== "" && !valid));

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div
        className="PhoneField-root w-full"
        data-invalid={isInvalid ? "true" : undefined}
      >
        <PhoneInput
          id={id}
          defaultCountry={defaultCountry as "CR"}
          international
          value={value as Value}
          onChange={(val) => onChange(val || undefined)}
          className="flex w-full h-full items-center transition-colors"
          countrySelectProps={{
            className:
              "h-full min-h-0 border-0 bg-transparent pl-0 pr-1 text-sm outline-none focus:ring-0 text-foreground cursor-pointer",
          }}
          numberInputProps={{
            id,
            className: cn(
              "flex-1 min-w-0 h-full min-h-0 border-0 bg-transparent py-0 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:outline-none focus-visible:ring-0"
            ),
            placeholder: "Ej: 8888 7777",
          }}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
