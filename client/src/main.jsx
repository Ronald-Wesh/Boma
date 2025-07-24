// // main.jsx
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'
// import { BrowserRouter } from 'react-router-dom'
// import { AuthProvider } from './context/AuthContext' // ✅ import it

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider> {/* ✅ wrap your app here */}
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// )
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);