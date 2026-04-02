import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import Challenge from "./pages/Challenge.tsx";
import Results from "./pages/Results.tsx";
import Progress from "./pages/Progress.tsx";
import Profile from "./pages/Profile.tsx";
import Badges from "./pages/Badges.tsx";
import LevelUp from "./pages/LevelUp.tsx";
import StreakLost from "./pages/StreakLost.tsx";
import WeeklyReport from "./pages/WeeklyReport.tsx";
import Subscribe from "./pages/Subscribe.tsx";
import Settings from "./pages/Settings.tsx";
import Success from "./pages/Success.tsx";
import Blog from "./pages/Blog.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/challenge" element={<ProtectedRoute><Challenge /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
            <Route path="/levelup" element={<ProtectedRoute><LevelUp /></ProtectedRoute>} />
            <Route path="/streakLost" element={<ProtectedRoute><StreakLost /></ProtectedRoute>} />
            <Route path="/weeklyReport" element={<ProtectedRoute><WeeklyReport /></ProtectedRoute>} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/success" element={<Success />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
