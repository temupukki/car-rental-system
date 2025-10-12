import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Service from "./pages/Service";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
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
        path="/service"
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
  );
}

export default App;
