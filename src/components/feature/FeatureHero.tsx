import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FeatureHero: React.FC = () => {
    return (
        <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-white via-blue-50/20 to-white">
            {/* Animated Background Elements */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-100/40 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '7s' }}></div>
            <div className="absolute top-40 left-1/4 w-64 h-64 bg-sky-100/30 rounded-full blur-2xl -z-10 animate-pulse" style={{ animationDelay: '2.2s', animationDuration: '8s' }}></div>

            {/* Decorative geometric shapes */}
            <div className="absolute top-1/4 right-1/4 w-24 h-24 border-2 border-blue-200/30 rounded-xl rotate-12 hidden md:block"></div>
            <div className="absolute bottom-1/3 left-1/5 w-16 h-16 border-2 border-emerald-200/40 rounded-full hidden md:block"></div>
            <div className="absolute top-1/3 left-1/6 w-12 h-12 border-2 border-blue-300/20 rotate-45 hidden md:block"></div>

            <div className="container mx-auto text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="max-w-3xl mx-auto"
                >
                    <Badge className="px-4 py-1.5 text-[clamp(0.875rem,0.8rem+0.25vw,1rem)] font-medium mb-6 bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-200/30 text-blue-700 shadow-sm">
                        <Sparkles className="w-4 h-4 mr-2" /> Feature Highlights
                    </Badge>
                    <h1 className="text-[clamp(2rem,1.5rem+3vw,4rem)] font-bold tracking-tight mb-6">
                        Elevate Your <span className="relative">
                            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Meetings</span>
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-green-300/70" viewBox="0 0 400 15" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 0 15 Q 50 0 100 8 Q 150 15 200 8 Q 250 0 300 8 Q 350 15 400 8" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                    </h1>
                    <p className="text-[clamp(1rem,0.9rem+0.5vw,1.25rem)] text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Tools designed to transform how your team connects, collaborates, and creates together
                    </p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-5 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 border-0 transition-all duration-300 hover:scale-105 px-[clamp(1.5rem,1rem+2vw,2rem)] py-[clamp(1.25rem,1rem+1vw,1.5rem)]">
                            <Link to="/signup" className="flex items-center text-[clamp(0.875rem,0.8rem+0.25vw,1rem)]">
                                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105 px-[clamp(1.5rem,1rem+2vw,2rem)] py-[clamp(1.25rem,1rem+1vw,1.5rem)]">
                            <Link to="/pricing" className="flex items-center text-[clamp(0.875rem,0.8rem+0.25vw,1rem)]">
                                View Pricing
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Floating stats */}
                    <motion.div
                        className="mt-16 max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <div className="bg-white bg-opacity-80 backdrop-blur-sm px-6 py-4 rounded-lg shadow-md border border-slate-100">
                            <div className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold text-blue-600">99.9%</div>
                            <div className="text-[clamp(0.75rem,0.7rem+0.15vw,0.875rem)] text-slate-600">Uptime reliability</div>
                        </div>
                        <div className="bg-white bg-opacity-80 backdrop-blur-sm px-6 py-4 rounded-lg shadow-md border border-slate-100">
                            <div className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold text-emerald-600">10k+</div>
                            <div className="text-[clamp(0.75rem,0.7rem+0.15vw,0.875rem)] text-slate-600">Teams using our platform</div>
                        </div>
                        <div className="bg-white bg-opacity-80 backdrop-blur-sm px-6 py-4 rounded-lg shadow-md border border-slate-100">
                            <div className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold text-blue-600">24/7</div>
                            <div className="text-[clamp(0.75rem,0.7rem+0.15vw,0.875rem)] text-slate-600">Premium support</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeatureHero;
