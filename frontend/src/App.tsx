import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Unsubscribe } from "./pages/Unsubscribe";
import { BookingConfirmation } from "./pages/BookingConfirmation";
import { BookingCancellation } from "./pages/BookingCancellation";
import { NotFound } from "./pages/NotFound";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";

// Admin panel is lazy-loaded so the heavy editor (react-quill) and ~20 admin
// pages are not shipped in the initial bundle to public visitors.
const AdminLayout = lazy(() => import("./components/admin/layout/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin").then((m) => ({ default: m.AdminLogin })));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboardPage })));
const AdminServicesPage = lazy(() => import("./pages/admin/services/AdminServices").then((m) => ({ default: m.AdminServicesPage })));
const AdminServiceForm = lazy(() => import("./pages/admin/services/AdminServiceForm").then((m) => ({ default: m.AdminServiceForm })));
const AdminEventsPage = lazy(() => import("./pages/admin/events/AdminEvents").then((m) => ({ default: m.AdminEventsPage })));
const AdminEventForm = lazy(() => import("./pages/admin/events/AdminEventForm").then((m) => ({ default: m.AdminEventForm })));
const AdminGalleryPage = lazy(() => import("./pages/admin/gallery/AdminGallery").then((m) => ({ default: m.AdminGalleryPage })));
const AdminReviewsPage = lazy(() => import("./pages/admin/reviews/AdminReviews").then((m) => ({ default: m.AdminReviewsPage })));
const AdminReviewForm = lazy(() => import("./pages/admin/reviews/AdminReviewForm").then((m) => ({ default: m.AdminReviewForm })));
const AdminContactsPage = lazy(() => import("./pages/admin/contacts/AdminContacts").then((m) => ({ default: m.AdminContactsPage })));
const AdminNewsletterPage = lazy(() => import("./pages/admin/newsletter/AdminNewsletter").then((m) => ({ default: m.AdminNewsletterPage })));
const AdminCampaignForm = lazy(() => import("./pages/admin/newsletter/AdminCampaignForm").then((m) => ({ default: m.AdminCampaignForm })));
const AdminPosts = lazy(() => import("./pages/admin/blog/AdminPosts").then((m) => ({ default: m.AdminPosts })));
const AdminPostForm = lazy(() => import("./pages/admin/blog/AdminPostForm").then((m) => ({ default: m.AdminPostForm })));
const AdminComments = lazy(() => import("./pages/admin/comments/AdminComments").then((m) => ({ default: m.AdminComments })));
const AdminBookingsPage = lazy(() => import("./pages/admin/bookings/AdminBookings").then((m) => ({ default: m.AdminBookingsPage })));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-base">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
    </div>
  );
}

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
    <SiteSettingsProvider>
      <Suspense fallback={<RouteFallback />}>
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
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="contatti" element={<Contatti />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="cookie-policy" element={<CookiePolicyPage />} />
            <Route path="unsubscribe" element={<Unsubscribe />} />
            {/* Online booking disabled — funnel to contacts (CTAs now point to WhatsApp). */}
            <Route path="prenota" element={<Navigate to="/contatti" replace />} />
            <Route path="conferma-prenotazione/:token" element={<BookingConfirmation />} />
            <Route path="cancella-prenotazione/:token" element={<BookingCancellation />} />
            <Route path="*" element={<NotFound />} />
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
            <Route path="blog" element={<AdminPosts />} />
            <Route path="blog/new" element={<AdminPostForm />} />
            <Route path="blog/:id/edit" element={<AdminPostForm />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="contacts" element={<AdminContactsPage />} />
            <Route path="newsletter" element={<AdminNewsletterPage />} />
            <Route path="newsletter/campaigns/new" element={<AdminCampaignForm />} />
            <Route path="newsletter/campaigns/:id/edit" element={<AdminCampaignForm />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Suspense>
    </SiteSettingsProvider>
  );
}

export default App;
