type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: readonly { label: string; value: T }[];
  onChange: (value: T) => void;
};

export function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  return (
    <label className="selectField">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

