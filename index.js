function registerFilter(filterObject) {
    return function (req, res, next) {

        req.filter = (req.filter ? "" : req.filter = {})

        if (filterObject instanceof Array) {

            filterObject.forEach(filterItem => {
                req.filter[filterItem.name] = new Promise((resolve, reject) => {
                    try {
                        resolve(filterItem(req))
                    } catch (error) {
                        reject({
                            isVail: false,
                            msg: '过滤器 执行失败',
                            erro: error
                        })
                    }

                })
            })


        } else if (filterObject instanceof Object) {
            Object.assign(req.filter, filterObject)
        } else {
            req.filter[filterObject.name] = new Promise((resolve, reject) => {
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
    }

}

export default registerFilter