import { ChangeEvent } from "react";
import * as Form from "@radix-ui/react-form";

interface CheckboxFieldProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

export function CheckboxField({
  name,
  label,
  checked,
  onChange,
  id = name,
}: CheckboxFieldProps) {
  return (
    <Form.Field name={name} className="grid mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          name={name}
          id={id}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
        <Form.Label className="ml-2 block text-sm text-gray-700">
          {label}
        </Form.Label>
      </div>
    </Form.Field>
  );
}
