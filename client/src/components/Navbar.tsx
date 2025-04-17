import { Link } from "react-router";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full backdrop-blur transition-all duration-300",
        scrolled
          ? "border-b border-sky-100/30 bg-white/80 shadow-sm shadow-sky-100/20"
          : "bg-white/60"
      )}
    >
      <div className="container mx-auto flex py-5 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/glimpse.webp"
            alt="Glimpse"
            className="w-32 h-auto"
            width={112}
            height={40}
            loading="lazy"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button
              variant="outline"
              className={cn(
                "border-sky-200 text-sky-700 hover:border-sky-400 hover:bg-sky-50/50"
              )}
            >
              Try for Free
            </Button>
          </Link>
          <Link to="/Dashboard">
            <Button
              className={cn(
                "bg-gradient-to-r from-sky-400 to-green-400 hover:from-sky-500 hover:to-green-500 text-white shadow-md"
              )}
            >
              Start Meeting
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "md:hidden text-sky-600 hover:text-sky-800 hover:bg-sky-50/50"
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="container overflow-hidden md:hidden"
          >
            <nav className={cn(
              "flex flex-col space-y-4 py-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg shadow-sky-100/30"
            )}>
              <div className="w-full px-4">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full border-sky-200 text-sky-700 hover:border-sky-400 hover:bg-sky-50/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Try for Free
                  </Button>
                </Link>
              </div>
              <div className="w-full px-4">
                <Link to="/Dashboard">
                  <Button
                    className={cn(
                      "w-full bg-gradient-to-r from-sky-400 to-green-400 hover:from-sky-500 hover:to-green-500 text-white shadow-md"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Start Meeting
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
