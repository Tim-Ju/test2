import { collectionPaging, RecordSet, findById } from "@tencent/qcloud-lib";
import { QueryState } from "@tencent/qcloud-redux-query";
import { OperationResult } from "@tencent/qcloud-redux-workflow";
import { Todo, TodoFilter } from "./models";

// 模仿服务器请求延时
function delay<T>(doing: Promise<T> | T, timeout = Math.random() * 300) {
    return new Promise<T>(resolve => {
        setTimeout(() => resolve(doing), timeout);
    });
}

// 模拟从服务器加载所有的 Todo
function loadAllTodos() {
    const store = localStorage.getItem("todo-store");
    const todos: Todo[] = store ? JSON.parse(store) : [];
    return delay(todos);
}

// 模拟保存所有 Todo 操作到服务器
function saveAllTodos(todos: Todo[]) {
    if (Math.random() < 0.1) {
        return Promise.reject(new Error("模拟操作出错，概率为十分之一"));
    }
    localStorage.setItem("todo-store", JSON.stringify(todos));
    return delay(null);
}

/**
 * 拉去所有的 Todo 数据
 * @param {QueryState<TodoFilter>} query 抓取使用的查询
 * @returns
 */
export async function fetchTodo(query: QueryState<TodoFilter>) {
    let todos = await loadAllTodos();

    const { date, search, filter, paging } = query;

    if (date) {
        const from = +new Date(query.date.from);
        const to = +new Date(query.date.to) + 24 * 3600 * 1000;
        todos = todos.filter(x => {
            const createdAt = +new Date(x.createdAt);
            return createdAt >= from && createdAt <= to;
        });
    }
    if (search) {
        todos = todos.filter(x => x.content.includes(query.search));
    }
    if (filter && typeof filter.completed === 'boolean') {
        todos = todos.filter(x => x.completed === query.filter.completed);
    }

    const total = todos.length;

    if (paging) {
        todos = collectionPaging(todos, query.paging);
    }

    const result: RecordSet<Todo> = {
        recordCount: total,
        records: todos
    };

    return result;
}

// 返回标准操作结果
function operationResult<T>(target: T[] | T, error?: any): OperationResult<T>[] {
    if (target instanceof Array) {
        return target.map(x => ({ success: !error, target: x, error }));
    }
    return [{ success: !error, target: target as T, error }];
}

type TodoOperationResult = OperationResult<Todo>;

/**
 * 添加一个 Todo
 * @param {Todo} todo 要添加的 Todo
 * @returns
 */
export async function addTodo(todos: Todo[]) {
    let allTodos = await loadAllTodos();
    allTodos = allTodos.concat(todos);
    try {
        await saveAllTodos(allTodos);
        return operationResult(todos);
    } catch (error) {
        return operationResult(todos, error);
    }
}

/**
 * 完成指定的 Todo
 * @param {Todo[]} todos 要完成的 Todo
 * @returns
 */
export async function completeTodo(todos: Todo[]) {
    const allTodos = await loadAllTodos();

    for (let todo of todos) {
        const toComplete = findById(allTodos, todo.id);
        if (toComplete) {
            toComplete.completed = true;
            toComplete.completedAt = new Date().toISOString();
        }
    }

    try {
        await saveAllTodos(allTodos);
        return operationResult(todos);
    } catch (error) {
        return operationResult(todos, error);
    }
}

/**
 * 删除指定的 Todo
 * @param {Todo[]} todos 要删除的 Todo
 * @returns
 */
export async function deleteTodo(todos: Todo[]) {
    const allTodos = await loadAllTodos();

    for (let todo of todos) {
        const toDelete = findById(allTodos, todo.id);
        if (toDelete) {
            allTodos.splice(allTodos.indexOf(toDelete), 1);
        }
    }

    try {
        await saveAllTodos(allTodos);
        return operationResult(todos);
    } catch (error) {
        return operationResult(todos, error);
    }
}