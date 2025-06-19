import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
     
          <AuthProvider>
            <SocketProvider>
              <NotificationProvider>
             <Toaster position="top-right" reverseOrder={false} /> {/* ✅ This renders toast */}
            <App />
            </NotificationProvider>
            </SocketProvider>
          </AuthProvider>
        
    </BrowserRouter>
  </React.StrictMode>
);
