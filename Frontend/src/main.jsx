import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LoadingProvider } from './components/LoadingContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <LoadingProvider>
        <App />
      </LoadingProvider>
  </BrowserRouter>
  </StrictMode>,
)
