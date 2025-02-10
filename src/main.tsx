import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './Layout.tsx'
import { getProjects } from './models/queries.ts'

async function loadProjects() {
  return await getProjects()
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    loader: loadProjects,
    children: [
      {
        path: ':projectId',
        element: <App/>,
      }
    ]
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/> 
  </StrictMode>,
)
