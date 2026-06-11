import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import Layout from './components/Layout/Layout.tsx'
import CaseStudy from './pages/CaseStudy.tsx'
import About from './pages/About.tsx'
import NotFound from './pages/NotFound.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import './styles/atelier-tokens.css'

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { index: true, element: <App /> },
        { path: 'work/:slug', element: <CaseStudy /> },
        { path: 'about', element: <About /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
