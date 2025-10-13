import { Toaster } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useTheme } from "../components/ThemeContext"; 

interface MainLayout {
  children: React.ReactNode;
}
export default function MainLayout({ children }: MainLayout) {
  const { theme } = useTheme();
  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${theme === 'light' 
        ? 'bg-white text-gray-900' 
        : 'bg-gray-900 text-white'
      }
    `}>
      <Navbar />
      {children}
      <Toaster/>
      <Footer />
    </div>
  );
}
