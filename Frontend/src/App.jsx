import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Autentication/Login';
import Home from './Pages/Home';
import { WebSocketProvider } from './context/webSocketContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
  },
});

function App() {
  return (
    <WebSocketProvider>
      <RouterProvider router={router} />
    </WebSocketProvider>
  );
}

export default App;