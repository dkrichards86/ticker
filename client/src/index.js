import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

import { BrowserRouter } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './index.css';
import 'typeface-roboto';
import Routes from './router/Routes';

import reducers from "./store/reducers";
import { hydrateStore } from './store/actions';
// import registerServiceWorker from './registerServiceWorker';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757de8',
            main: '#3f51b5',
            dark: '#002984',
            contrastText: '#FFF',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#FFF',
        }
    }
});

const store = createStore(
    reducers,
    composeWithDevTools(
        applyMiddleware(thunkMiddleware),
    )
);

store.dispatch(hydrateStore());

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <Routes />
            </MuiThemeProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
// registerServiceWorker();