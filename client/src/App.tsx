import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Service from "./pages/Service";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ThemeProvider } from "./components/ThemeContext";

function App() {
  return (
    <ThemeProvider>
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
            <Service/>
          </MainLayout>
        }/>
         <Route
        path="/about"
        element={
          <MainLayout>
            <About/>
          </MainLayout>
        }/>
         <Route
        path="/contact"
        element={
          <MainLayout>
            <Contact/>
          </MainLayout>
        }/>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
