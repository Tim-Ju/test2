import { RecordSet, extend, ReduxAction } from "@tencent/qcloud-lib";
import { generateFetcherActionCreator } from "@tencent/qcloud-redux-fetcher";
import { generateQueryActionCreator } from "@tencent/qcloud-redux-query";
import { generateWorkflowActionCreator, OperationHooks, OperationTrigger } from "@tencent/qcloud-redux-workflow";

import { Todo, TodoFilter, RootState } from "../models";
import * as ActionType from "../constants/ActionType";
import * as WebAPI from "../WebAPI";

type GetState = () => RootState;

const fetchActions = generateFetcherActionCreator({
    actionType: ActionType.FetchTodo,
    fetcher: (getState: GetState) => {
        return WebAPI.fetchTodo(getState().query);
    }
});

const queryActions = generateQueryActionCreator<TodoFilter>({
    actionType: ActionType.QueryTodo,
    bindFetcher: fetchActions
});

const selectionActions = {
    select: (todos: Todo[]): ReduxAction<Todo[]> => {
        return {
            type: ActionType.SelectTodo,
            payload: todos
        };
    }
};

const fetchAfterReset: OperationHooks = {
    [OperationTrigger.Reset]: (dispatch) => {
        dispatch(fetchActions.fetch())
        dispatch(selectionActions.select([]));
    }
};

const workflowActions = {
    addTodo: generateWorkflowActionCreator<Todo, void>({
        actionType: ActionType.AddTodo,
        workflowStateLocator: (state: RootState) => state.addTodo,
        operationExecutor: WebAPI.addTodo,
        after: fetchAfterReset
    }),

    inlineCompleteTodo: generateWorkflowActionCreator<Todo, void>({
        actionType: ActionType.InlineCompleteTodo,
        workflowStateLocator: (state: RootState) => state.inlineComplete,
        operationExecutor: WebAPI.completeTodo,
        after: extend({}, fetchAfterReset, {
            [OperationTrigger.Done]: dispatch => dispatch(workflowActions.inlineCompleteTodo.reset())
        })
    }),

    batchCompleteTodo: generateWorkflowActionCreator<Todo, void>({
        actionType: ActionType.BatchCompleteTodo,
        workflowStateLocator: (state: RootState) => state.batchComplete,
        operationExecutor: WebAPI.completeTodo,
        after: fetchAfterReset
    }),

    inlineDeleteTodo: generateWorkflowActionCreator<Todo, void>({
        actionType: ActionType.InlineDeleteTodo,
        workflowStateLocator: (state: RootState) => state.inlineDelete,
        operationExecutor: WebAPI.deleteTodo,
        after: extend({}, fetchAfterReset, {
            [OperationTrigger.Done]: dispatch => dispatch(workflowActions.inlineDeleteTodo.reset())
        })
    }),

    batchDeleteTodo: generateWorkflowActionCreator<Todo, void>({
        actionType: ActionType.BatchDeleteTodo,
        workflowStateLocator: (state: RootState) => state.batchDelete,
        operationExecutor: WebAPI.deleteTodo,
        after: fetchAfterReset
    }),
};

export const todoActions = extend({}, queryActions, selectionActions, fetchActions, workflowActions);