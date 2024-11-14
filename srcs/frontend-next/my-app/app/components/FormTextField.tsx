import { ChangeEvent } from 'react'
import * as Form from '@radix-ui/react-form'

interface FormTextFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  errorMessage?: string;
}

export function FormTextField({
  name,
  label,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder = "",
  errorMessage = `Please enter your ${label.toLowerCase()}`
}: FormTextFieldProps) {
  return (
    <Form.Field name={name} className="grid mb-4">
      <Form.Label className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </Form.Label>
      <Form.Control asChild>
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
        />
      </Form.Control>
      <Form.Message match="valueMissing" className="text-sm text-red-500">
        {errorMessage}
      </Form.Message>
    </Form.Field>
  );
}
