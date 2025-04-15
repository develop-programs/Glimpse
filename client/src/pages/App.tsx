import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import { ArrowRight, Video, Calendar, Shield, Users, Check, Star, Zap, Clock, Globe } from "lucide-react";
import { Link } from "react-router";
import { lazy } from "react";

// Import newly created components
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const CTASection = lazy(() => import("@/components/landing/CTASection"));

export default function App() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 md:py-12 lg:py-16">
        {/* Updated hero background gradient with sky blue tones */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
              <div>
                {/* Updated badge with a softer sky blue background */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-50 text-blue-600 text-sm font-medium mb-4 md:mb-6 border border-sky-200/30">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" /> Reimagined Video Meetings
                </div>
                <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight leading-tight">
                  Connect with anyone, <span className="text-blue-600">anywhere</span>
                </h1>
                <p className="mt-4 md:mt-6 text-[clamp(1rem,1.5vw,1.125rem)] text-muted-foreground max-w-xl font-medium">
                  Simple, secure, and reliable video conferencing for teams of all sizes. Join meetings effortlessly from any device.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button size="lg" className="px-4 sm:px-8 group hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                  <Link to="/room/new" className="flex items-center justify-center w-full">
                    Start a Meeting
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-4 sm:px-8 w-full sm:w-auto">
                  <Link to="/schedule" className="flex items-center justify-center w-full">
                    Schedule a Meeting
                    <Calendar className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="./conference.webp"
                      alt="Video call preview"
                      className="w-full h-full object-cover opacity-80"
                      width="640"
                      height="360"
                      decoding="async"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <Button size="icon" variant="secondary" className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 rounded-full size-12 p-0 flex items-center justify-center">
                      <Video className="size-6" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs sm:text-sm font-medium">Live Meeting</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Updated with a lighter blue-green gradient background */}
      <section className="py-10 border-y border-border/30 ">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">100+</p>
              <p className="text-sm text-muted-foreground mt-1">Participants</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">99.9%</p>
              <p className="text-sm text-muted-foreground mt-1">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">128-bit</p>
              <p className="text-sm text-muted-foreground mt-1">Encryption</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground mt-1">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated with subtle blue-green background gradients */}
      <section className="bg-gradient-to-b from-white via-sky-50/10 to-white relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-50 text-blue-600 text-sm font-medium mb-6 border border-sky-200/30">
              <Star className="w-4 h-4 mr-2" /> Premium Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need for better meetings</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful tools designed to make your video conferences more productive and engaging
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 select-none">
            {[
              {
                icon: <Video className="h-6 w-6 text-blue-600" />,
                title: "HD Video & Audio",
                description: "Crystal clear communication with adaptive quality for any connection"
              },
              {
                icon: <Shield className="h-6 w-6 text-blue-600" />,
                title: "Bank-Level Security",
                description: "End-to-end encryption and meeting passwords for complete privacy"
              },
              {
                icon: <Calendar className="h-6 w-6 text-blue-600" />,
                title: "Smart Scheduling",
                description: "Seamless calendar integration with automated reminders"
              },
              {
                icon: <Globe className="h-6 w-6 text-green-600" />,
                title: "Cross-Platform",
                description: "Works on all devices including mobile, tablet, and desktop"
              },
              {
                icon: <Users className="h-6 w-6 text-green-600" />,
                title: "Breakout Rooms",
                description: "Split meetings into smaller groups for focused discussions"
              },
              {
                icon: <Clock className="h-6 w-6 text-green-600" />,
                title: "Meeting Recording",
                description: "Record and share meetings with cloud storage integration"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative overflow-hidden rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white border border-slate-100 hover:border-blue-300/30">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-sky-50 to-green-50 w-fit mb-4 border border-sky-200/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
                <div className="h-1 w-12 bg-gradient-to-r from-blue-400/40 to-green-400/40 rounded-full mt-4 group-hover:w-24 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Updated with blue-green gradients */}
      <section className="relative overflow-hidden rounded-lg">
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 text-blue-600 text-sm font-medium mb-6 border border-green-100/50 shadow-sm">
              <Check className="w-4 h-4 mr-2 animate-pulse" /> Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join a meeting in seconds, no downloads or complex setup required
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent transform -translate-y-1/2 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: 1,
                  title: "Create or Join",
                  description: "Start a new meeting instantly or join with a meeting code in just one click",
                  color: "from-blue-400 to-sky-500"
                },
                {
                  step: 2,
                  title: "Invite Others",
                  description: "Share the meeting link or code with participants via any platform",
                  color: "from-sky-500 to-blue-500"
                },
                {
                  step: 3,
                  title: "Collaborate",
                  description: "Enjoy crystal-clear video, screen sharing, and interactive tools",
                  color: "from-blue-500 to-green-500"
                }
              ].map((item) => (
                <div key={item.step} className="relative z-10 bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg transition-all duration-300 border border-border hover:border-sky-300/50 group">
                  <div className="absolute -inset-px bg-gradient-to-br from-transparent to-sky-100/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all"></div>
                  <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-green-100/30 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity"></div>

                  <div className="relative z-10">
                    <div className={`bg-gradient-to-r ${item.color} h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="h-1 w-12 bg-gradient-to-r from-blue-400/60 to-green-400/60 mt-6 rounded-full group-hover:w-24 transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials and CTASection components will use the existing imports */}
      <Testimonials />
      <CTASection />
    </MainLayout>
  );
}
