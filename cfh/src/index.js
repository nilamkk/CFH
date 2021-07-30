import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AuthContextProvider} from '../src/store/auth-context'


ReactDOM.render(

  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>,
  
  document.getElementById('root')
);

reportWebVitals();

// Notification.requestPermission((result)=>{
//   console.log("User choice ",result)
//   if(result!=='granted'){
//       console.log('Not allowed notifications!!')
//   }else{
//       console.log("Granted permission !!!")
//   }
//   console.log(Notification.permission)
// })
