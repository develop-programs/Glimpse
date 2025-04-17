import { Button } from "@/components/ui/button";
import { ArrowRight, Video, Calendar, Shield, Users, Zap } from "lucide-react";
import { Link } from "react-router";
import { lazy } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import newly created components
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const CTASection = lazy(() => import("@/components/landing/CTASection"));
const Feature = lazy(() => import("@/components/landing/Feature"));
const HowItWork = lazy(() => import("@/components/landing/HowItWork"));

export default function App() {
  return (
    <section className="px-4">
      <Navbar />
      {/* Hero Section */}
      <section className="xl:mt-12 py-32">
        {/* Updated hero background gradient with sky blue tones */}
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
              <div>
                {/* Updated badge with a softer sky blue background */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-50 text-blue-600 text-sm font-medium mb-4 md:mb-6 border border-sky-200/30">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" /> Reimagined Video Meetings
                </div>
                <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tight leading-tight">
                  Connect with anyone, <span className="text-blue-600">anywhere</span>
                </h1>
                <p className="mt-4 md:mt-6 text-[clamp(1rem,1.5vw,1.125rem)] text-muted-foreground max-w-xl font-medium">
                  Simple, secure, and reliable video conferencing for teams of all sizes. Join meetings effortlessly from any device.
                </p>
              </div>

              <div className="flex flex-row gap-3 sm:gap-4">
                <Link to="/room/new">
                  <Button size="lg" className="group">
                    Start a Meeting
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/schedule">
                  <Button size="lg" variant="outline">
                    Schedule a Meeting
                    <Calendar className="size-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-sky-400/90 to-green-500/90 border-2 border-background flex items-center justify-center text-xs text-white font-medium`}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">5000+</span> teams already connected
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 mt-8 lg:mt-0 select-none">
              <div className="relative z-10 bg-gradient-to-tr from-white/80 to-sky-50/50 rounded-xl sm:rounded-2xl border border-sky-200/30 p-1 sm:p-2 shadow-lg mx-auto max-w-lg lg:max-w-none">
                <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-black/90 relative">
                  <img
                    src="./conference.webp"
                    alt="Video call preview"
                    className="absolute inset-0 size-full object-cover opacity-80"
                    width={1280}
                    height={720}
                    decoding="async"
                    sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
                    srcSet="./conference.webp 1280w, ./conference.webp 720w"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 rounded-full size-10"
                    aria-label="Play Video"
                  >
                    <Video className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Live Meeting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Participants">
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Security">
                      <Shield className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Updated with a lighter blue-green gradient background */}
      <section>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "100+", label: "Participants" },
              { value: "99.9%", label: "Uptime" },
              { value: "128-bit", label: "Encryption" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-primary">{stat.value}</p>
                <p className="text-[clamp(0.875rem,1.5vw,1rem)] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Updated with subtle blue-green background gradients */}
      <Feature />

      {/* How It Works Section - Updated with blue-green gradients */}
      <HowItWork />

      {/* Testimonials and CTASection components will use the existing imports */}
      <Testimonials />
      <CTASection />
      <Footer />
    </section>
  );
}
