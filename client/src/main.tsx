import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import RoomContext from './roomContext/RoomContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RoomContext>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </BrowserRouter>
    </RoomContext>
  </React.StrictMode>
)
