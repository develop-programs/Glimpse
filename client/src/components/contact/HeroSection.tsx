import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      {/* Decorative elements */}
      <div className="absolute top-20 left-1/3 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-20 right-1/3 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        className="container relative z-10 mx-auto max-w-4xl text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 text-blue-600 dark:text-blue-300 text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] font-medium mb-6 shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <MessageSquare className="w-4 h-4 mr-2" /> We're here to help
        </motion.div>
        <h1 className="text-[clamp(2.5rem,2rem+2.5vw,4rem)] font-extrabold tracking-tight mb-6">
          Get in <motion.span
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 bg-clip-text text-transparent relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Touch
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transform"></span>
          </motion.span>
        </h1>
        <motion.p
          className="text-[clamp(1rem,0.95rem+0.5vw,1.25rem)] text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          Questions, feedback, or just want to say hello? Our team is ready to hear from you and provide the support you need.
        </motion.p>
      </motion.div>
    </section>
  );
}
