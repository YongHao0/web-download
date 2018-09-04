### Web 下载模块

#### Download.save(option, callback)

保存文件

**option 参数说明:**

| 参数       | 类型     | 是否必填 | 说明 | 桌面版版本 |
| :----- | :----- | :----- | :----- | :----- |
| url  | String | 是  | 文件下载地址  | 2.0.0 |
| name  | String | 否  | 文件保存后的别名, 默认为原文件名 | 2.0.0 |

**callback 参数说明:**

| 参数       | 类型     | 是否必填 | 说明 | 桌面版版本 |
| :----- | :----- | :----- | :----- | :----- |
| onBefore  | Function | 否  |  即将下载回调  | 2.0.0 |
| onProgress | Function | 否  |  下载中回调  | 2.0.0 |
| onComplete | Function | 否  |  下载完成回调  | 2.0.0 |
| onCancel | Function | 否  |  下载取消回调  | 2.0.0 |
| onError | Function | 否  |  下载失败回调  | 2.0.0 |

**示例代码:**

```js
var option = {
    url: 'http://cdn.ronghub.com/thinking-face.png',
    name: 'face.png'
};
var manager = File.save(option, {
    onProgress: function(file) {
        var loaded = file.loaded;
        var total = file.total;
    }
});
// 暂停下载
manager.pause()；
```

#### onBefore(callback){#onBefore}

即将下载回调

**onBefore 回调参数说明:**

| 参数       | 类型   | 说明 | 桌面版版本 |
| :----- | :----- | :----- | :----- |
| total  | String | 文件总大小  | 2.0.0 |
| path  | String | 文件保存路径 | 2.0.0 |

**示例代码:**

```js
var option = { url: 'http://cdn.ronghub.com/thinking-face.png' };
var manager = File.save(option, {
    onBefore: function(file) {
        var total = file.total;
        var path = file.path;
    }
});
```

#### onProgress(callback){#onProgress}

下载中回调

**onProgress 回调参数说明:**

| 参数       | 类型      | 说明 | 桌面版版本 |
| :----- | :----- | :----- | :----- |
| loaded  | String | 已下载文件大小  | 2.0.0 |
| total  | String |  文件总大小  | 2.0.0 |
| path  | String | 文件保存路径 | 2.0.0 |

**示例代码:**

```js
var option = { url: 'http://cdn.ronghub.com/thinking-face.png' };
var manager = File.save(option, {
    onProgress: function(file) {
        var loaded = file.loaded;
        var total = file.total;
        var progress = loaded / total;
    }
});
```

#### onComplete(callback){#onComplete}

下载完成回调

**onComplete 回调参数说明:**

| 参数       | 类型     | 说明 | 桌面版版本 |
| :----- | :----- | :----- | :----- |
| loaded  | String  | 已下载文件大小  | 2.0.0 |
| total  | String  | 文件总大小  | 2.0.0 |
| path  | String  | 文件保存路径 | 2.0.0 |

**示例代码:**

```js
var option = { url: 'http://cdn.ronghub.com/thinking-face.png' };
var manager = File.save(option, {
    onComplete: function(file) {
        var loaded = file.loaded;
        var total = file.total;
        var path = file.path;
    }
});
```

#### onCancel(callback){#onCancel}

下载取消回调

**onCancel 回调参数说明:**

| 参数       | 类型    | 说明 | 桌面版版本 |
| :----- | :----- | :----- | :----- |
| loaded  | String | 已下载文件大小  | 2.0.0 |
| total  | String |  文件总大小  | 2.0.0 |
| path  | String | 文件保存路径 | 2.0.0 |

**示例代码:**

```js
var option = { url: 'http://cdn.ronghub.com/thinking-face.png' };
var manager = File.save(option, {
    onCancel: function(file) {
        var loaded = file.loaded;
        var total = file.total;
        var path = file.path;
    }
});
```

#### onError(callback){#onError}

下载失败

**onError 回调参数说明:**

| 参数       | 类型    | 说明 | 桌面版版本 |
| :----- | :----- | :----- | :----- |
| code  | String | 错误码  | 2.0.0 |
| message  | String |  错误信息  | 2.0.0 |

**常见错误码:**
* ENOTFOUND：DNS 找不到域名. 请检查 1. 域名是否写错 2. 网络连接是否正常
* ECONNREFUSED：防火墙或代理程序无法访问网络. 请检查防火墙或者代理设置
* EPIPE：nodejs 版本过低
* ETIMEDOUT：连接超时

**示例代码:**

```js
var option = { url: 'http://cdn.ronghub.com/thinking-face.png' };
var manager = File.save(option, {
    onError: function(file) {
        var code = file.code;
        var message = file.message;
    }
});
```

#### manager.pause(){#pause}

暂停下载

#### manager.resume(){#resume}

恢复下载

#### manager.abort(){#abort}

中断下载