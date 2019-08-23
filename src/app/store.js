/** NOT APPLY REDUX PERSIST */
// import { combineReducers, createStore } from "redux";
// import { reducer as reduxFormReducer } from "redux-form";
// import {
//     cryptoTableReducer,
//     newOrderTableReducer,
//     sidebarReducer,
//     themeReducer,
//     customizerReducer,
//     errorReducer,
// } from "../redux/reducers/index";

// const reducer = combineReducers({
//     form: reduxFormReducer, // mounted under "form",
//     theme: themeReducer,
//     sidebar: sidebarReducer,
//     cryptoTable: cryptoTableReducer,
//     newOrder: newOrderTableReducer,
//     customizer: customizerReducer,
//     errorReducer: errorReducer,
// });
// const store = createStore(reducer);

// export default store;

/** ADD REDUX PERSIST */
import { combineReducers, createStore } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
    cryptoTableReducer,
    newOrderTableReducer,
    sidebarReducer,
    themeReducer,
    customizerReducer,
    errorReducer,
    forSchoolReducer,
} from "../redux/reducers/index";

// Nested config of reducer
// const forSchoolPersistConfig = {
//     key: "for_school",
//     storage,
//     blacklist: [''],
//     whitelist: ['']
// };

const reducer = combineReducers({
    form: reduxFormReducer, // mounted under "form",
    theme: themeReducer,
    sidebar: sidebarReducer,
    cryptoTable: cryptoTableReducer,
    newOrder: newOrderTableReducer,
    customizer: customizerReducer,
    errorReducer: errorReducer,
    forSchoolReducer: forSchoolReducer,
});

const rootPersistConfig = {
    key: "root",
    storage,
    whitelist: ["forSchoolReducer"],
};
const persistedReducer = persistReducer(rootPersistConfig, reducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
