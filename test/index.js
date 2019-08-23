import SMERouter from 'sme-router';
// import registerFilter from 'routefilter.emb';
import homeController from './homeController.js'




function Filter2() {
    return Date.now();
}

function Filter1() {
    return Date.now();
}




// 注册全局过滤执行器  单个
registerFilter(Filter2, true);
// 注册全局过滤执行器 多个
registerFilter([Filter2], true);




// 全局调用  调用的属性时  只在加载执行 ，结果会保存 ，
//页面刷星自动再次调用 进行结果报存，适用页面不刷新单次验证环境
// 不优雅 如果在函数中 建议使用 awite 获取promise 结果
_filter.Filter2.then((res) => console.log(res));
//1566569316591
setTimeout(() => {
    _filter.Filter2.then((res) => console.log(res));
    //结果相同 1566569316591
}, 1000)

_filter._Filter2().then((res) => console.log(res));
//1566569316591

setTimeout(() => {
    _filter._Filter2().then((res) => console.log(res));
     //结果不相同每次执行调用 1566568698118
}, 1000)



const router = new SMERouter('router-view', 'hash')

//  注册到路由请求中过滤执行器  单个
router.use(registerFilter(Filter1))

//  注册到路由请求中过滤执行器  多个
router.use(registerFilter([Filter1]))

// 全局注册的过滤执行器 方法都是 适用在 请求对象中的 filter 中调用 方法性质一致


router.route('/', homeController.render)
router.redirect('/')





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