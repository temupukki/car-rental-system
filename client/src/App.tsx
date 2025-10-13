import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Service from "./pages/Service";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ThemeProvider } from "./components/ThemeContext";
import { LanguageProvider } from "./components/LanguageContext";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/Faq";
import Sign from "./(auth)/sign"
import AuthLayout from "./layouts/AuthLayout";

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
              path="/services"
              element={
                <MainLayout>
                  <Service />
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
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
