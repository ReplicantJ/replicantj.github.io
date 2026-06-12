import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SpecimenPage from './SpecimenPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpecimenPage />
  </StrictMode>
)
