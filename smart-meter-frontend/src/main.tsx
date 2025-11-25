import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
// @ts-ignore
import WelcomePage from "./components/WelcomePage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />
  }
]);

createRoot(document.getElementById('root')!)
  .render(<RouterProvider router={router} />);
