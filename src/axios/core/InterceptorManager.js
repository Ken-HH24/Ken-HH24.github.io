function InterceptorManager() {
    this.handlers = [];
}

InterceptorManager.prototype.use = function (fullfilled, rejected, config) {
    this.handlers.push({
        fullfilled,
        rejected,
    });

    return this.handlers.length - 1;
}

export default InterceptorManager;