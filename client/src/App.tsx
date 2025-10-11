import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <MainLayout>
        <Route path="/" element={<Home />} />
        </MainLayout>
        
      </Routes>
    </Router>
  );
}

export default App;
