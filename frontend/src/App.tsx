import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import { BookingPage } from "./pages/Booking";
import { BookingConfirmation } from "./pages/BookingConfirmation";
import { BookingCancellation } from "./pages/BookingCancellation";

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
import { AdminCampaignForm } from "./pages/admin/newsletter/AdminCampaignForm";
import { AdminPosts } from "./pages/admin/blog/AdminPosts";
import { AdminPostForm } from "./pages/admin/blog/AdminPostForm";
import { AdminComments } from "./pages/admin/comments/AdminComments";
import { AdminBookingsPage } from "./pages/admin/bookings/AdminBookings";

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
    <HelmetProvider>
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
          <Route path="prenota" element={<BookingPage />} />
          <Route path="conferma-prenotazione/:token" element={<BookingConfirmation />} />
          <Route path="cancella-prenotazione/:token" element={<BookingCancellation />} />
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
    </HelmetProvider>
  );
}

export default App;
