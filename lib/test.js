function registerFilter(filterObject, isPromise = false) {

    function fn(req, res, next) {
        /// 过滤器对象
        let filter = {}

        // 如果是数组进行遍历
        if (filterObject instanceof Array) {
            // 挂载执行函数结果
            filterObject.forEach(filterItem => {
                filter['_' + filterItem.name] = (req) => {
                    return new Promise((resolve, reject) => {
                        try {

                            resolve(filterItem(req))
                        } catch (error) {
                            reject({
                                isVail: false,
                                msg: filterItem.name + '过滤器 执行失败',
                                erro: error
                            })
                        }

                    })
                }


                Object.assign(filter, {
                    get [filterItem.name]() {
                        return filter['_' + filterItem.name]()
                    }
                })

            })


        }
        //  如果是对象 定制filter
        else if (filterObject instanceof Object && typeof filterObject === "object") {
            Object.assign(filter, filterObject)
        }
        //  函数直接挂载可执行
        else {
            filter['_' + filterObject.name] = (req) => {
                return new Promise((resolve, reject) => {
                    try {
                        resolve(filterObject(req))
                    } catch (error) {
                        reject({
                            isVail: false,
                            msg: '过滤器 执行失败',
                            erro: error
                        })
                    }
                })

            }
            Object.assign(filter, {
                get [filterObject.name]() {
                    return filter['_' + filterObject.name]()
                }
            })
        }


        req = req ? req : {}
        req.filter = (req.filter ? {
            ...filter,
            ...req.filter
        } : filter)

        if (window) {
            window._filter = window._filter ? {
                ...window._filter,
                ...req.filter
            } : req.filter
        }


        return req.filter;
    }

    if (isPromise) {
        return new Promise((resolve, reject) => {
            resolve(fn())
        })

    } else {
        return fn
    }
}




if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = registerFilter
} else {
    if (window) {
        window.registerFilter = registerFilter
    } else {
        throw new Error("无法使用浏览器环境")
    }
}