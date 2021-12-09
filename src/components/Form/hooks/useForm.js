import { useRef, useState } from 'react';
import FormStore from '../store/FormStore';

export default function useForm(form, defaultValue = {}) {
    const formRef = useRef(null);
    const [, forceUpdate] = useState({});
    if (form) {
        formRef.current = form;
    } else {
        const formStore = new FormStore(forceUpdate, defaultValue);
        formRef.current = formStore.getForm();
    }
    return formRef.current;
}