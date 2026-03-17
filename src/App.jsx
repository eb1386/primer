import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Learn from './pages/Learn';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/home" element={<Landing />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </HashRouter>
  );
}
