import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { LandingPage } from "./pages/LandingPage";

function App() {
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage/>} />
    <Route path="/signup" element={<Signup/>} />
    <Route path="/signin" element={<Signin/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
  </Routes> 
  </BrowserRouter>
}

export default App;
