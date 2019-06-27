import React from "react";
import App from "./app/App";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { store, persistor } from "./app/store";
import ScrollToTop from "./app/ScrollToTop";
import { config as i18nextConfig } from "./translations/index";
import LanguageDetector from "i18next-browser-languagedetector";
import { PersistGate } from "redux-persist/integration/react";

i18next.use(LanguageDetector).init(i18nextConfig);

render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter basename="/">
                <I18nextProvider i18n={i18next}>
                    <ScrollToTop>
                        <Route component={App} />
                    </ScrollToTop>
                </I18nextProvider>
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById("root")
);
