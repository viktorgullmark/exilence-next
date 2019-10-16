import { useState } from 'react';
import { FormInput } from '../interfaces/form-input.interface';

export default function useFormInput (initialValue: any) {
    const [value, setValue] = useState(initialValue);
    const handleChange = (event: any) => {
        setValue(event.target.value);
    };
    return { value, onChange: handleChange } as FormInput;
}