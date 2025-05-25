
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ProfileSetup from "./components/ProfileSetup";
import AuthWrapper from "./components/AuthWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/profile-setup" element={<AuthWrapper><ProfileSetup /></AuthWrapper>} />
          <Route path="/dashboard" element={<AuthWrapper><Index /></AuthWrapper>} />
          <Route path="/browse" element={<AuthWrapper><Index /></AuthWrapper>} />
          <Route path="/messages" element={<AuthWrapper><Index /></AuthWrapper>} />
          <Route path="/projects" element={<AuthWrapper><Index /></AuthWrapper>} />
          <Route path="/availability" element={<AuthWrapper><Index /></AuthWrapper>} />
          <Route path="/profile" element={<AuthWrapper><Index /></AuthWrapper>} />
          <Route path="/settings" element={<AuthWrapper><Index /></AuthWrapper>} />
          <Route path="/support" element={<AuthWrapper><Index /></AuthWrapper>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
