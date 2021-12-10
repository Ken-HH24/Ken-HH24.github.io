import Axios from './core/Axios';
import utils from './utils';
import defaults from './defaults';

const createInstance = (defaultConfig) => {
    const context = new Axios(defaultConfig);
    // 创建的实例是Axios里的request函数
    const instance = context.request.bind(context);

    // instance缺少Axios.prototype上的get等方法，需要借助utils转移
    utils.extend(instance, Axios.prototype, context);
    // 将interceptors移给instance
    utils.extend(instance, context);

    return instance;
}

const axios = createInstance(defaults);

export default axios;