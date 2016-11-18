import { combineReducers } from "redux";
import { reduceToPayload, RecordSet } from "@tencent/qcloud-lib";
import { generateFetcherReducer } from "@tencent/qcloud-redux-fetcher";
import { generateQueryReducer } from "@tencent/qcloud-redux-query";
import { generateWorkflowReducer } from "@tencent/qcloud-redux-workflow";

import { Todo } from "../models";

import * as ActionType from "../constants/ActionType";

export const RootReducer = combineReducers({
    query: generateQueryReducer({
        actionType: ActionType.QueryTodo
    }),

    todos: generateFetcherReducer<RecordSet<Todo>>({
        actionType: ActionType.FetchTodo,
        initialData: {
            recordCount: 0,
            records: [] as Todo[]
        }
    }),

    selection: reduceToPayload(ActionType.SelectTodo, []),

    addTodo: generateWorkflowReducer({
        actionType: ActionType.AddTodo
    }),
    inlineComplete: generateWorkflowReducer({
        actionType: ActionType.InlineCompleteTodo
    }),
    batchComplete: generateWorkflowReducer({
        actionType: ActionType.BatchCompleteTodo
    }),
    inlineDelete: generateWorkflowReducer({
        actionType: ActionType.InlineDeleteTodo
    }),
    batchDelete: generateWorkflowReducer({
        actionType: ActionType.BatchDeleteTodo
    })
});