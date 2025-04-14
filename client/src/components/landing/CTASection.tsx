import { ArrowRight, Video, Users, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { motion } from "motion/react";

export default function CTASection() {
    return (
        <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 relative overflow-hidden rounded-xl sm:rounded-2xl">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-emerald-500 opacity-75"></div>


            {/* Animated circles - adjusted for better mobile appearance */}
            <motion.div
                className="absolute top-1/3 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-emerald-200/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />
            <motion.div
                className="absolute bottom-1/3 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-sky-200/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                }}
            />

            <div className="container relative z-10 text-center px-2 sm:px-4">
                <motion.div
                    className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                        Start connecting with your team today
                    </h2>
                    <div className="w-16 sm:w-20 md:w-24 h-1 bg-white/50 mx-auto rounded-full my-4 sm:my-6"></div>
                    <p className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed px-2">
                        Join thousands of innovative teams already transforming their virtual collaboration experience
                    </p>

                    <motion.div
                        className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <Button
                            size="lg"
                            variant="secondary"
                            className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white font-medium w-full sm:w-auto"
                        >
                            <Link to="/room/new" className="flex items-center justify-center">
                                Start a Meeting Now
                                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 text-base sm:text-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        >
                            <Link to="/features" className="flex items-center justify-center">
                                Explore Features
                                <Video className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Statistics Section - improved grid for mobile */}
                    <motion.div
                        className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <div className="flex flex-col items-center py-3 sm:py-0">
                            <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-3 mb-3 sm:mb-4">
                                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white">10,000+</h3>
                            <p className="text-white/70 mt-1 text-sm sm:text-base">Active Teams</p>
                        </div>
                        <div className="flex flex-col items-center py-3 sm:py-0">
                            <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-3 mb-3 sm:mb-4">
                                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white">45M+</h3>
                            <p className="text-white/70 mt-1 text-sm sm:text-base">Meeting Minutes</p>
                        </div>
                        <div className="flex flex-col items-center py-3 sm:py-0">
                            <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-3 mb-3 sm:mb-4">
                                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white">99.9%</h3>
                            <p className="text-white/70 mt-1 text-sm sm:text-base">Uptime</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center text-white/70 gap-2 sm:gap-0"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        <div className="flex -space-x-3 sm:-space-x-4">
                            <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/40" />
                            <img src="https://randomuser.me/api/portraits/men/44.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/40" />
                            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/40" />
                            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/40" />
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-xs font-medium text-white">
                                +9k
                            </div>
                        </div>
                        <div className="ml-0 sm:ml-4 text-xs sm:text-sm text-center sm:text-left">
                            <span className="font-medium text-white">Join</span> thousands of happy teams
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
