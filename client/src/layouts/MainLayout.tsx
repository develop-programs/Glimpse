import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen max-w-7xl mx-auto space-y-24 mt-32 lg:mt-32 px-2">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
