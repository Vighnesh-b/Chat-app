import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Autentication/Login';
import Home from './Pages/Home';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/Login',
      element: <Login />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
