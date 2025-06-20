import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PersonalCabinet from "./pages/PersonalCabinet";
import FindPlayers from "./pages/FindPlayers";
import FindTeams from "./pages/FindTeams";
import PlayerProfile from "./pages/PlayerProfile";
import TeamProfile from "./pages/TeamProfile";
import CreateTraining from "./pages/CreateTraining";
import Trainings from "./pages/Trainings";
import Notifications from "./pages/Notifications";
import MyTeam from "./pages/MyTeam";
import CreateTeam from "./pages/CreateTeam";
import NotFound from "./pages/NotFound";
import EditTeam from "./pages/EditTeam";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/personal-cabinet" element={<PersonalCabinet />} />
          <Route path="/find-players" element={<FindPlayers />} />
          <Route path="/find-teams" element={<FindTeams />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/team/:id" element={<TeamProfile />} />
          <Route path="/create-training" element={<CreateTraining />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/team/:id/edit" element={<EditTeam />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
