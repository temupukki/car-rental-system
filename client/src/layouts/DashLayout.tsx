import { Toaster } from "sonner";
import DFooter from "../components/DFooter";
import DNavbar from "../components/DNavbar";
import { useTheme } from "../components/ThemeContext"; 

interface DashLayout {
  children: React.ReactNode;
}
export default function DashLayout({ children }: DashLayout) {
  const { theme } = useTheme();
  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${theme === 'light' 
        ? 'bg-white text-gray-900' 
        : 'bg-gray-900 text-white'
      }
    `}>
      <DNavbar />
      {children}
      <Toaster/>
      <DFooter />
    </div>
  );
}
