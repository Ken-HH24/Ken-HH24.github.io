import React, { useImperativeHandle } from 'react';
import useForm from './hooks/useForm';
import FormContext from './store/FormContext';

const Form = (props, ref) => {
    const {
        form,
        onFinish,
        onFinishFailed,
        initialValue,
        children
    } = props;

    const formInstance = useForm(form, initialValue);
    const { setCallback, dispatch, ...providerFormInstance } = formInstance;

    setCallback({
        onFinish,
        onFinishFailed
    });

    // useImperativeHandle(ref, () => providerFormInstance, []);

    return (
        <form
            onReset={(e) => {
                e.preventDefault();
                e.stopPropagation();
                formInstance.resetFields();
            }}
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                formInstance.submit();
            }}
        >
            <FormContext.Provider value={formInstance}>
                {children}
            </FormContext.Provider>
        </form>
    )
}

export default Form;