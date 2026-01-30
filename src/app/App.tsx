import React from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeaturesSection } from "./components/FeaturesSection";
import { DocumentServices } from "./components/DocumentServices";
import { EventsSection } from "./components/EventsSection";
import { NewsSection } from "./components/NewsSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";
import { ContactPage } from "./components/ContactPage";
import { OfficialTranscriptRequest } from "./components/OfficialTranscriptRequest";
import { OfficialTranscriptStatus } from "./components/OfficialTranscriptStatus";
import { OriginalDegreeRequest } from "./components/OriginalDegreeRequest";
import { StudentCopyRequest } from "./components/StudentCopyRequest";
import { TemporaryDegreeRequest } from "./components/TemporaryDegreeRequest";
import { SupportingLetterRequest } from "./components/SupportingLetterRequest";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminLogin } from "./components/AdminLogin";
import { StudentLogin } from "./components/StudentLogin";
import { StudentRegister } from "./components/StudentRegister";
import { StudentDashboard } from "./components/StudentDashboard";
import {
  NavigationProvider,
  useNavigation,
} from "./context/NavigationContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { currentPage } = useNavigation();
  const { isAuthenticated, isAdmin } = useAuth();

  if (currentPage === "admin-login") {
    return (
      <div className="min-h-screen bg-white">
        <AdminLogin />
      </div>
    );
  }

  if (currentPage === "admin") {
    // Redirect to login if not authenticated
    if (!isAuthenticated || !isAdmin) {
      return (
        <div className="min-h-screen bg-white">
          <AdminLogin />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-white">
        <AdminDashboard />
      </div>
    );
  }

  if (currentPage === "contact") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <ContactPage />
        <Footer />
      </div>
    );
  }

  if (currentPage === "official-request") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <OfficialTranscriptRequest />
      </div>
    );
  }

  if (currentPage === "official-status") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <OfficialTranscriptStatus />
      </div>
    );
  }

  if (currentPage === "original-degree") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <OriginalDegreeRequest />
      </div>
    );
  }

  if (currentPage === "student-copy") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <StudentCopyRequest />
      </div>
    );
  }

  if (currentPage === "temporary-degree") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <TemporaryDegreeRequest />
      </div>
    );
  }

  if (currentPage === "supporting-letter") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <SupportingLetterRequest />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <FeaturesSection />
        <DocumentServices />
        <EventsSection />
        <NewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
        <Toaster />
      </NavigationProvider>
    </AuthProvider>
  );
}