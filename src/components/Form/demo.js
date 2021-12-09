import React from 'react';
import Form, { FormItem, Input } from '.';

function test(value) {
    if (!value)
        return true;
    if (value.length > 0 && value.length <= 5)
        return true;
    else
        return false;
}

const FormDemo = () => {
    return (
        <Form>
            <FormItem
                name='name'
                label='name'
                required
                rules={{
                    rule: test,
                    message: 'too long or too short'
                }}
            >
                <Input />
            </FormItem>
            <FormItem
                name='password'
                label='password'
                triggerValidate='onBlur'
                required
                rules={{
                    rule: test,
                    message: 'password should be right'
                }}
            >
                <Input />
            </FormItem>

            <input type='reset' value='reset' />
            <input type='submit' value='submit' />
        </Form>
    )
}

export default FormDemo;