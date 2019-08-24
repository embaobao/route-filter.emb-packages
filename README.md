

# route-filter.emb

>   Package Name :route-filter.emb 
>
>   Description:基于浏览器环境  **sme-router 为例**开发的路由中间件，
>
>   可在路由请求中**注入请求过滤**，实现过滤和请求处理；
>
>    也可作为公共执行器 **进行AJAX请求层分离**

## Description

他把函数变成Promise函数，在浏览器环境下执行全局函数的调用。

他把函数注入在Router 的request对象中 异步调用 Promise 函数 实现过滤。

他有几个优点和尝试:

前端无next 方法的替代方案。

分离Ajax 请求的实现方案。

使用场景 基于浏览器的 RMVC 构建过程过于复杂时，

我们可以使用他把**Ajax 请求从 Controller 中脱离**出去，

实现新的尝试 ARMVC ( Ajax   Router Model View  Controller );

## Install 安装

```javascript
npm install routefilter.emb -D

import registerExecutor from 'routefilter.emb'
// or 浏览器环境
registerExecutor()
```

## USE  使用



#### Quick to use 快速使用

##### 引入

```javascript
const registerExecutor= require('routefilter.emb') ;
```

> Tip:  The browser environment does not need to be require.
>
> 浏览器环境不需要引入,可直接调用  registerExecutor 方法

  

##### 执行器  & 使用

> 模拟执行器
>
> //除非页面刷新自动再次调用 改变保存的
>
> //适用页面不刷新单次验证环境 

###### 普通执行器

```javascript
function Filter2(data, res) {
            console.log('2.', data, res)
            return Date.now()
}
```

###### 普通执行器调用

> 函数中建议使用 asynv  await 调用 获取结果
>
> 路由中 执行器 会挂载 在 request 对象中

```javascript
Executor.Filter2().then((res) => console.log(res));
// OR 路由中 执行器调用
let result= await req.Filter2(data)
```



###### 自执行执行器  _ 下滑线开头

> 自执行执行器  页面加载时会自动执行并保存结果会
>
> 页面刷新自动再次调用 改变保存的结果
>
> 适用页面不刷新单次验证环境 

```javascript
// 自执行执行器 _ 下滑线开头  
function _Filter1(data) {
            console.log('1', data)
            return Date.now()
}
```

###### 自执行执行器 结果获取 &&调用

> 注意：获取的结果 是 **注册时就已经执行并保存的**
> **页面不刷新** 任何时候**获取的结果都是相同**
>
> **再次调用**获取新的结果只是返回新的结果   也**不会更新自动执行的结果**

```javascript
//结果获取
let result=  await  Executor._Filter1_
//再次调用获取新的结果 此调用不会影响自动执行后的结果
let result =await  Executor._Filter1()

```

```javascript
//如果没看懂 ，请看例子
 Executor._Filter1_.then((res) => console.log(res));
//1566569316591

setTimeout(() => {
   Executor._Filter1_.then((res) => console.log(res));
    //结果相同 1566569316591
}, 1000)
```



##### 注入

> 请注意注册执行器 ，尽量不要执行器重名 根据过滤器函数名注入
>
>  全局注入 脱离路由  全局调用 

###### 全局多个注入 Array - 注入多个  脱离路由

```javascript
 // 注册全局 执行器 多个
 registerExecutor([_Filter1, Filter2],true);
```

###### 全局单个注入 Function - 注入单个  脱离路由

```javascript
// 注册全局过滤执行器  注意： 重复注入 自动执行执行器 会多次执行
registerExecutor(_Filter1,true);
```

###### 路由注入

> 与全局注册语法相同
>
> 在路由中注人的执行器 在路由执行后  全局也可以调用
>
> request.Executor[执行器] 与全局调用 方法性质一致

```javascript
router.use(registerExecutor(_Filter1))
```

####  Demo  例子 FRMVC 增加过滤请求层的用法



##### FilterExecutor  滤器的编写

```javascript
Executor=[
    userSignIn(data) {
        return $.ajax({
            type: "get",
            url: "/users/issignin",
            data,
            dataType: "json"
        })
    },
        // 自执行执行器 _ 下滑线开头  
 	_Filter1(data) {
            console.log('1', data)
            return Date.now()
	}
]
export default Executor
```

#####  Router注入过滤器

```javascript

import userFilter from './filter/userFilter.js'
//用户过滤器 . 过滤器层 

const router = new SMERouter('router-view', 'hash')
// 脱离路由  注册全局过滤执行器 多个
registerExecutor(FuserFilter.userSignIn,true);
//OR  路由注册
router.use(registerExecutor(userFilter.userSignIn))



```

##### Controller 使用过滤器

```javascript
//路由控制器调用
class Controller {   
    async render(req, res, next) {
         
        //执行全局执行器  获取注册时自执行的数据
        let result1 = await Executor._Filter1_;
         //再次执行 获取新的数据
        let result2 = await Executor._Filter1();
        //调用 用户验证过滤执行器  
        let isSingIn = await req.Executor.userSignIn(Data);

        if (isSingIn) {
            //如果验证成功 ，渲染
           res.render("Rander Page")
        }  
    }
}
export default new Controller()


```

> Author:吃火星的宝宝
>
> GitHub:  [embaobao](https://github.com/embaobao/)
>
> [packageGit Hub](https://github.com/embaobao/route-filter.emb-packages)
>
> Web :[个人网站](https://embaobao.cn)
>
> Thank you for using ! 

> 谢谢您的使用！
>
> Hope you can put forward more opinions!
>
> 希望您可以提出更多意见！
>
> [邮箱 Emil :chihuoxingdebaobao@163.com](chihuoxingdebaobao@163.com) 
>
> [我的意见箱 My suggestion box]( https://embaobao.cn)








