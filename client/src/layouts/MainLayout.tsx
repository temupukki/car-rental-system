import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface MainLayout {
  children: React.ReactNode;
}
export default function MainLayout({ children }: MainLayout) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
