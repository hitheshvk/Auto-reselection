import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { StudioView } from './views'
import './styles/globals.css'

// When this tab is opened with Studio context (mode + contentId in URL),
// render the external Studio view instead of the dashboard. This is what
// "Auto-reselect", "Reselect", "Re-author", and "Open in Studio" target via
// window.open(...).
const params = new URLSearchParams(window.location.search)
const isStudioTab = !!(params.get('mode') && params.get('contentId'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isStudioTab ? <StudioView /> : <App />}
  </StrictMode>
)
