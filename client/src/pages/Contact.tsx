import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfoSection from "@/components/contact/ContactInfoSection";
import HeroSection from "@/components/contact/HeroSection";
import MapSection from "@/components/contact/MapSection";
import SupportSection from "@/components/contact/SupportSection";

export default function Contact() {
    return (
        <div className="min-h-screen bg-[url('/patterns/grid-light.svg')] dark:bg-[url('/patterns/grid-dark.svg')] bg-fixed bg-white dark:bg-slate-950">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/95 to-blue-50/80 dark:from-slate-950/80 dark:via-slate-900/95 dark:to-blue-950/80 backdrop-blur-[2px] -z-10"></div>

            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            {/* Main Content Section */}
            <section className="container mx-auto px-4 py-12 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                        {/* Contact Form */}
                        <motion.div
                            className="lg:col-span-7 order-2 lg:order-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <ContactForm />
                        </motion.div>

                        {/* Contact Information Cards */}
                        <ContactInfoSection />
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <MapSection />

            {/* FAQ/Support Section */}
            <SupportSection />

            <Footer />
        </div>
    );
}
