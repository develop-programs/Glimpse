import React from "react";
import { ArrowRight, Video, Users, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { motion } from "motion/react";

export default function CTASection() {
    return (
        <section className="container mx-auto py-8 sm:py-10 md:py-12 px-4 sm:px-6 mt-12 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-emerald-500 opacity-75">
            <div className="text-center z-10">
                <motion.div
                    className="max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-[clamp(1.875rem,5vw,3rem)] font-bold text-white mb-2">
                        Start connecting with your team today
                    </h2>
                    <div className="w-16 sm:w-20 h-1 bg-white/50 mx-auto rounded-full my-4" />
                    <p className="mt-2 text-[clamp(1rem,2.5vw,1.25rem)] text-white/90 leading-relaxed">
                        Join thousands of innovative teams already transforming their virtual collaboration experience
                    </p>

                    <motion.div
                        className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <Link to="/room/new" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full bg-white hover:bg-white/90 text-blue-600 font-medium shadow-lg hover:shadow-xl border-0"
                            >
                                Start a Meeting Now
                                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                            </Button>
                        </Link>
                        <Link to="/features" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full bg-white/25 border-white text-white hover:bg-white/20 backdrop-blur-sm"
                            >
                                Explore Features
                                <Video className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Statistics Section - improved grid for mobile */}
                    <motion.div
                        className="mt-10 grid grid-cols-3 gap-6 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        {[
                            { icon: <Users />, value: "10,000+", label: "Active Teams" },
                            { icon: <Clock />, value: "45M+", label: "Meeting Minutes" },
                            { icon: <CheckCircle2 />, value: "99.9%", label: "Uptime" }
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center py-3 sm:py-0">
                                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-3 mb-3">
                                    {React.cloneElement(stat.icon, { className: "size-5 sm:size-6 text-white" })}
                                </div>
                                <h3 className="text-[clamp(0.5rem,5vw,1.875rem)] font-bold text-white">{stat.value}</h3>
                                <p className="text-white/70 mt-1 text-[clamp(0.7rem,2vw,1rem)]">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center text-white/70 gap-2 sm:gap-0"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        <div className="flex -space-x-3 sm:-space-x-4">
                            <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/40" decoding="async" loading="lazy" />
                            <img src="https://randomuser.me/api/portraits/men/44.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/40" decoding="async" loading="lazy" />
                            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/40" decoding="async" loading="lazy" />
                            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/40" decoding="async" loading="lazy" />
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium text-white">
                                +9k
                            </div>
                        </div>
                        <div className="ml-0 sm:ml-4 text-[clamp(0.75rem,2vw,0.875rem)] text-center sm:text-left">
                            <span className="font-medium text-white">Join</span> thousands of happy teams
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section >
    );
}
