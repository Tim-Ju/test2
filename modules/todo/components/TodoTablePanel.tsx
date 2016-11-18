import * as React from "react";

import {
    TablePanelGeneric,
    TablePanelColumnGeneric,
    TablePanelFilterHeadCell,
    TablePanelFilterHeadCellProps,
    TablePanelFilterHeadCellOption,
    TablePanelSmartTip,
    Pagination,
    PaginationProps,
    WorkflowPopupGeneric,
    WorkflowPopupProps,
    WorkflowPopupTextConfig
} from "@tencent/qcloud-component";

import { WorkflowState, OperationState } from "@tencent/qcloud-redux-workflow";

import { Todo, TodoFilter } from "../models";
import { RootProps } from "./TodoApp";

type Column = TablePanelColumnGeneric<Todo>;
const TablePanel = TablePanelGeneric as new () => TablePanelGeneric<Column, Todo>;

export class TodoTablePanel extends React.Component<RootProps, void> {
    render() {
        return (
            <div>
                {this._renderTablePanel()}
            </div>
        );
    }

    private _renderTablePanel() {
        const { query, todos, selection, actions } = this.props;

        const colunms: Column[] = [
            { id: "checker", checker: true },
            { id: "createdAt", headTitle: "创建于", bodyCell: x => x.createdAt.replace(/T|\.\d+Z/g, " ") },
            {
                id: "completed",
                headTitle: "状态",
                bodyCell: x => x.completed
                    ? <div><i className="n-success-icon"></i> <span className="text">已完成</span></div>
                    : <div><i className="n-restart-icon"></i> <span className="text">未完成</span></div>
            },
            { id: "content", headTitle: "内容", bodyCell: x => x.content },
            { id: "completeAt", headTitle: "完成于", bodyCell: x => x.completedAt ? x.completedAt.replace(/T|\.\d+Z/g, " ") : "-" },
            { id: "operation", headTitle: "操作", bodyCell: x => this._renderOperationCell(x) }
        ];

        const smartTip = TablePanelSmartTip.render({
            fetcher: todos,
            query,
            onClearSearch: () => actions.performSearch(""),
            onRetry: () => actions.fetch(),
            emptyTips: "您干掉了所有的 Todo，好棒！"
        });

        return (
            <div>
                <TablePanel
                    columns={colunms}
                    records={todos.data.records}
                    selection={selection}
                    onSelectionChange={actions.select}
                    topTip={smartTip}>
                </TablePanel>
            </div>
        );
    }

    private _renderOperationCell(todo: Todo) {
        const { actions, inlineComplete, inlineDelete } = this.props;

        const matchPerformingWorkflow = (workflow: WorkflowState<Todo, void>) => {
            return workflow.operationState === OperationState.Performing
                && workflow.targets
                && workflow.targets[0]
                && workflow.targets[0].id === todo.id;
        };

        const isCompleting = matchPerformingWorkflow(inlineComplete);
        const isDeleting = matchPerformingWorkflow(inlineDelete);

        const disableStyle = { color: "gray", cursor: "not-allowed" };

        const renderCompleteButton = () => {
            const text = isCompleting ? "请稍后..." : "标为完成";
            const disabled = todo.completed || isCompleting;
            const complete = () => {
                actions.inlineCompleteTodo.start([todo]);
                actions.inlineCompleteTodo.perform();
            }
            return (
                <a href="javascript: void(0)"
                    style={ disabled ? disableStyle : {} }
                    onClick={() => disabled || complete() }>{text}
                </a>
            );
        };

        const renderDeleteButton = () => {
            const disabled = isDeleting;
            return (
                <a href="javascript: void(0)"
                    style={ disabled ? disableStyle : {} }
                    onClick={() => disabled || actions.inlineDeleteTodo.start([todo]) }>删除</a>
            );
        };

        const renderDeletePopup = () => {
            const WorkflowPopup = WorkflowPopupGeneric as new() => WorkflowPopupGeneric<Todo, void>;
            const props: WorkflowPopupProps<Todo, void> = {
                workflow: inlineDelete,
                actions: actions.inlineDeleteTodo,
                targets: [todo],
                commonTexts: {
                    performButtonText: "删除"
                },
                confirmTexts: {
                    title: "确认删除？",
                    message: "删除后不能恢复"
                },
                performingTexts: {
                    title: "正在删除",
                    message: "很快的..."
                },
                doneTexts: {
                    title: "删除玩了",
                    message: "上面有个错别字"
                },
                failTexts: {
                    title: "删除失败",
                    message: "运气够差的，这是随机失败的。"
                },
                allowRetry: true,
                popupProps: {
                    alignPosition: "end",
                    style: {
                        width: 300,
                        marginLeft: -180,
                        marginTop: 10
                    }
                }
            };
            return <WorkflowPopup {...props}></WorkflowPopup>;
        };

        return (
            <div>
                { renderCompleteButton() }
                &nbsp; | &nbsp;
                { renderDeleteButton() }
                { renderDeletePopup() }
            </div>
        );
    }
}