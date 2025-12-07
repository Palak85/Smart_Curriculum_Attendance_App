import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Tailwindsty.css'
import './index.css'
import App from './App.jsx'
import AuthContext from './context/authContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <AuthContext>
        <App />
      </AuthContext>
  </StrictMode>,
)
