import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components';
import { Home, Catalog, About } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<Navigate to="/#faq" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
