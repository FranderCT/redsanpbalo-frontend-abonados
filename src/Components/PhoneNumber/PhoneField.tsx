import { useId } from "react";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import PhoneInput, { type Value } from "react-phone-number-input";

type Props = {
  label?: string;
  value?: string;                 // E.164: "+50688887777"
  onChange: (val?: string) => void;
  defaultCountry?: string;        // "CR" por defecto
  error?: string;
  required?: boolean;
};

export default function PhoneField({
  label = "Teléfono",
  value,
  onChange,
  defaultCountry = "CR",
  error,
  required,
}: Props) {
  const id = useId();
  const valid = !value || isPossiblePhoneNumber(value);

  const base =
    "w-full border bg-white/80 px-3 py-2 text-sm outline-none transition";
  const ok = "border-gray-300 focus:ring-2 focus:ring-blue-500";
  const bad = "border-red-400 focus:ring-2 focus:ring-red-500";

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-800">
          {label} {required && <span className="text-red-500"></span>}
        </label>
      )}

      <PhoneInput
        id={id}
        defaultCountry={defaultCountry as any}
        international
        value={value as Value}
        onChange={(val) => onChange(val || undefined)}  
        className={`${base} ${valid ? ok : bad} input-base`} 
        countrySelectProps={{
          className:
            "h-9 rounded-lg border border-gray-300 bg-white px-2 text-sm",
        }}
        numberInputProps={{
          className:
            "flex-1 h-9 bg-transparent outline-none text-sm placeholder:text-gray-400",
          placeholder: "Ej: 8888 7777",
        }}
      />
    </div>
  );
}