import * as React from "react";

import { TodoAppContainer } from "./components/TodoApp";

export class TodoExample extends React.Component<any, any> {
    render() {
        return <div style={{ marginTop: 20 }}><TodoAppContainer></TodoAppContainer></div>;
    }
}