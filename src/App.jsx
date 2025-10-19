import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SignInForm from "./pages/auth/signin";
import SignUpForm from "./pages/auth/signup";
import VerifyAccount from "./pages/auth/verify";
import ChatBot from "./pages/chatbot";
import LandingPage from "./pages/landingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/verify/:email" element={<VerifyAccount />} />
        <Route path="/chat" element={<ChatBot />} />
      </Routes>
    </Router>
  );
}

export default App;
