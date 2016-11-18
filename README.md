QCloud Web 应用开发平台
======================

本平台作用是提供给鹅厂的开发者快速基于 React + Redux + TypeScript 的技术栈来搭建 Web 应用。尤其针对 QCloud 控制台的应用。

## 安装

本平台可以直接通过从 Git 仓库 Clone 下来的形式来获取：

```sh
git clone http://git.code.oa.com/CFETeam/qcloud-web.git <YOUR_PROJECT_NAME>
```

项目依赖 TypeScript 和 WebPack，您需要通过 TNPM 将他们安装到全局 NPM 包里：

```sh
tnpm install typescript webpack -g
```

然后，通过 tnpm 安装项目依赖：

```sh
tnpm install
```

然后，项目就安装完成啦！

## 开发

执行开发命令：

```sh
tnpm run dev
```

即可进入开发模式，控制台输出构建完成后，可以从 http://localhost:8081 访问开发环境，里面有进一步的开发指引。

## 发布

执行发布命令：

```sh
tnpm run build
```

即可发布当前代码到 `static` 目录。

## 文档

请查阅项目 [Wiki](http://git.code.oa.com/CFETeam/qcloud-web/wikis/home) 来了解更多信息。

## 需要更多帮助

欢迎骚扰 `@techirdliu`。