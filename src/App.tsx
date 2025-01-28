import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import About from "./pages/About";
import CollegePlanning from "./pages/CollegePlanning";
import CounselorDashboard from "./pages/CounselorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import Academics from "./pages/Academics";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/college-planning" element={<CollegePlanning />} />
        <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
        <Route path="/college-planning/student/:studentId" element={<StudentDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;