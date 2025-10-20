import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";

import About from "./pages/About";
import Contact from "./pages/Contact";
import { ThemeProvider } from "./components/ThemeContext";
import { LanguageProvider } from "./components/LanguageContext";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/Faq";
import Sign from "./(auth)/sign"
import AuthLayout from "./layouts/AuthLayout";
import Vehicles from "./pages/Vehicles";
import DashLayout from "./layouts/DashLayout";
import DashHome from "./dashboard/DashHome";
import DVehicles from "./dashboard/DashVehicles";
import AdminAddVehicle from "./dashboard/AdminAddVehicle";
import Checkout from "./dashboard/Checkout";
import Bookings from "./dashboard/Bookings";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/vehicles"
              element={
                <MainLayout>
                  <Vehicles />
                </MainLayout>
              }
            />
            <Route
              path="/about"
              element={
                <MainLayout>
                  <About />
                </MainLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <MainLayout>
                  <Contact />
                </MainLayout>
              }
            />
              <Route
              path="/privacy"
              element={
                <MainLayout>
                  <Privacy />
                </MainLayout>
              }
            />
              <Route
              path="/faq"
              element={
                <MainLayout>
                  <FAQ />
                </MainLayout>
              }
            />
              <Route
              path="/sign"
              element={
                <AuthLayout>
                  <Sign/>
                </AuthLayout>
              }
            />
                <Route
              path="/dashboard"
              element={
                <DashLayout>
                  <DashHome />
                </DashLayout>
              }
            />
                 <Route
              path="/dashboard/vehicles"
              element={
                <DashLayout>
                  <DVehicles />
                </DashLayout>
              }
            />
                <Route
              path="/dashboard/vehicles/add"
              element={
                <DashLayout>
                  <AdminAddVehicle />
                </DashLayout>
              }
            />
                 <Route
              path="/dashboard/checkout"
              element={
                <DashLayout>
                  <Checkout />
                </DashLayout>
              }
            />
                  <Route
              path="/dashboard/bookings"
              element={
                <DashLayout>
                  < Bookings/>
                </DashLayout>
              }
            />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
