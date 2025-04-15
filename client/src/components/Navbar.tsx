import { Link } from "react-router";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for navbar appearance change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full backdrop-blur transition-all duration-300 ${scrolled
        ? "border-b border-sky-100/30 bg-white/80 shadow-sm shadow-sky-100/20"
        : "bg-white/60"
        }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center">
            <motion.img
              src="/glimpse.png"
              alt="Glimpse"
              className="w-32 h-auto"
              width={112}
              height={40}
              decoding="async"
              loading="lazy"
              fetchPriority="high"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
          </Link>
        </motion.div>

        <motion.div
          className="hidden md:flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login">
              <Button
                variant="outline"
                className="border-sky-200 text-sky-700 hover:border-sky-400 hover:bg-sky-50/50 transition-colors duration-300"
              >
                Try for Free
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/Dashboard">
              <Button
                className="bg-gradient-to-r from-sky-400 to-green-400 hover:from-sky-500 hover:to-green-500 text-white font-semibold shadow-md hover:shadow-lg shadow-sky-200/50 transition-all duration-300"
              >
                Start Meeting
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden"
        >
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative text-sky-600 hover:text-sky-800 hover:bg-sky-50/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="container overflow-hidden md:hidden"
          >
            <motion.nav
              className="flex flex-col space-y-4 py-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg shadow-sky-100/30"
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.1 }
                },
                closed: {}
              }}
            >
              {[
                { text: "Try It Out", path: "/schedule", isButton: true, variant: "outline" },
                { text: "Start Meeting", path: "/Dashboard", isButton: true, variant: "default" }
              ].map((item) => (
                <motion.div
                  key={item.text}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 20 }
                  }}
                  className="w-full px-4"
                >
                  {!item.isButton ? (
                    <Link
                      to={item.path}
                      className="text-sm font-medium relative group block py-2 text-gray-700 hover:text-sky-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.text}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-green-400 transition-all duration-300 group-hover:w-20" />
                    </Link>
                  ) : (
                    <Link to={item.path}>
                      <Button
                        className={`w-full ${item.variant === 'default' ?
                          'bg-gradient-to-r from-sky-400 to-green-400 hover:from-sky-500 hover:to-green-500 text-white shadow-md' :
                          'border-sky-200 text-sky-700 hover:border-sky-400 hover:bg-sky-50/50'}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.text}
                      </Button>
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )
        }
      </AnimatePresence >
    </header >
  );
}
