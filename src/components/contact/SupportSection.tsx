import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function SupportSection() {
  return (
    <section className="container mx-auto px-4 py-16 mb-16">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-600 p-px shadow-xl">
          <div className="bg-white dark:bg-slate-900 rounded-[1.4rem] p-[clamp(1.5rem,1.25rem+1.25vw,4rem)] text-center">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 text-blue-600 dark:text-blue-300 text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] font-medium mb-6 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Check className="w-4 h-4 mr-2" /> Quick Support
            </motion.div>
            <h2 className="text-[clamp(1.75rem,1.5rem+1.25vw,3rem)] font-bold mb-6">Need help right away?</h2>
            <p className="text-[clamp(1rem,0.95rem+0.5vw,1.25rem)] text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Check out our comprehensive documentation and frequently asked questions for instant answers to common questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8 py-2 h-auto border-2 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20 text-[clamp(0.9rem,0.85rem+0.25vw,1.1rem)] group"
              >
                View Documentation
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
              <Button
                variant="default"
                size="lg"
                className="rounded-xl px-8 py-2 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-700/20 text-[clamp(0.9rem,0.85rem+0.25vw,1.1rem)] group"
              >
                Visit Support Center
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
