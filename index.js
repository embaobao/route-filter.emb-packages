   function registerExecutor(filterObject, isReq = false, isPromise = true) {



       function fn(req) {

           /// 过滤器对象
           let filter = {}


           // 如果是对象 定制filter
           if (!(typeof filterObject === "function") && !(filterObject instanceof Array)) {
               filter = {
                   ...filterObject,
                   ...filter
               }
           }
           // 函数直接挂载可执行
           else {
               if (typeof filterObject === "function") {
                   filterObject = [filterObject]
               }
               // 如果是数组进行遍历
               if (filterObject instanceof Array && typeof filterObject === 'object') {
                   // 挂载执行函数结果
                   filterObject.forEach(filterItem => {


                       if (filterItem.name[0] === "_") {
                           filter[filterItem.name] = function () {
                               return new Promise((resolve, reject) => {
                                   try {
                                       resolve(filterItem.apply(this, arguments))
                                   } catch (error) {
                                       reject({
                                           isVail: false,
                                           msg: filterItem.name + '过滤器 执行失败',
                                           erro: error
                                       })
                                   }
                               })
                           }
                           filter[filterItem.name + '_'] =
                               filter[filterItem.name]()
                       } //非直接执行执行器注册 
                       else {
                           filter[filterItem.name] = function () {
                               return new Promise((resolve, reject) => {
                                   try {
                                       resolve(filterItem.apply(this, arguments))
                                   } catch (error) {
                                       reject({
                                           isVail: false,
                                           msg: filterItem.name + '过滤器 执行失败',
                                           erro: error
                                       })
                                   }
                               })
                           }
                       }



                   })
               } else {
                   throw new Error(' 是不是 参数传递错了？要看看文档？https://www.npmjs.com/package/routefilter.emb ')
               }
           }

           req = req ? req : {};
           // 合并request 上的执行器
           filter = req.Executor ? {
               ...filter,
               ...req.Executor
           } : filter
           // 合并window 上的执行器
           filter = window && window.Executor ? {
               ...filter,
               ...window.Executor
           } : filter

           ExecutorPrx = new Proxy(filter, {
               get: function (target, property) {
                   return target[property];
               }
           })

           window.Executor = req.Executor = ExecutorPrx
           return req;
       }



       if (isReq) {
           if (isPromise) {
               return new Promise((resolve, reject) => {
                   resolve(fn())
               })
           } else {
               fn()
           }

       } else {
           return fn
       }

   }



   if (typeof module === "object" && typeof module.exports === "object") {
       module.exports = registerExecutor
   } else {
       if (window) {
           window.registerExecutor = registerExecutor
       } else {
           throw new Error("无法使用浏览器环境")
       }
   }