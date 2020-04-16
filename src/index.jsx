import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,observer,inject} from "mobx-react"
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Router} from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';


import '@/index.css';
import './topology/flow/react-tagsinput.css'
import App from '@/App.jsx';
import appStore from '@static/store/index' ;
import theme from '@static/themes/index';
//
ReactDOM.render(
    <ThemeProvider theme={theme} >
        <BrowserRouter basename="/" history={Router.history}>
            <Provider store={appStore}>
                <CssBaseline />
                <App />
            </Provider>
        </BrowserRouter>
    </ThemeProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
serviceWorker.register();

//  +++++ 加入+++++
//if (module.hot) {
//    module.hot.accept();
//}
