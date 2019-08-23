export default {
    async render(req, res, next) {

        let result = await req.filter.Filter1;
        //1566569530256 页面加载后执行的结构 不刷新 永远保持
        let result2 = await req.filter._Filter1();
        //新的执行

     
        let result3 = await _filter._Filter1();
           // 执行全局执行器
        
        console.log(result);
        console.log(result2);
        res.render("Rander Page")
    }
}