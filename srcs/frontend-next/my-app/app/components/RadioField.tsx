// components/RadioGroupField.tsx
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  name: string;
  label: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  capitalize?: boolean;
}

export function RadioGroupField({
  name,
  label,
  value,
  options,
  onChange,
  orientation = "horizontal",
  capitalize = false,
}: RadioGroupFieldProps) {
  return (
    <Form.Field name={name} className="grid mb-4">
      <Form.Label className="text-sm font-medium text-gray-700 mb-2">
        {label}
      </Form.Label>
      <RadioGroup.Root
        value={value}
        onValueChange={onChange}
        className={`flex ${
          orientation === "horizontal" ? "flex-row gap-4" : "flex-col gap-2"
        }`}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <RadioGroup.Item
              value={option.value}
              id={`${name}-${option.value}`}
              className="w-4 h-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-emerald-600" />
            </RadioGroup.Item>
            <label
              className={`ml-2 text-sm text-gray-700 ${
                capitalize ? "capitalize" : ""
              }`}
              htmlFor={`${name}-${option.value}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup.Root>
    </Form.Field>
  );
}
