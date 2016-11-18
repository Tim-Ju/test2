import { Identifiable } from "@tencent/qcloud-lib";

export interface Todo extends Identifiable {

    /**
     * 要完成的内容
     * */
    content: string;

    /**
     * 是否已完成
     * */
    completed: boolean;

    /**
     * 创建时间
     * */
    createdAt: string;

    /**
     * 完成时间
     * */
    completedAt: string;
}