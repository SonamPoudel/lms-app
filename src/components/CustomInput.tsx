import { useEffect, useState } from "react";

interface CustomInputProps {
  label: string;
  required?: boolean;
  type?: string;
  error?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function CustomInput({
  label,
  required = true,
  type = "text",
  name,
  value,
  onChange,
  disabled = false,
}: CustomInputProps) {
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    if (value) {
      console.log(typeof value);
      if (name === "published_date") {
        setInput(new Date(value).toISOString().slice(0, 10));
      } else {
        setInput(value);
      }
    }
  }, [value]);

  return (
    <div className="w-full">
      <label>{label}</label>
      <input
        className="border border-gray-300 rounded w-full px-2 py-1 disabled:bg-gray-200"
        required={required}
        type={type}
        name={name || label.toLowerCase()}
        value={input}
        onChange={(e) => {
          onChange?.(e);
          setInput(e.target.value);
        }}
        disabled={disabled} // Controls whether the field is editable
      />
    </div>
  );
}
