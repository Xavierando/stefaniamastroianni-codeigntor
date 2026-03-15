import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Home } from "./pages/Home";
import { Contatti } from "./pages/Contatti";
import { ChiSono } from "./pages/ChiSono";
import { MaternitaPage } from "./pages/Maternita";
import { TrattamentiPage } from "./pages/Trattamenti";
import { ConsulenzePage } from "./pages/Consulenze";
import { YogaPage } from "./pages/YogaPage";
import { EventiPage } from "./pages/Eventi";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicy";
import { CookiePolicyPage } from "./pages/CookiePolicy";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="chi-sono" element={<ChiSono />} />
        <Route path="maternita" element={<MaternitaPage />} />
        <Route path="trattamenti" element={<TrattamentiPage />} />
        <Route path="consulenze" element={<ConsulenzePage />} />
        <Route path="yoga-e-meditazione" element={<YogaPage />} />
        <Route path="laboratori-eventi" element={<EventiPage />} />
        <Route path="contatti" element={<Contatti />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="cookie-policy" element={<CookiePolicyPage />} />
      </Route>
    </Routes>
  );
}

export default App;
