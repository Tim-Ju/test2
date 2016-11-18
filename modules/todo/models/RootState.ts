import { RecordSet } from "@tencent/qcloud-lib";
import { FetcherState } from "@tencent/qcloud-redux-fetcher";
import { QueryState } from "@tencent/qcloud-redux-query";
import { WorkflowState } from "@tencent/qcloud-redux-workflow";

import { Todo, TodoFilter } from "./";

type TodoWorkflow = WorkflowState<Todo, void>;

export interface RootState {
    /**
     * 当前的 Todo 查询
     * */
    query?: QueryState<TodoFilter>;

    /**
     * 当前的 Todo 数据
     * */
    todos?: FetcherState<RecordSet<Todo>>;

    /**
     * 当前选中的 Todo
     * */
    selection?: Todo[];

    /**
     * 添加 Todo 操作流
     * */
    addTodo?: TodoWorkflow;

    /**
     * 行内完成 Todo 操作流
     * */
    inlineComplete?: TodoWorkflow;

    /**
     * 批量删除 Todo 操作流
     * */
    batchComplete?: TodoWorkflow;

    /**
     * 行内删除 Todo 操作流
     * */
    inlineDelete?: TodoWorkflow;

    /**
     * 批量删除 Todo 操作流
     * */
    batchDelete?: TodoWorkflow;
}