

# route-filter.emb

>   PackageName:route-filter.emb-packages
>
>   Author:吃火星的宝宝
>
>   GitHub:  [embaobao](https://github.com/embaobao/)
>
>   [packageGit Hub](https://github.com/embaobao/route-filter.emb-packages)
>
>   Web :[个人网站](https://embaobao.cn)
>
>   Description:
>
>   基于sme-router 为例开发的路由中间件，可在路由请求中注入请求过滤，实现过滤和请求处理



## Description

首先这是一个路由过滤器中间件 ；

其次他可以把函数变成Promise函数，在浏览器环境下执行全局函数的调用。

测试是基于 SME-Router 的前端路由中间件。

他的实现原理是基于注入在request对象中 一组过滤器 的异步调用 Promise 函数。

在请求发出是 ，在请求对象的filter 对象中获取你注册的过滤器，在过滤结果中执行代码。

他有一下几个优点:

可实现请求过滤器，可作为在前端不能实现next 方法的替代方案。

把过滤器请求Ajax 数据返回的实现：

在RMVC 构建过程过于复杂时，

我们可以使用过滤器中把请求从 Controller 中作为 脱离出去，

实现新的尝试 FRMVC(过滤路由MVC);

## Use

###  install 安装

```javascript
npm install routefilter.emb -D

import registerFilter from 'routefilter.emb'
// or 浏览器环境
registerFilter()
```

### Demo  例子

#### Base use 基本使用

##### 引入

```javascript
import registerFilter from 'routefilter.emb';
```



##### 注入

```javascript




// 引入
import SMERouter from 'sme-router';
import registerFilter from 'routefilter.emb';
import homeController from './homeController.js'





// 模拟执行器
// 请注意注册过滤器 ，不能过滤器重名 根据过滤器函数名注入
function Filter2() {
    return Date.now();
}

function Filter1() {
    return Date.now();
}


// 脱离路由  注册全局过滤执行器  单个
registerFilter(Filter2, true);

// 脱离路由  注册全局过滤执行器 多个
registerFilter([Filter2...], true);


// 脱离路由  全局调用
//调用的属性过滤只在加载时执行结果会保存 

//除非页面刷新自动再次调用 改变保存的

//适用页面不刷新单次验证环境 

// demon不优雅 如果在函数中建议使用 await 获取promise结果


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

// 控制器中执行    
//路由控制器调用
class Controller {
    
    async render(req, res, next) {
      
        let result = await req.filter.Filter1;
        //1566569530256 页面加载后执行的结构 不刷新 永远保持
        let result2 = await req.filter._Filter1();
        //新的执行
        let result3 = await _filter._Filter1();
         // 执行全局执行器
        
        
          //调用用户过滤器
        let isSingIn = await req.filter.userSignIn();
        
        if (isSingIn) {
            //如果验证成功 ，渲染
           res.render("Rander Page")
        }
        
       
    }

}
   

// special usages 特殊用法 直接写入 filter对象 全局的过滤将被对象替换
router.use(registerFilter({}))

```

#### FRMVC 增加过滤请求层的用法

##### Filter  滤器的编写

```javascript
class Filter {
    userSignIn(req, res, next) {
        return $.ajax({
            type: "get",
            url: "/users/issignin",
            data: "",
            dataType: "json"
        })
    }
}
export default new Filter()
```

#####  Router注入过滤器

```javascript

import userFilter from './filter/userFilter.js'
//用户过滤器 . 过滤器层 

const router = new SMERouter('router-view', 'hash')
// 脱离路由  注册全局过滤执行器 多个
registerFilter([FuserFilter.userSignIn,...], true);
//OR  路由注册
router.use(registerFilter(userFilter.userSignIn))



```

##### Controller 使用过滤器

```javascript
//路由控制器调用
class Controller {   
    async render(req, res, next) {
      
        let result = await req.filter.Filter1;
        //1566569530256 页面加载后执行的结构 不刷新 永远保持
        let result2 = await req.filter._Filter1();
        //新的执行
        let result3 = await _filter._Filter1();
         // 执行全局执行器
          //调用用户过滤器
        let isSingIn = await req.filter.userSignIn();
        
        if (isSingIn) {
            //如果验证成功 ，渲染
           res.render("Rander Page")
        }  
    }
}
export default new Controller()
```





Thanks Use ! 希望您可以提出更多意见！[我的意见箱]( https://embaobao.cn)






