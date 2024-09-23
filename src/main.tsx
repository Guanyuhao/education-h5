import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from './components/loading';
import Home from './pages/home';

import './index.css'

const Map = lazy(() => import('./pages/map'))


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loading size={120} />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />  {/* 首页 */}
          <Route path="/map" element={<Map />} />  {/* 地图页 */}
        </Routes>
      </BrowserRouter>
    </Suspense>
  </StrictMode>,
)
