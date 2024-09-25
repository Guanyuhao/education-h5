import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Loading from './components/loading';
import Loading from './components/loading/gifLoading';

import Home from './pages/home';
import { MapPage, ProvinceVideoListPage } from './router/index';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Suspense fallback={<Loading size={120} />}> */}
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />  {/* 首页 */}
          <Route path="/map" element={<MapPage />} />  {/* 地图页 */}
          <Route path="/list" element={<ProvinceVideoListPage />} />  {/* 地图页 */}
        </Routes>
      </BrowserRouter>
    </Suspense>
  </StrictMode>,
)
