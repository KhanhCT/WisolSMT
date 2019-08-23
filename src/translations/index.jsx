import resources from "./resources";

export const config = {
    interpolation: { escapeValue: false }, // React already does escaping
    resources,
    react: {
        wait: false,
        bindI18n: "languageChanged loaded",
        bindStore: "added removed",
        nsMode: "default",
    },
};

export { resources };
