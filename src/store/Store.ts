import { createStore } from "vuex";

import { builderDataStore } from "../builder/BuilderData";

import { UndoRedo, undoRedoStore } from "../builder/UndoRedo";

export const store = createStore({
    modules: {
        undoRedo: undoRedoStore,
        builderData: builderDataStore,
    },
    plugins: [UndoRedo],
    // Activate strict mode in dev so that we can debug stuff properly.
    strict: import.meta.env.DEV
});

store.dispatch("initialize");
