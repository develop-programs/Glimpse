import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function MapSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xl rounded-3xl p-[clamp(1.25rem,1rem+1vw,2rem)] mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-[clamp(1.5rem,1.25rem+1.25vw,2.25rem)] font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Come Visit Our Office</h2>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button variant="outline" className="rounded-xl border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700 group">
                Get Directions
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
              <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group">
                View Nearby Places
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <iframe
              title="Glimpse Office Location"
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.09854377458!2d-122.44271423526979!3d37.7596929559331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858081c252135f%3A0xcf7a42a208214668!2sSouth%20of%20Market%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1689786297302!5m2!1sen!2sus"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
