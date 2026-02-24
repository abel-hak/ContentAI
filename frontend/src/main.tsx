import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'rgba(15, 15, 35, 0.9)',
          color: '#e2e8f0',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          backdropFilter: 'blur(10px)',
        },
        success: {
          iconTheme: { primary: '#6366f1', secondary: '#e2e8f0' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#e2e8f0' },
        },
      }}
    />
    <App />
  </StrictMode>,
)
