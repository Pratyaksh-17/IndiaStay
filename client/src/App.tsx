import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import HotelsPage from "@/pages/HotelsPage";
import HotelDetailPage from "@/pages/HotelDetailPage";
import PaymentPage from "@/pages/PaymentPage";
import BookingConfirmationPage from "@/pages/BookingConfirmationPage";
import PackagesPage from "@/pages/PackagesPage";
import OffersPage from "@/pages/OffersPage";
import CartPage from "@/pages/CartPage";
import AuthPage from "@/pages/AuthPage";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ProtectedRoute } from "@/lib/protected-route";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/hotels" component={HotelsPage} />
      <Route path="/hotels/:id" component={HotelDetailPage} />
      <ProtectedRoute path="/payment/:hotelId" component={PaymentPage} />
      <ProtectedRoute path="/booking-confirmation/:bookingId" component={BookingConfirmationPage} />
      <Route path="/packages" component={PackagesPage} />
      <Route path="/offers" component={OffersPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
