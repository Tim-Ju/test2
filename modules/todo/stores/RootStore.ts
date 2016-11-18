import { RootReducer } from "../reducers/RootReducer";
import { createStore } from "@tencent/qcloud-lib";

export function configStore() {

    const store = createStore(RootReducer);

    // hot reloading
    if (typeof module !== "undefined" && module.hot) {
        module.hot.accept("../reducers/RootReducer", () => {
            store.replaceReducer(require("../reducers/RootReducer").RootReducer);
        });
    }

    return store;
}