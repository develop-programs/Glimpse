import React, { useState } from 'react'
import { motion } from "framer-motion"; // Fixed import
import { Link } from "react-router";
import { useAtom } from 'jotai';
import {
    Star, Check, CheckCheck, ArrowRight,
    Sparkles, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { featureData } from '@/data/feature';
import FeatureHero from '@/components/feature/FeatureHero';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    isPro?: boolean;
    color?: string;
}

const FeatureCard = ({ icon, title, description, isPro, color = "blue" }: FeatureCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="h-full"
        >
            <Card className={`h-full border border-slate-100 hover:border-${color}-300/50 hover:shadow-lg hover:shadow-${color}-100/20 transition-all duration-300 overflow-hidden relative`}>
                {isPro && (
                    <div className="absolute -right-8 top-3 rotate-45 bg-gradient-to-r from-blue-600 to-green-500 px-10 py-1 text-xs text-white font-medium shadow-md">
                        PREMIUM
                    </div>
                )}
                <CardContent className="p-5 md:p-6 h-full flex flex-col">
                    <div className="flex flex-col space-y-3 h-full">
                        <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-50 to-${color}-100/70 w-fit mb-4 border border-${color}-200/40 shadow-sm`}>
                            {icon}
                        </div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
                        </div>
                        <p className="mt-2 text-muted-foreground">
                            {description}
                        </p>
                        <motion.div
                            className={`h-1.5 w-12 bg-gradient-to-r from-${color}-500 to-${color}-300 rounded-full mt-auto`}
                            animate={{ width: isHovered ? '70%' : '3rem' }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default function Feature() {
    const [data] = useAtom(featureData);
    const [showAllPremium, setShowAllPremium] = useState(false);
    const [activeComparison, setActiveComparison] = useState<string | null>(null);

    // Get the displayed premium features based on the toggle state
    const displayedPremiumFeatures = showAllPremium
        ? data.premium.previewItems
        : data.premium.previewItems.slice(0, 6);

    // Comparison features with clear differentiators
    const comparisonFeatures = [
        {
            name: "Video Quality",
            free: "Standard definition (480p)",
            premium: "High definition (1080p) with noise cancellation",
            icon: "video"
        },
        {
            name: "Meeting Duration",
            free: "Up to 40 minutes per meeting",
            premium: "Unlimited meeting duration",
            icon: "clock"
        },
        {
            name: "Participants",
            free: "Up to 20 participants",
            premium: "Up to 300 participants",
            icon: "users"
        },
        {
            name: "Recording",
            free: "Local recording only",
            premium: "Cloud recording with transcription",
            icon: "cloud"
        },
        {
            name: "Support",
            free: "Email support",
            premium: "24/7 priority support",
            icon: "headset"
        }
    ];

    const getFeatureIcon = (icon: string) => {
        switch (icon) {
            case "video": return <div className="p-1.5 rounded-full bg-emerald-100/70 text-emerald-600 mr-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 10L20 7V17L15 14M4 8H12C13.1 8 14 8.9 14 10V14C14 15.1 13.1 16 12 16H4C2.9 16 2 15.1 2 14V10C2 8.9 2.9 8 4 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
            case "clock": return <div className="p-1.5 rounded-full bg-emerald-100/70 text-emerald-600 mr-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
            case "users": return <div className="p-1.5 rounded-full bg-emerald-100/70 text-emerald-600 mr-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21M23 21V19C23 16.7909 21.2091 15 19 15M19 11C21.2091 11 23 9.20914 23 7C23 4.79086 21.2091 3 19 3M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
            case "cloud": return <div className="p-1.5 rounded-full bg-emerald-100/70 text-emerald-600 mr-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 18L12 22M12 22L16 18M12 22V12M20.8944 13.5C21.5778 12.4097 22 11.0952 22 9.69231C22 6.55477 19.4903 4 16.4 4C15.7434 4 15.1152 4.12503 14.5325 4.3559C13.3538 2.95226 11.6952 2 9.8 2C6.15111 2 3.2 4.9934 3.2 8.69231C3.2 10.7962 4.2454 12.6578 5.83251 13.8036" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
            default: return <div className="p-1.5 rounded-full bg-emerald-100/70 text-emerald-600 mr-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.3642 15.3656C17.8457 14.8456 17.2316 14.429 16.5602 14.1414C17.2769 13.5143 17.7688 12.6584 17.9415 11.7048C18.1142 10.7512 17.9575 9.76347 17.4947 8.90804C17.0319 8.05261 16.2933 7.3826 15.4037 7.00918C14.514 6.63577 13.5272 6.58082 12.6007 6.85309C11.6741 7.12536 10.8669 7.70613 10.3234 8.49937C9.77992 9.29261 9.53543 10.2509 9.63813 11.2077C9.74082 12.1646 10.1836 13.0543 10.8889 13.7271C10.2169 14.0146 9.6023 14.4313 9.08352 14.9515C8.32414 15.7149 7.8765 16.7221 7.8335 17.7868C7.8335 18.1169 7.96466 18.4335 8.19846 18.6673C8.43226 18.9011 8.74889 19.0322 9.07896 19.0322C9.40903 19.0322 9.72566 18.9011 9.95947 18.6673C10.1933 18.4335 10.3244 18.1169 10.3244 17.7868C10.3244 17.2458 10.5392 16.7272 10.9213 16.3451C11.3033 15.963 11.8219 15.7482 12.363 15.7482H15.0846C15.6257 15.7482 16.1443 15.963 16.5264 16.3451C16.9085 16.7272 17.1233 17.2458 17.1233 17.7868C17.1233 18.1169 17.2545 18.4335 17.4883 18.6673C17.7221 18.9011 18.0387 19.0322 18.3688 19.0322C18.6989 19.0322 19.0155 18.9011 19.2493 18.6673C19.4831 18.4335 19.6143 18.1169 19.6143 17.7868C19.5713 16.7221 19.1236 15.7149 18.3642 14.9515V15.3656ZM13.7238 9.24081C14.0287 9.24081 14.3257 9.33657 14.5732 9.51294C14.8207 9.68932 15.0071 9.93815 15.1076 10.2254C15.2081 10.5127 15.2179 10.825 15.1356 11.1232C15.0533 11.4215 14.8825 11.6911 14.6457 11.9001C14.4089 12.1091 14.116 12.2383 13.8027 12.2723C13.4895 12.3064 13.1722 12.2431 12.8922 12.0908C12.6122 11.9385 12.3827 11.705 12.2284 11.422C12.0741 11.139 12.0028 10.8185 12.0235 10.499C12.0514 10.0788 12.2432 9.68649 12.5597 9.40568C12.8761 9.12487 13.2932 8.96874 13.7238 8.97468V9.24081ZM22.1053 4.95579V19.2984C22.1053 20.0687 21.7965 20.8073 21.2454 21.3584C20.6944 21.9094 19.9558 22.2182 19.1855 22.2182H5.5428C4.77255 22.2182 4.03394 21.9094 3.48289 21.3584C2.93185 20.8073 2.623 20.0687 2.623 19.2984V4.95579C2.623 4.18554 2.93185 3.44694 3.48289 2.89589C4.03394 2.34484 4.77255 2.03599 5.5428 2.03599H19.1855C19.9558 2.03599 20.6944 2.34484 21.2454 2.89589C21.7965 3.44694 22.1053 4.18554 22.1053 4.95579ZM19.6143 4.95579C19.6143 4.62573 19.4832 4.3091 19.2494 4.07529C19.0156 3.84149 18.6989 3.71033 18.3689 3.71033H6.35919C6.02912 3.71033 5.71249 3.84149 5.47869 4.07529C5.24488 4.3091 5.11372 4.62573 5.11372 4.95579V18.4705C5.11372 18.8006 5.24488 19.1172 5.47869 19.351C5.71249 19.5848 6.02912 19.716 6.35919 19.716H18.3689C18.6989 19.716 19.0156 19.5848 19.2494 19.351C19.4832 19.1172 19.6143 18.8006 19.6143 18.4705V4.95579Z" fill="currentColor" /></svg></div>;
        }
    };

    React.useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, [])

    return (
        <>
            <Navbar />
            <FeatureHero />

            <div className="container mx-auto px-6">
                {/* Feature Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="py-12 md:py-20"
                >
                    <Tabs defaultValue="free" className="w-full max-w-5xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-[clamp(1.875rem,5vw,2.5rem)] font-bold mb-4 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Choose Your Experience</h2>
                            <p className="text-[clamp(1rem,3vw,1.125rem)] text-muted-foreground max-w-2xl mx-auto">
                                Discover the perfect features for your team's communication needs
                            </p>
                            <TabsList className="mt-6 bg-slate-100/90 px-3 py-6 border border-slate-200/50 shadow-sm">
                                <TabsTrigger
                                    value="free"
                                    className="text-[clamp(0.875rem,2.5vw,1rem)] py-4 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-400 data-[state=active]:text-white data-[state=active]:shadow-md"
                                >
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Free Features
                                </TabsTrigger>
                                <TabsTrigger
                                    value="premium"
                                    className="text-[clamp(0.875rem,2.5vw,1rem)] py-4 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                                >
                                    <Star className="mr-2 h-4 w-4" />
                                    Premium Features
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="free" className="mt-6">
                            <div className="space-y-6 text-center max-w-3xl mx-auto mb-10">
                                <Badge variant="outline" className={`px-3 py-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm`}>
                                    {data.free.icon} {data.free.title}
                                </Badge>
                                <h3 className="text-[clamp(1.5rem,4vw,1.875rem)] font-bold text-slate-800">{data.free.heading}</h3>
                                <p className="text-[clamp(0.9rem,2.5vw,1rem)] text-muted-foreground">{data.free.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {data.free.items.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                    >
                                        <FeatureCard
                                            {...feature}
                                            color="emerald"
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-center mt-12">
                                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-white shadow-md shadow-emerald-200/50 transition-transform hover:scale-105">
                                    <Link to="/signup" className="flex items-center">
                                        Start Free Now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="premium" className="mt-6">
                            <div className="space-y-6 text-center max-w-3xl mx-auto mb-10">
                                <Badge variant="outline" className={`px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-200 shadow-sm`}>
                                    {data.premium.icon} {data.premium.title}
                                </Badge>
                                <h3 className="text-[clamp(1.5rem,4vw,1.875rem)] font-bold text-slate-800">{data.premium.heading}</h3>
                                <p className="text-[clamp(0.9rem,2.5vw,1rem)] text-muted-foreground">{data.premium.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {displayedPremiumFeatures.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                    >
                                        <FeatureCard
                                            {...feature}
                                            isPro={true}
                                            color="blue"
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {data.premium.previewItems.length > 6 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center mt-10"
                                >
                                    <Button
                                        variant="outline"
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm"
                                        onClick={() => setShowAllPremium(!showAllPremium)}
                                    >
                                        {showAllPremium ? 'Show Less' : 'Show All Premium Features'}
                                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAllPremium ? 'rotate-180' : ''}`} />
                                    </Button>
                                </motion.div>
                            )}

                            <div className="text-center mt-12">
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 transition-transform hover:scale-105">
                                    <Link to="/pricing" className="flex items-center">
                                        Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div >

                {/* Feature Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="py-12 md:py-20 border-t border-slate-200"
                >
                    <div className="space-y-6 text-center max-w-3xl mx-auto mb-8 md:mb-12 px-4">
                        <h2 className="text-[clamp(1.5rem,5vw,2.5rem)] font-bold bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
                            Free vs Premium Comparison
                        </h2>
                        <p className="text-[clamp(1rem,2.5vw,1.125rem)] text-muted-foreground">
                            See which plan best suits your team's needs
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden px-3 md:px-0">
                        {/* Table Header - Responsive */}
                        <div className="grid grid-cols-12 gap-2 font-medium text-[clamp(0.875rem,2.5vw,1rem)] p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                            <div className="col-span-4 md:col-span-4 font-semibold text-slate-700">Feature</div>
                            <div className="col-span-4 md:col-span-4 text-center text-emerald-600 font-semibold">Free</div>
                            <div className="col-span-4 md:col-span-4 text-center text-blue-600 font-semibold">Premium</div>
                        </div>

                        {/* Comparison Items - Responsive Layout */}
                        {comparisonFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                className={`grid grid-cols-12 gap-2 p-3 md:p-5 ${index < comparisonFeatures.length - 1 ? 'border-b border-slate-100' : ''
                                    } ${activeComparison === feature.name ? 'bg-slate-50 shadow-sm' : ''
                                    } hover:bg-blue-50/30 transition-colors cursor-pointer`}
                                onClick={() => setActiveComparison(activeComparison === feature.name ? null : feature.name)}
                                whileHover={{ scale: 1.005 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <div className="col-span-4 md:col-span-4 font-medium text-slate-700 flex items-center text-[clamp(0.75rem,2vw,1rem)]">
                                    <span className="hidden sm:inline-block">{getFeatureIcon(feature.icon)}</span>
                                    <span className="line-clamp-2 sm:line-clamp-1">{feature.name}</span>
                                </div>
                                <div className="col-span-4 md:col-span-4 flex items-center justify-center">
                                    <div className="inline-flex items-center py-1 px-1.5 sm:px-3 rounded-full bg-emerald-50 text-emerald-700 text-[clamp(0.7rem,1.8vw,0.875rem)]">
                                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mr-0.5 sm:mr-1.5 flex-shrink-0" />
                                        <span className="line-clamp-2 text-left">{feature.free}</span>
                                    </div>
                                </div>
                                <div className="col-span-4 md:col-span-4 flex items-center justify-center">
                                    <div className="inline-flex items-center py-1 px-1.5 sm:px-3 rounded-full bg-blue-50 text-blue-700 text-[clamp(0.7rem,1.8vw,0.875rem)]">
                                        <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-0.5 sm:mr-1.5 flex-shrink-0" />
                                        <span className="line-clamp-2 text-left">{feature.premium}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="py-16 md:py-24 text-center"
                >
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 via-blue-500 to-green-400 rounded-2xl p-1 shadow-xl">
                        <div className="bg-gradient-to-br from-blue-600/95 to-blue-700/95 backdrop-blur-sm rounded-2xl p-10 text-white py-14 relative overflow-hidden">
                            {/* Background decorative elements */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="relative z-10 inline-block bg-white/90 rounded-full p-3 shadow-lg mb-10"
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-full p-4 shadow-inner">
                                    <Star className="h-8 w-8 text-white" />
                                </div>
                            </motion.div>

                            <h2 className="text-[clamp(1.875rem,5vw,2.5rem)] font-bold mb-6 relative z-10">Elevate Your Communication Today</h2>
                            <p className="text-[clamp(1.125rem,3vw,1.25rem)] mb-10 text-white/90 max-w-2xl mx-auto relative z-10">
                                Join thousands of teams already using our platform to connect and collaborate more effectively
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center relative z-10">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-white/30 px-8">
                                    <Link to="/signup" className="flex items-center text-[clamp(0.875rem,2.2vw,1rem)]">
                                        Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>

                                <Button size="lg" variant="outline" className="bg-white/20 border-white/60 text-white hover:bg-white/30 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-black/5 px-8">
                                    <Link to="/demo" className="flex items-center text-[clamp(0.875rem,2.2vw,1rem)]">
                                        Schedule Demo
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </>
    );
}