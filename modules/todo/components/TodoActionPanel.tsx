import * as React from "react";

import { extend } from "@tencent/qcloud-lib";

import {
    ActionPanel,
    Button,
    ButtonProps,
    SearchBox,
    SearchBoxProps,
    DatePicker,
    DatePickerProps,
    defaultDatePickerOptions,
    WorkflowDialogGeneric,
    WorkflowDialogPropsGeneric
} from "@tencent/qcloud-component";

import { Todo } from "../models";
import { RootProps } from "./TodoApp";

export class TodoActionPanel extends React.Component<RootProps, void> {
    render() {
        const { query, selection, actions } = this.props;

        const uncompletedSelection = selection.filter(x => !x.completed);

        return (
            <ActionPanel>
                <div style={{ float: "right", width: 250 }}>
                    <SearchBox
                        keyword={query.keyword}
                        onInput={actions.changeKeyword}
                        onSearch={actions.performSearch}
                        style={{ float: 'right' }}
                        className="m">
                    </SearchBox>
                </div>

                <Button className="m"
                    onClick={() => actions.addTodo.start() }>新建</Button>

                <Button className="m weak"
                    onClick={() => actions.batchCompleteTodo.start(uncompletedSelection) }
                    disabled={!uncompletedSelection.length}>标为完成</Button>

                <Button className="m weak"
                    onClick={() => actions.batchDeleteTodo.start(selection) }
                    disabled={!selection.length}>删除</Button>

                <div className="tc-15-v-sep"></div>

                <DatePicker ref="datePicker" onPick={actions.changeDate} {...defaultDatePickerOptions}></DatePicker>

                { this._renderBatchCompleteDialog() }
                { this._renderBatchDeleteDialog() }
            </ActionPanel>
        );
    }

    public componentDidMount() {
        const datePicker = this.refs["datePicker"] as DatePicker;
        this.props.actions.changeDate(datePicker.getValue());
    }

    private _renderBatchCompleteDialog() {
        const BatchCompleteWorkflowDialog = WorkflowDialogGeneric as new () => WorkflowDialogGeneric<Todo, void>;
        type BatchCompleteWorkflowDialogProps = WorkflowDialogPropsGeneric<Todo, void>;

        const props: BatchCompleteWorkflowDialogProps = {
            actions: this.props.actions.batchCompleteTodo,
            workflow: this.props.batchComplete,
            caption: "批量完成",
            confirmMessage: "确定这些任务都完成了？",
            performingMessage: "正在提交...",
            doneMessage: "已经完成了！好棒！",
            itemFailMessage: "提交失败，人品够差的",
            itemRender: x => x.content,
            performButtonText: "是的，完成了",
            summaryRender: count => `你正在完成下面${count}个任务`,
            doneSummaryRender: (successCount, failedCount) => `成功完成了 ${successCount} 个任务${ failedCount ? `失败 ${failedCount} 个` : ""}`
        };

        return <BatchCompleteWorkflowDialog {...props} />
    }


    private _renderBatchDeleteDialog() {
        const BatchDeleteWorkflowDialog = WorkflowDialogGeneric as new () => WorkflowDialogGeneric<Todo, void>;
        type BatchDeleteWorkflowDialogProps = WorkflowDialogPropsGeneric<Todo, void>;

        const props: BatchDeleteWorkflowDialogProps = {
            actions: this.props.actions.batchDeleteTodo,
            workflow: this.props.batchDelete,
            caption: "批量删除任务",
            confirmMessage: "确定这些任务都不要了？",
            performingMessage: "正在提交...",
            doneMessage: "删除完成！",
            itemFailMessage: "删除失败，人品够差的",
            itemRender: x => x.content,
            performButtonText: "是的，不要了",
            summaryRender: count => `你正在删除下面${count}个任务`,
            doneSummaryRender: (successCount, failedCount) => `成功删除了 ${successCount} 个任务${failedCount ? `失败 ${failedCount} 个` : ""}`
        };

        return <BatchDeleteWorkflowDialog {...props} />
    }
}