import React, { useState, useEffect } from 'react';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';

interface FormBirthDateFieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormBirthDateField = ({ name, label, value, onChange }: FormBirthDateFieldProps) => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

    useEffect(() => {
        if (value) {
            const [y, m, d] = value.split('-');
            setYear(y);
            setMonth(m);
            setDay(d);
        }
    }, [value]);

    const handleChange = (type: 'year' | 'month' | 'day', newValue: string) => {
        let updatedYear = year;
        let updatedMonth = month;
        let updatedDay = day;

        if (type === 'year') updatedYear = newValue;
        if (type === 'month') updatedMonth = newValue.padStart(2, '0');
        if (type === 'day') updatedDay = newValue.padStart(2, '0');

        if (updatedYear && updatedMonth && updatedDay) {
            const event = {
                target: {
                    name,
                    value: `${updatedYear}-${updatedMonth}-${updatedDay}`
                }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
        }
    };

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

    return (
        <div className="p-4">
            <Form.Root className="space-y-4">
                <div className="text-sm mb-2">{label}</div>
                <div className="flex gap-4">
                    <Select.Root value={year} onValueChange={(value) => handleChange('year', value)}>
                        <Select.Trigger className="border rounded px-4 py-2 w-32">
                            <Select.Value placeholder="Year" />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content className="bg-white border rounded shadow-lg">
                                <Select.ScrollUpButton className="flex items-center justify-center h-6">
                                    ▲
                                </Select.ScrollUpButton>
                                <Select.Viewport>
                                    {years.map((year) => (
                                        <Select.Item
                                            key={year}
                                            value={year.toString()}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <Select.ItemText>{year}</Select.ItemText>
                                        </Select.Item>
                                    ))}
                                </Select.Viewport>
                                <Select.ScrollDownButton className="flex items-center justify-center h-6">
                                    ▼
                                </Select.ScrollDownButton>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>

                    <Select.Root value={month} onValueChange={(value) => handleChange('month', value)}>
                        <Select.Trigger className="border rounded px-4 py-2 w-24">
                            <Select.Value placeholder="Month" />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content className="bg-white border rounded shadow-lg">
                                <Select.Viewport>
                                    {months.map((month) => (
                                        <Select.Item
                                            key={month}
                                            value={month}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <Select.ItemText>{month}</Select.ItemText>
                                        </Select.Item>
                                    ))}
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>

                    <Select.Root value={day} onValueChange={(value) => handleChange('day', value)}>
                        <Select.Trigger className="border rounded px-4 py-2 w-24">
                            <Select.Value placeholder="Day" />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content className="bg-white border rounded shadow-lg">
                                <Select.Viewport>
                                    {days.map((day) => (
                                        <Select.Item
                                            key={day}
                                            value={day}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <Select.ItemText>{day}</Select.ItemText>
                                        </Select.Item>
                                    ))}
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                </div>
            </Form.Root>
        </div>
    );
};

export default FormBirthDateField;