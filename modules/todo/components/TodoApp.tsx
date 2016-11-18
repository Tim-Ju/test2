import * as React from "react";
import { connect, Provider } from "react-redux";

import { ReduxConnectedProps, bindActionCreators, findById } from "@tencent/qcloud-lib";

import { RootState } from "../models";
import { todoActions } from "../actions/TodoActions";
import { configStore } from "../stores/RootStore";

import { TodoActionPanel } from "./TodoActionPanel";
import { TodoTablePanel } from "./TodoTablePanel";
import { AddTodoDialog } from "./AddTodoDialog";

const store = configStore();

export class TodoAppContainer extends React.Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <TodoApp></TodoApp>
            </Provider>
        );
    }
}

export interface RootProps extends RootState {
    actions?: typeof todoActions;
}

const mapDispatchToProps = dispatch => bindActionCreators({
    actions: todoActions
}, dispatch);

@connect(state => state, mapDispatchToProps)
class TodoApp extends React.Component<RootProps, void> {
    render() {
        return (
            <div>
                <TodoActionPanel {...this.props}></TodoActionPanel>
                <TodoTablePanel {...this.props}></TodoTablePanel>
                <AddTodoDialog {...this.props}></AddTodoDialog>
            </div>
        );
    }
}