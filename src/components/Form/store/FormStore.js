import { unstable_batchedUpdates } from 'react-dom';

const formInstanceApi = [
    'setCallback',
    'dispatch',
    'registerValidateFields',
    'resetFields',
    'setFields',
    'setFieldsValue',
    'getFieldsValue',
    'getFieldValue',
    'validateFields',
    'submit',
    'unRegisterValidate'
]

function isReg(value) {
    return value instanceof RegExp;
}

class FormStore {
    constructor(forceUpdate, defaultFormValue = {}) {
        this.forceUpdate = forceUpdate;
        this.model = {};  // form 状态层
        this.control = {};  // 控制每一个 formItem
        this.isSchedule = false;  // 是否开启调度
        this.callback = {}  // 监听回调函数
        this.penddingValidateQueue = [];  // 调度队列
        this.defaultFormValue = defaultFormValue;
    }

    // 获取所有api方法
    getForm() {
        return formInstanceApi.reduce((prev, current) => {
            prev[current] = this[current].bind(this);
            return prev;
        }, {})
    }

    setCallback(cb) {
        this.callback = cb;
    }

    static createValidate(validate) {
        const { value, rule, required, message } = validate;
        return {
            value,
            rule: rule || (() => true),
            required: required || false,
            message: message || '',
            status: 'pendding'
        }
    }

    // 触发事件
    dispatch(action, ...args) {
        if (!action && typeof action !== 'object')
            return null;
        const { type } = action;
        if (formInstanceApi.indexOf(type) !== -1 || typeof this[type] === 'function') {
            return this[type](...args);
        }
    }

    registerValidateFields(name, control, model) {
        if (this.defaultFormValue[name])
            model.value = this.defaultFormValue[name];
        const validate = FormStore.createValidate(model);
        this.model[name] = validate;
        this.control[name] = control;
    }

    unRegisterValidate(name) {
        delete this.model[name];
        delete this.control[name];
    }

    notifyChange(name) {
        const controller = this.control[name];
        controller && controller.changeValue();
    }

    // 重置所有field
    resetFields() {
        Object.keys(this.model).forEach(modelName => {
            this.setValueClearStatus(this.model[modelName], modelName, null);
        })
    }

    // 批量设置field
    setFields(object) {
        if (typeof object !== 'object')
            return;
        Object.keys(object).forEach(modelName => {
            this.setFiledsValue(modelName, object[modelName]);
        })
    }

    // 设置一个field
    setFieldsValue(name, modelValue) {
        const model = this.model[name];
        if (!model)
            return false;
        if (typeof modelValue === 'object') {
            const { value, rule, message } = modelValue;
            value && (model.value = value);
            rule && (model.rule = rule);
            message && (model.message = message);
            model.status = 'pendding';
            this.validateFieldValue(name, true);
        } else {
            this.setValueClearStatus(model, name, modelValue);
        }
    }

    // 设置field的value
    setValueClearStatus(model, name, value) {
        model.value = value;
        model.status = 'pendding';
        this.notifyChange(name);
    }

    getFieldsValue() {
        const res = {};
        Object.keys(this.model).forEach(modelName => {
            res[modelName] = this.model[modelName].value;
        })
        return res;
    }

    getFieldModel(name) {
        const model = this.model[name];
        return model ? model : {};
    }

    getFieldValue(name) {
        const model = this.model[name];
        if (!model && this.defaultFormValue[name])
            return this.defaultFormValue[name];
        return model ? model.value : null;
    }

    // 验证一个field
    validateFieldValue(name, forceUpdate = false) {
        const model = this.model[name];
        if (!model)
            return null;

        const lastStatus = model.status;
        const { value, rule, required } = model;
        let status = 'resolve';
        if (required && !value)
            status = 'reject';
        if (isReg(rule)) {
            status = rule.test(value) ? 'resolve' : 'reject';
        } else if (typeof rule === 'function') {
            status = rule(value) ? 'resolve' : 'reject';
        }
        model.status = status;
        if (lastStatus !== status || forceUpdate) {
            const notify = this.notifyChange.bind(this, name);
            this.penddingValidateQueue.push(notify);
        }
        this.scheduleValidate();
        return status;
    }

    scheduleValidate() {
        if (this.isSchedule)
            return;
        this.isSchedule = true;
        Promise.resolve().then(() => {
            unstable_batchedUpdates(() => {
                do {
                    let notify = this.penddingValidateQueue.shift();
                    notify && notify();
                } while (this.penddingValidateQueue.length > 0);
                this.isSchedule = false;
            });

        })
    }

    // 验证所有field
    validateFields(callback) {
        let status = true;
        Object.keys(this.model).forEach(modelName => {
            const modelStatus = this.validateFieldValue(modelName, true);
            if (modelStatus === 'reject')
                status = false;
        })
        callback(status);
    }

    submit(cb) {
        this.validateFields((res) => {
            const { onFinish, onFinishFailed } = this.callback;
            cb && cb(res);
            if (!res)
                onFinishFailed && typeof onFinishFailed === 'function' && onFinishFailed(res);
            onFinish && typeof onFinish === 'function' && onFinish(res);
        })
    }
}

export default FormStore;