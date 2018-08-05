import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CutRouter from './router';
import { MuiThemeProvider, createMuiTheme } from '../node_modules/@material-ui/core';
//import registerServiceWorker from './registerServiceWorker';

const theme = createMuiTheme({
  palette: {
    //type: 'dark',
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CutRouter />
    </MuiThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
//registerServiceWorker();
