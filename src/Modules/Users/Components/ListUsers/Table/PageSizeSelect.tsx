type Props = {
  value: number;
  onChange: (size: number) => void;
  options?: number[];
};

const PageSizeSelect = ({ value, onChange, options = [5, 10, 15, 20, 50] }: Props) => {
  return (
    <label className="text-sm text-gray-600">
      Filas por página:
      <select
        className="ml-2 rounded border px-2 py-1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
};

export default PageSizeSelect;
