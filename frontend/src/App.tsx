import { useEffect } from "react";
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
import { EventDetail } from "./pages/EventDetail";

import { AdminLayout } from "./components/admin/layout/AdminLayout";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboardPage } from "./pages/admin/AdminDashboard";
import { AdminServicesPage } from "./pages/admin/services/AdminServices";
import { AdminServiceForm } from "./pages/admin/services/AdminServiceForm";
import { AdminEventsPage } from "./pages/admin/events/AdminEvents";
import { AdminEventForm } from "./pages/admin/events/AdminEventForm";
import { AdminGalleryPage } from "./pages/admin/gallery/AdminGallery";
import { AdminReviewsPage } from "./pages/admin/reviews/AdminReviews";
import { AdminReviewForm } from "./pages/admin/reviews/AdminReviewForm";
import { AdminContactsPage } from "./pages/admin/contacts/AdminContacts";
import { AdminNewsletterPage } from "./pages/admin/newsletter/AdminNewsletter";

function App() {
  useEffect(() => {
    // Remove the initial HTML loader smoothly once React is mounted
    const loader = document.getElementById("initial-loader");
    if (loader) {
      // Small timeout ensures paint has happened
      setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.remove();
        }, 800); // Matches CSS transition duration
      }, 100);
    }
  }, []);

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
        <Route path="laboratori-eventi/:slug" element={<EventDetail />} />
        <Route path="contatti" element={<Contatti />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="cookie-policy" element={<CookiePolicyPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="services/new" element={<AdminServiceForm />} />
        <Route path="services/:id/edit" element={<AdminServiceForm />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="events/new" element={<AdminEventForm />} />
        <Route path="events/:id/edit" element={<AdminEventForm />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="reviews/new" element={<AdminReviewForm />} />
        <Route path="reviews/:id/edit" element={<AdminReviewForm />} />
        <Route path="contacts" element={<AdminContactsPage />} />
        <Route path="newsletter" element={<AdminNewsletterPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
  );
}

export default App;
