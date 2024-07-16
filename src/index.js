import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import TestApp from './TestApp';
import TextApp from './TextApp';
import NewTextApp from './NewTextApp';
import reportWebVitals from './reportWebVitals';
import ResizeTestApp from './ResizeTestApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ResizeTestApp />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
