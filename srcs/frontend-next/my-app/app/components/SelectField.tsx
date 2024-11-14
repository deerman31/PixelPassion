import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    name: string;
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    errorMessage?: string;
    selectGroupLabel?: string;
}

export function SelectField({
    name,
    label,
    value,
    options,
    onChange,
    placeholder = "Select an option",
    required = true,
    errorMessage = "Please make a selection",
    selectGroupLabel = "Please select"
}: SelectFieldProps) {
    return (
        <Form.Field className="grid mb-4" name={name}>
            <div className="flex items-baseline justify-between">
                <Form.Label className="text-sm font-medium text-gray-700 mb-1">
                    {label}
                </Form.Label>
                <Form.Message
                    className="text-sm text-red-500"
                    match="valueMissing"
                >
                    {errorMessage}
                </Form.Message>
            </div>

            <Form.Control asChild>
                <Select.Root
                    required={required}
                    value={value}
                    onValueChange={onChange}
                    name={name}
                >
                    <Select.Trigger
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black inline-flex items-center justify-between"
                        aria-label={`${label} selection`}
                    >
                        <Select.Value placeholder={placeholder} />
                        <Select.Icon>
                            <ChevronDown className="h-4 w-4" />
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content
                            className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden"
                            position="popper"
                            sideOffset={5}
                        >
                            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                                <ChevronDown className="h-4 w-4 rotate-180" />
                            </Select.ScrollUpButton>

                            <Select.Viewport className="p-1 max-h-64 overflow-y-auto">
                                <Select.Group>
                                    <Select.Label className="px-6 py-2 text-xs text-gray-500 bg-white">
                                        {selectGroupLabel}
                                    </Select.Label>
                                    {options.map((option) => (
                                        <Select.Item
                                            key={option.value}
                                            value={option.value}
                                            className="relative flex items-center px-6 py-2 text-sm rounded-sm hover:bg-emerald-50 focus:bg-emerald-50 radix-disabled:opacity-50 focus:outline-none select-none text-black"
                                        >
                                            <Select.ItemText className="text-black">
                                                {option.label}
                                            </Select.ItemText>
                                        </Select.Item>
                                    ))}
                                </Select.Group>
                            </Select.Viewport>

                            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                                <ChevronDown className="h-4 w-4" />
                            </Select.ScrollDownButton>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
            </Form.Control>

            {(!value) && (
                <p className="text-sm text-red-500 mt-1">
                    {errorMessage}
                </p>
            )}
        </Form.Field>
    );
}
