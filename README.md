# route-filter.emb

>   PackageName:route-filter.emb-packages
>
>  Author:吃火星的宝宝
>
>  GitHub: embaobao
>
> Web :[个人网站](https://embaobao.cn)
>
>  Description:
>
>  基于sme-router 为例开发的路由中间键 ，可在路由请求中注入请求过滤，实现过滤和请求处理



## Description

首先这是一个路由过滤器中间件 ，测试是基于 SME-Router 的前端路由中间件。

他的实现原理是基于注入在request对象中 一组过滤器  的异步调用 Promise 函数。

在请求发出是 ，在请求对象的filter 对象中获取你注册的过滤器，在过滤结果中执行代码。

他有一下几个优点:

可实现请求过滤器，可作为在前端不能实现next 方法的替代方案。

把过滤器请求Ajax 数据返回的实现：

在RMVC 构建过程过于复杂时，

我们可以使用过滤器中把请求从 Controller 中作为 脱离出去，

实现新的尝试 FRMVC(过滤路由MVC);



## Use

###  install

```javascript
npm install routefilter.emb -D

import registerFilter from './filter/userFilter.js'
```

### Demo



#### Base use

```javascript
function Filter2() {
    return "a"
}

function Filter1() {
    return "a"
}

let filterDefine ={
    Filter1() {
        return "a"
    },
    Filter2() {
        return "a"
    }
}

const router = new SMERouter('router-view', 'hash')


// 直接注册单过滤器 ！ 不能过滤器重名 根据过滤器函数名注入
router.use(Filter1) 

// or  多过滤器注册
router.use(registerFilter([Filter1, Filter2]))

// special usages 特殊用法 直接写入filter对象 是我们传入的对象被自定义
router.use(registerFilter(filterDefine))

```

#### FRMVC

##### Filter 过滤器的编写

```javascript
export default {
    userSignIn(req, res, next) {
        return $.ajax({
            type: "get",
            url: "/users/issignin",
            data: "",
            dataType: "json"
        })
    }

}
```

#####  Router注入过滤器

```javascript

import userFilter from './filter/userFilter.js'
//用户过滤器 . 过滤器层 

const router = new SMERouter('router-view', 'hash')
//注册
router.use(registerFilter(userFilter))



```

##### Controller 使用过滤器

```javascript
import homeView from '../Views/index/home.art'
export default {
    async render(req, res, next) {
    //调用用户过滤器
      let isSingIn= await req.filter.userSignIn();
      if(isSingIn){
      //如果验证成功 ，渲染
       res.render(homeView())
      }  
    }
}

  console.log(await req.filter.userSignIn() );

```

Thanks Use ! 希望您可以提出更多意见！[我的意见箱]( https://embaobao.cn)






