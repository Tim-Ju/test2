import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entry } from "@tencent/qcloud-nmc";

import { TodoExample } from "./modules/todo";

Entry.register({
    businessKey: "example",

    routes: {
        /**
         * @url https://console.qcloud.com/example
         * */
        index: {
            // 模块标题，会生效到浏览器标题上
            title: "概览-示例业务",

            // 要渲染的 React 组件，应该是一个链接了 Redux 的容器组件。
            container: <div>概览页</div>
        },

        /**
         * @url https://console.qcloud.com/example/todo
         */
        todo: {
            title: "示例应用-示例业务",
            container: <TodoExample></TodoExample>
        }
    }
});

window["todoExample"] = <TodoExample></TodoExample>;