import React, { useContext, useEffect, useMemo, useState } from 'react';
import FormContext from './store/FormContext';
import Message from './Message';
import Label from './Label';

const FormItem = ({
    name,
    label,
    rules = {},
    required = false,
    triggerChange = 'onChange',
    triggerValidate = 'onChange',
    children
}) => {

    const formInstance = useContext(FormContext);
    const { registerValidateFields, unRegisterValidate, dispatch } = formInstance;
    const [, forceUpdate] = useState({});

    // 保存一个方法，可以让组件强制重新渲染
    const controller = useMemo(() => {
        return {
            changeValue() {
                forceUpdate({});
            }
        }
    }, [formInstance])

    useEffect(() => {
        name && registerValidateFields(name, controller, { ...rules, required });

        return () => {
            name && unRegisterValidate(name);
        }
    }, [controller]);

    const getControlled = (child) => {
        const mergedChildProps = { ...child.props };
        if (!name)
            return mergedChildProps;

        const handleChange = (e) => {
            const value = e.target.value;
            dispatch({ type: 'setFieldsValue' }, name, value);
        }
        mergedChildProps[triggerChange] = handleChange;

        if (required || rules) {
            const handleValidate = (e) => {
                // 如果 validate 和 change 的触发方法相同，需要先执行handleChange，防止覆盖
                if (triggerChange === triggerValidate) {
                    handleChange(e);
                }
                dispatch({ type: 'validateFieldValue' }, name);
            }
            mergedChildProps[triggerValidate] = handleValidate;
        }

        mergedChildProps.value = dispatch({ type: 'getFieldValue' }, name) || '';
        return mergedChildProps;
    }

    let renderChildren;
    if (React.isValidElement(children)) {
        renderChildren = React.cloneElement(children, getControlled(children));
    } else {
        renderChildren = children;
    }

    return (
        <div>
            <Label
                label={label}
                required={required}
            />
            {renderChildren}
            <Message name={name} {...dispatch({ type: 'getFieldModel' }, name)} />
        </div>
    )
}

export default FormItem;