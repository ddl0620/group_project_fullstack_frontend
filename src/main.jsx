import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { store } from './store/store.js';
import { Provider } from 'react-redux';
createRoot(document.getElementById('root')).render(
    // StrictMode is used to highlight potential problems in an application.
    // It activates additional checks and warnings for its descendants.

    <>
        {/*Wrap the app inside the Redux,
      so allow App can access all content in redux*/}
        <Provider store={store}>
            {/*Wrap the app inside the BrowserRouter,
        so allow App can access all content in react-router-dom*/}
            <App />
            {/*<App2/>*/}
        </Provider>
    </>
);
