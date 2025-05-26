import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import Sidebar from '@/components/Sidebar';
import AuthWrapper from '@/components/AuthWrapper';
import SubscriptionGuard from '@/components/SubscriptionGuard';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import Home from '@/pages/Home';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/components/Dashboard';
import Projects from '@/components/Projects';
import ProjectDetail from '@/components/ProjectDetail';
import Browse from '@/components/Browse';
import Messages from '@/components/Messages';
import Profile from '@/components/Profile';
import PublicProfile from '@/components/PublicProfile';
import Settings from '@/components/Settings';
import Support from '@/components/Support';
import Subscription from '@/pages/Subscription';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';
import './App.css';
const queryClient = new QueryClient();
function App() {
  return <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>
        <TooltipProvider>
          <Router>
            <div className="flex h-screen mx-auto bg-inherit">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/user/:userId" element={<PublicProfile />} />
                
                {/* Subscription route - full screen without sidebar */}
                <Route path="/subscription" element={<AuthWrapper>
                    <Subscription />
                  </AuthWrapper>} />
                
                {/* Protected routes with sidebar */}
                <Route path="/dashboard" element={<AuthWrapper>
                    <SubscriptionGuard>
                      <div className="flex h-screen">
                        <Sidebar activeTab="dashboard" setActiveTab={() => {}} />
                        <main className="flex-1 overflow-auto">
                          <Dashboard />
                        </main>
                      </div>
                    </SubscriptionGuard>
                  </AuthWrapper>} />
                
                <Route path="/projects" element={<AuthWrapper>
                    <SubscriptionGuard>
                      <div className="flex h-screen">
                        <Sidebar activeTab="projects" setActiveTab={() => {}} />
                        <main className="flex-1 overflow-auto">
                          <Projects />
                        </main>
                      </div>
                    </SubscriptionGuard>
                  </AuthWrapper>} />
                
                <Route path="/projects/:id" element={<AuthWrapper>
                    <SubscriptionGuard>
                      <div className="flex h-screen">
                        <Sidebar activeTab="projects" setActiveTab={() => {}} />
                        <main className="flex-1 overflow-auto">
                          <ProjectDetail />
                        </main>
                      </div>
                    </SubscriptionGuard>
                  </AuthWrapper>} />
                
                <Route path="/browse" element={<AuthWrapper>
                    <SubscriptionGuard>
                      <div className="flex h-screen">
                        <Sidebar activeTab="browse" setActiveTab={() => {}} />
                        <main className="flex-1 overflow-auto">
                          <Browse />
                        </main>
                      </div>
                    </SubscriptionGuard>
                  </AuthWrapper>} />
                
                <Route path="/messages" element={<AuthWrapper>
                    <SubscriptionGuard>
                      <div className="flex h-screen">
                        <Sidebar activeTab="messages" setActiveTab={() => {}} />
                        <main className="flex-1 overflow-auto">
                          <Messages />
                        </main>
                      </div>
                    </SubscriptionGuard>
                  </AuthWrapper>} />
                
                <Route path="/profile" element={<AuthWrapper>
                    <SubscriptionGuard>
                      <div className="flex h-screen">
                        <Sidebar activeTab="profile" setActiveTab={() => {}} />
                        <main className="flex-1 overflow-auto">
                          <Profile />
                        </main>
                      </div>
                    </SubscriptionGuard>
                  </AuthWrapper>} />
                
                <Route path="/settings" element={<AuthWrapper>
                    <SubscriptionGuard>
                      <div className="flex h-screen">
                        <Sidebar activeTab="settings" setActiveTab={() => {}} />
                        <main className="flex-1 overflow-auto">
                          <Settings />
                        </main>
                      </div>
                    </SubscriptionGuard>
                  </AuthWrapper>} />
                
                <Route path="/support" element={<AuthWrapper>
                    <SubscriptionGuard>
                      <div className="flex h-screen">
                        <Sidebar activeTab="support" setActiveTab={() => {}} />
                        <main className="flex-1 overflow-auto">
                          <Support />
                        </main>
                      </div>
                    </SubscriptionGuard>
                  </AuthWrapper>} />
                
                <Route path="/app" element={<AuthWrapper>
                    <SubscriptionGuard>
                      <div className="flex h-screen">
                        <Sidebar activeTab="dashboard" setActiveTab={() => {}} />
                        <main className="flex-1 overflow-auto">
                          <Index />
                        </main>
                      </div>
                    </SubscriptionGuard>
                  </AuthWrapper>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </TooltipProvider>
      </SubscriptionProvider>
    </QueryClientProvider>;
}
export default App;