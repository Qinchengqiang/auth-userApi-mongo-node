# auth-userApi-mongo-node

具体数据库配置信息在config.js中设置

### 整体构架
开发前先进行我们设计的构想

* 路由设计
    * POST /api/signup: 用户注册
    * POST /api/user/accesstoken: 账号验证,获取token
    * GET /api/user/user_info: 获得用户信息,需验证

* user 模型设计
    * name : 用户名
    * password: 密码
    * token: 验证相关token


先看看我们的项目文件夹

``` javascript
- routes/
---- index.js
---- users.js
- models/
---- user.js
- config.js
- package.json
- passport.js
- index.js
```

`git clone https://github.com/Qinchengqiang/auth-userApi-mongo-node.git`pull 到本地

接着在项目根文件夹下安装我们所需的依赖

```
npm install 

```
* express: 我们的主要开发框架
* mongoose: 用来与MongoDB数据库进行交互的框架，请提前安装好MongoDB在PC上
* morgan: 会将程序请求过程的信息显示在Terminal中，以便于我们调试代码
* jsonwebtoken: 用来生成我们的token
* passport: 非常流行的权限验证库
* bcrypt: 对用户密码进行hash加密


### 具体调试

现在就可以运行我们的代码看具体运作过程了！为了便于调试与参数的收发，我们使用[postman](https://www.getpostman.com/)(可在Chrome上或Mac上安装)来操作.

`npm start`运行我们的本地服务器，访问 [localhost:8080/]()
应该就可以看到我们所返回的初始hellow json值了，然我们继续深入测试。



POST访问[localhost:8080/api/signup](),我们来注册一个新用户，注意要设置`body`的`Content-Type`为`x-www-form-urlencoded` 以便我们的`body-parser`能够正确解析,好的我们成功模拟创建了我们的新用户。


连接一下数据库看下我们的用户信息是否也被正确存储(注:我使用的是MongoChef,十分强大MongoDB数据库管理软件),我们可以看到,我的password也被正确加密保存了。


接着POST访问[localhost:8080/api/user/accesstoken](),来为我的用户获得专属token，POST过程与注册相关,可以看到也正确生成我们的token值。


再看下我们的数据库中的用户信息，token值也被存入了进来，便于我们之后进行权限验证。


GET访问[localhost:8080/api/user/user_info](),同时将我们的token值在`Header`中以 `Authorization: token` 传入,正确获得用户名则表示我们访问请求通过了验证。


如果token值不正确，则返回HTTP状态码 401 Unauthorized 并拒绝访问请求。到这里我们的权限验证功能也就基本实现了。

