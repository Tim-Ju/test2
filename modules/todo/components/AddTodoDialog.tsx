import * as React from "react";
import * as ReactDom from "react-dom";

import { uuid } from "@tencent/qcloud-lib";
import { OperationState, isSuccessWorkflow } from "@tencent/qcloud-redux-workflow";

import {
    Dialog,
    DialogBody,
    DialogFooter,
    DialogProps,
    Button,
    ButtonProps
} from "@tencent/qcloud-component";

import { Todo } from "../models";

import { RootProps } from "./TodoApp";

interface DialogState {
    todoLines: string;
}

export class AddTodoDialog extends React.Component<RootProps, DialogState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            todoLines: ""
        };
    }

    render() {
        const workflow = this.props.addTodo;
        const action = this.props.actions.addTodo;

        if (workflow.operationState === OperationState.Pending) {
            return <noscript></noscript>
        }

        const cancel = () => {
            if (workflow.operationState === OperationState.Started) {
                action.cancel();
            }
        }

        const perform = () => {
            const focus = () => {
                const input = ReactDom.findDOMNode(this.refs["todoLines"]) as HTMLTextAreaElement;
                input.select();
                input.focus();
            };
            if (!this.state.todoLines) return focus();

            const todos: Todo[] = this.state.todoLines.split("\n")
                .filter(x => /\S/.test(x))
                .map(x => {
                    const todo: Todo = {
                        id: uuid(),
                        content: x,
                        completed: false,
                        createdAt: new Date().toISOString(),
                        completedAt: null
                    }
                    return todo;
                });
            if (!todos.length) return focus();

            action.start(todos);
            action.perform();
        }

        const failed = workflow.operationState === OperationState.Done && !isSuccessWorkflow(workflow);

        return (
            <Dialog caption="添加任务" onClose={cancel}>
                <DialogBody>
                    { failed &&
                        <p className="tc-15-msg error">
                            <span className="tip-info">
                                <span className="msg-span">添加失败，请重试</span>
                            </span>
                        </p>
                    }
                    <div className="form-unit">
                        <textarea
                            key="todoLines"
                            className="tc-15-input-textarea"
                            style={{width: 485}}
                            value={this.state.todoLines}
                            onChange={e => this.setState({ todoLines: e.target.value }) }></textarea>
                        <p className="form-input-help">输入要完成的事项，每个一行</p>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        disabled={!this.state.todoLines || workflow.operationState === OperationState.Performing }
                        onClick={perform}>{ failed ? "重试" : "添加"}</Button>
                    <Button className="weak" onClick={cancel}>取消</Button>
                </DialogFooter>
            </Dialog>
        );
    }

    componentDidUpdate() {
        setTimeout(() => {
            if (this.props.addTodo.operationState === OperationState.Done) {
                this.props.actions.addTodo.reset();
            }
        });
    }
}