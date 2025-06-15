import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import Home from "./pages/Home";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Subscription from "./pages/Subscription";
import ProfileSetup from "./components/ProfileSetup";
import ProjectDetail from "./components/ProjectDetail";
import UserProfile from "./components/UserProfile";
import AuthWrapper from "./components/AuthWrapper";
import ForgotPassword from "./pages/ForgotPassword";
import Welcome from "./components/Welcome";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Add debug logging for profile setup route */}
              <Route 
                path="/profile-setup" 
                element={
                  <div>
                    {console.log('Profile setup route matched')}
                    <AuthWrapper>
                      {console.log('About to render ProfileSetup')}
                      <ProfileSetup />
                    </AuthWrapper>
                  </div>
                } 
              />
              
              {/* Welcome page route */}
              <Route path="/welcome" element={<AuthWrapper><Welcome /></AuthWrapper>} />
              
              <Route path="/subscription" element={<AuthWrapper><Subscription /></AuthWrapper>} />
              <Route path="/dashboard" element={<AuthWrapper><Index /></AuthWrapper>} />
              <Route path="/browse" element={<AuthWrapper><Index /></AuthWrapper>} />
              <Route path="/messages" element={<AuthWrapper><Index /></AuthWrapper>} />
              <Route path="/messages/:threadId" element={<AuthWrapper><Index /></AuthWrapper>} />
              <Route path="/projects" element={<AuthWrapper><Index /></AuthWrapper>} />
              <Route path="/projects/folder/:folderId" element={<AuthWrapper><Index /></AuthWrapper>} />
              <Route path="/projects/:projectId" element={<AuthWrapper><ProjectDetail /></AuthWrapper>} />
              <Route path="/collaborators" element={<AuthWrapper><Index /></AuthWrapper>} />
              <Route path="/profile" element={<AuthWrapper><Index /></AuthWrapper>} />
              <Route path="/profile/:userId" element={<AuthWrapper><UserProfile /></AuthWrapper>} />
              <Route path="/settings" element={<AuthWrapper><Index /></AuthWrapper>} />
              <Route path="/support" element={<AuthWrapper><Index /></AuthWrapper>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </QueryClientProvider>
  );
};

export default App;
